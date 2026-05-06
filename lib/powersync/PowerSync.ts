import { PowerSyncDatabase } from "@powersync/web";
import { SupabaseConnector } from "./SupabaseConnector";
import { AppSchema } from "./schema";
import { SupabaseClient } from "@supabase/supabase-js";

// 1. Initialize the Database
export const db = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: "project_e_dashboard.db",
  },
});

// 2. Connect to your PowerSync Instance
export const POWERSYNC_URL = process.env.NEXT_PUBLIC_POWERSYNC_URL!;


let isInitialized = false;

export async function initPowerSync(supabase: SupabaseClient) {
  if (isInitialized) return;

  console.log("PowerSync: Initializing...");

  // Register a global error listener for the sync stream
  db.registerListener({
    syncError: (err) => {
      console.error("PowerSync: Sync Stream Error!", err.error);
    },
  });

  try {
    const connector = new SupabaseConnector(supabase, POWERSYNC_URL);
    console.log("PowerSync: Initializing connector...");
    await connector.init();

    console.log("PowerSync: Connecting to database...");
    await db.connect(connector);

    console.log("PowerSync: Connection established!");
    isInitialized = true;
  } catch (error) {
    console.error("PowerSync: Initialization failed", error);
  }
}
