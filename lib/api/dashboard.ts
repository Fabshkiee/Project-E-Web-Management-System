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

export interface RecentAttendance {
  member_short_id: string;
  full_name: string;
  check_in_time: string;
  membershiptype: string;
  status: "Active" | "Expired" | "Expiring";
}

/**
 * Fetches the most recent attendance logs using the get_recent_attendance RPC.
 */
export async function getRecentAttendance(): Promise<RecentAttendance[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_recent_attendance");

  if (error) {
    throw new Error(error.message);
  }

  return data as RecentAttendance[];
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
