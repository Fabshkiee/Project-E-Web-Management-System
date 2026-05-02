import { createClient } from "@/lib/supabase/client";

/**
 * Fetches the total number of active members using a Supabase RPC function.
 * This is optimized to return a single integer for efficiency.
 */
export async function getTotalActiveMembers(): Promise<number> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_total_active_members");

  if (error) {
    throw new Error(error.message);
  }

  return data as number;
}
