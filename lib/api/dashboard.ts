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
export async function getMembersList(
  page: number = 1,
  itemsPerPage: number = 10,
  searchQuery: string = "",
  statusFilter: string = "all",
  sortBy: string = "newest",
  dateFilter: string = "all",
  coachFilter: string = "all",
): Promise<MembersListResponse> {
  const supabase = createClient();
  const offset = (page - 1) * itemsPerPage;

  const { data, error } = await supabase.rpc("get_member_management_list", {
    p_limit: Math.floor(itemsPerPage),
    p_offset: Math.floor(offset),
    p_search_query: searchQuery,
    p_status_filter: statusFilter,
    p_sort_by: sortBy,
    p_date_range: dateFilter,
    p_coach_filter: coachFilter,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    members: (data.members || []) as MemberListItem[],
    totalCount: data.total_count || 0,
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
    supabase.from("staff").select(`
        id,
        profile:users (
          full_name
        )
      `),
  ]);

  // Flatten the coach data so the UI gets { id, full_name }
  const coaches = (staffRes.data || []).map((s: any) => ({
    id: s.id,
    full_name: s.profile?.full_name || "Unknown Coach",
  }));

  return {
    membershipTypes: mtRes.data || [],
    coaches: coaches,
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
  if (data && typeof data === "object" && !data.success) {
    throw new Error(data.error || "Failed to create member");
  }

  return data;
}

export async function getMemberDetails(userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc("get_member_details", {
    p_user_id: userId
  });

  if (error) {
    console.error("Error fetching member details:", error);
    return null;
  }

  return data;
}

export async function updateMemberProfile(payload: {
  userId: string;
  fullName: string;
  nickname: string;
  contactNumber: string;
  coachId: string | null;
}) {
  const supabase = createClient();
  
  const { data, error } = await supabase.rpc("update_member_profile", {
    p_user_id: payload.userId,
    p_full_name: payload.fullName,
    p_nickname: payload.nickname,
    p_contact_number: payload.contactNumber,
    p_coach_id: payload.coachId === "none" ? null : payload.coachId
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function renewMember(payload: {
  memberId: string;
  membershipTypeId: string | number;
  durationMonths: number;
}) {
  const supabase = createClient();
  const { error } = await supabase.rpc("renew_member_membership", {
    p_member_id: payload.memberId,
    p_membership_type_id: Number(payload.membershipTypeId),
    p_duration_months: payload.durationMonths,
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
