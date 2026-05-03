import { createClient } from "@/lib/supabase/client";

export interface MemberCardData {
  value: number;
  trend: {
    label: string;
    type: "up" | "down" | "neutral";
  };
}

export interface MemberCardsResponse {
  "Total Members Card": MemberCardData;
  "Expiring Soon Card": MemberCardData;
  "Today Check-ins Card": MemberCardData;
}

/**
 * Fetches all member-related statistics in a single call for efficiency.
 */
export async function getMemberCards(): Promise<MemberCardsResponse> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_members_cards");

  if (error) {
    throw new Error(error.message);
  }

  return data as MemberCardsResponse;
}
