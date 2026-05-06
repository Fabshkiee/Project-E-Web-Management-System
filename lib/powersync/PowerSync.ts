import { PowerSyncDatabase } from "@powersync/web";
import { SupabaseConnector } from "./SupabaseConnector";
import { AppSchema } from "./schema";
import { SupabaseClient } from "@supabase/supabase-js";

// 1. Connection Config
export const POWERSYNC_URL = process.env.NEXT_PUBLIC_POWERSYNC_URL!;

// 2. Lazy singleton instance
let dbInstance: PowerSyncDatabase | null = null;
let isInitialized = false;

/**
 * Returns the PowerSync database instance.
 * Note: Must only be called on the client side after initPowerSync.
 */
export function getDb() {
  if (!dbInstance) {
    throw new Error("PowerSync: Database not initialized. Call initPowerSync first.");
  }
  return dbInstance;
}

export async function initPowerSync(supabase: SupabaseClient) {
  if (typeof window === "undefined") return; // Safety check for SSR
  if (isInitialized) return;

  console.log("PowerSync: Initializing...");

  try {
    // Initialize the database instance only in the browser
    if (!dbInstance) {
      dbInstance = new PowerSyncDatabase({
        schema: AppSchema,
        database: {
          dbFilename: "project_e_dashboard.db",
        },
      });
    }

    // Register a global error listener for the sync stream
    dbInstance.registerListener({
      syncError: (err) => {
        console.error("PowerSync: Sync Stream Error!", err.error);
      },
    });

    const connector = new SupabaseConnector(supabase, POWERSYNC_URL);
    console.log("PowerSync: Initializing connector...");
    await connector.init();

    console.log("PowerSync: Connecting to database...");
    await dbInstance.connect(connector);

    console.log("PowerSync: Connection established!");
    isInitialized = true;
  } catch (error) {
    console.error("PowerSync: Initialization failed", error);
  }
}
