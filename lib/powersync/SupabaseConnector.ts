import {
  AbstractPowerSyncDatabase,
  BaseObserver,
  CrudEntry,
  PowerSyncBackendConnector,
  UpdateType,
  type PowerSyncCredentials
} from '@powersync/web';
import { Session, SupabaseClient } from '@supabase/supabase-js';

export type SupabaseConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  powersyncUrl: string;
};

const FATAL_RESPONSE_CODES = [
  new RegExp('^22...$'),
  new RegExp('^23...$'),
  new RegExp('^42501$')
];

export type SupabaseConnectorListener = {
  initialized: () => void;
  sessionStarted: (session: Session) => void;
};

export class SupabaseConnector extends BaseObserver<SupabaseConnectorListener> implements PowerSyncBackendConnector {
  readonly client: SupabaseClient;
  readonly powersyncUrl: string;
  ready: boolean;
  currentSession: Session | null;

  constructor(client: SupabaseClient, powersyncUrl: string) {
    super();
    this.client = client;
    this.powersyncUrl = powersyncUrl;
    this.currentSession = null;
    this.ready = false;
  }

  async init() {
    if (this.ready) return;
    const sessionResponse = await this.client.auth.getSession();
    this.updateSession(sessionResponse.data.session);
    this.ready = true;
    this.iterateListeners((cb) => cb.initialized?.());
  }

  async fetchCredentials() {
    console.log('PowerSync: Fetching credentials...');
    
    // 1. Try to get current session immediately
    let { data: { session }, error } = await this.client.auth.getSession();
    
    if (error) {
      console.error('PowerSync: Credentials fetch error', error);
      throw error;
    }

    // 2. If no session, wait for it (handles hydration race on production)
    if (!session) {
      console.log('PowerSync: No session found, waiting for auth state...');
      session = await new Promise<Session | null>((resolve) => {
        const { data: { subscription } } = this.client.auth.onAuthStateChange((event, currentSession) => {
          if (currentSession) {
            subscription.unsubscribe();
            resolve(currentSession);
          }
        });

        // Timeout after 5 seconds so we don't hang forever if not logged in
        setTimeout(() => {
          subscription.unsubscribe();
          resolve(null);
        }, 5000);
      });
    }

    if (!session) {
      console.warn('PowerSync: No active Supabase session found after waiting');
      throw new Error('Not logged in');
    }

    console.log('PowerSync: Credentials fetched successfully');
    return {
      endpoint: this.powersyncUrl,
      token: session.access_token ?? ''
    } satisfies PowerSyncCredentials;
  }


  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    let lastOp: CrudEntry | null = null;
    try {
      for (const op of transaction.crud) {
        lastOp = op;
        const table = this.client.from(op.table);
        let result: any;
        switch (op.op) {
          case UpdateType.PUT:
            result = await table.upsert({ ...op.opData, id: op.id });
            break;
          case UpdateType.PATCH:
            result = await table.update(op.opData).eq('id', op.id);
            break;
          case UpdateType.DELETE:
            result = await table.delete().eq('id', op.id);
            break;
        }

        if (result.error) {
          console.error(result.error);
          throw new Error(`Could not update Supabase: ${result.error.message}`);
        }
      }
      await transaction.complete();
    } catch (ex: any) {
      if (typeof ex.code == 'string' && FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code))) {
        console.error('Data upload error - discarding:', lastOp, ex);
        await transaction.complete();
      } else {
        throw ex;
      }
    }
  }

  updateSession(session: Session | null) {
    this.currentSession = session;
    if (session) {
      this.iterateListeners((cb) => cb.sessionStarted?.(session));
    }
  }
}
