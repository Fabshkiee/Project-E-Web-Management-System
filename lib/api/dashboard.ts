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

export interface MemberListItem {
  id: string;
  full_name: string;
  member_id: string;
  membership_type: string;
  start_date: string;
  end_date: string;
  coach: string;
  payment_status: string;
}

export interface MembersListResponse {
  members: MemberListItem[];
  totalCount: number;
}

/**
 * Fetches a paginated list of members using the get_member_management_list RPC
 */
export async function getMembersList(page: number = 1, itemsPerPage: number = 10): Promise<MembersListResponse> {
  const supabase = createClient();
  const offset = (page - 1) * itemsPerPage;

  const { data, error } = await supabase.rpc("get_member_management_list", {
    p_limit: itemsPerPage,
    p_offset: offset
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    members: (data.members || []) as MemberListItem[],
    totalCount: data.total_count || 0
  };
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

/**
 * Payload for the create_member_profile RPC
 */
export interface CreateMemberPayload {
  p_short_id: string | null;
  p_membership_type_id: string;
  p_coach_id: string | null;
  p_full_name: string;
  p_nickname: string | null;
  p_contact_number: string | null;
  p_started_date: string;
  p_duration_months: number;
  p_is_discounted: boolean;
}

/**
 * Fetches dynamic options for the Add Member modal (Memberships & Coaches)
 */
export async function getMemberFormOptions() {
  const supabase = createClient();
  
  const [mtRes, staffRes] = await Promise.all([
    supabase.from("membership_types").select("id, name"),
    supabase
      .from("staff")
      .select(`
        id,
        profile:users (
          full_name
        )
      `)
  ]);

  // Flatten the coach data so the UI gets { id, full_name }
  const coaches = (staffRes.data || []).map((s: any) => ({
    id: s.id,
    full_name: s.profile?.full_name || "Unknown Coach"
  }));

  return {
    membershipTypes: mtRes.data || [],
    coaches: coaches
  };
}

/**
 * Calls the RPC to create a new member profile
 */
export async function createMemberProfile(payload: CreateMemberPayload) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("create_member_profile", payload);

  if (error) {
    throw new Error(error.message);
  }

  // The RPC returns a JSON object. If it failed internally, it sets success: false.
  if (data && typeof data === 'object' && !data.success) {
    throw new Error(data.error || "Failed to create member");
  }

  return data;
}
