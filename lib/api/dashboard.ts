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

export interface AnalyticsSummary {
  active_members: { 
    value: number;
    delta: number;
  };
  signups: {
    current: number;
    last: number;
    delta: number;
  };
  returning: {
    current: number;
    last: number;
    delta: number;
  };
}

export interface MembershipSplitData {
  name: string;
  value: number;
  percentage: number;
}

export interface PeakHoursData {
  peak_window: string;
  breakdown: {
    morning: number;
    afternoon: number;
    evening: number;
  };
}

export interface RevenueSeries {
  day_index: number;
  date: string;
  revenue: number;
}

export interface RevenueTrendData {
  period: {
    curr_start: string;
    curr_end: string;
    prev_start: string;
    prev_end: string;
  };
  summary: {
    current_total: number;
    previous_total: number;
    trend_pct: number;
    trend_type: "up" | "down";
  };
  current_series: RevenueSeries[];
  previous_series: RevenueSeries[];
}

export interface MemberListItem {
  id: string;
  full_name: string;
  member_id: string;
  contact_number: string | null;
  membership_type: string;
  start_date: string;
  end_date: string;
  coach: string;
  member_status: string;
}

export interface MembersListResponse {
  members: MemberListItem[];
  totalCount: number;
}

export interface AttendanceLogItem {
  type: "member" | "staff" | "unknown";
  short_id: string;
  full_name: string;
  check_in_time: string;
  membership_type: string | null;
  staff_subrole: string | null;
  status: string;
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
  startDate?: string,
  endDate?: string,
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
    p_start_date: startDate || null,
    p_end_date: endDate || null,
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
  staff_short_id: string;
  full_name: string;
  check_in_time: string;
  membershiptype: string;
  staff_subrole: string | null;
  status: "Active" | "Expired" | "Expiring";
}

/**
 * Fetches the most recent attendance logs using the get_recent_attendance RPC.
 */
export async function getRecentAttendance(): Promise<RecentAttendance[]> {
  const now = Date.now();

  // 1. Return valid cached data
  if (
    recentAttendanceCache &&
    now - recentAttendanceCache.timestamp < CACHE_TTL
  ) {
    return recentAttendanceCache.data;
  }

  // 2. Return in-flight promise if it exists
  if (recentAttendanceCache?.promise) {
    return recentAttendanceCache.promise;
  }

  // 3. Create new request
  const fetchPromise = (async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_recent_attendance");
    if (error) throw new Error(error.message);

    recentAttendanceCache = { data, timestamp: Date.now(), promise: null };
    return data;
  })();

  recentAttendanceCache = { data: null, timestamp: 0, promise: fetchPromise };
  return fetchPromise;
}

/**
 * Fetches all member-related statistics in a single call for efficiency.
 */
export async function getMemberCards(): Promise<MemberCardsResponse> {
  const now = Date.now();

  if (memberCardsCache && now - memberCardsCache.timestamp < CACHE_TTL) {
    return memberCardsCache.data;
  }

  if (memberCardsCache?.promise) {
    return memberCardsCache.promise;
  }

  const fetchPromise = (async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_members_cards");
    if (error) throw new Error(error.message);

    memberCardsCache = { data, timestamp: Date.now(), promise: null };
    return data;
  })();

  memberCardsCache = { data: null, timestamp: 0, promise: fetchPromise };
  return fetchPromise;
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

// Cache settings
const CACHE_TTL = 30000; // 30 seconds
let memberCardsCache: {
  data: any;
  timestamp: number;
  promise: Promise<any> | null;
} | null = null;
let recentAttendanceCache: {
  data: any;
  timestamp: number;
  promise: Promise<any> | null;
} | null = null;
let peakHoursCache: {
  data: any;
  timestamp: number;
  promise: Promise<any> | null;
} | null = null;
let weeklyAttendanceCache: {
  data: any;
  timestamp: number;
  promise: Promise<any> | null;
} | null = null;
let analyticsSummaryCache: {
  data: AnalyticsSummary | null;
  timestamp: number;
  promise: Promise<AnalyticsSummary> | null;
} | null = null;
let membershipSplitCache: {
  data: MembershipSplitData[] | null;
  timestamp: number;
  promise: Promise<MembershipSplitData[]> | null;
} | null = null;
let revenueTrendCache: {
  data: RevenueTrendData | null;
  timestamp: number;
  promise: Promise<RevenueTrendData> | null;
  key?: string;
} | null = null;
let formOptionsCache: Promise<any> | null = null;

/**
 * Clears the dashboard data cache.
 * Use this when a Realtime update is received to ensure fresh data.
 */
export function clearDashboardCache() {
  memberCardsCache = null;
  recentAttendanceCache = null;
  peakHoursCache = null;
  weeklyAttendanceCache = null;
  analyticsSummaryCache = null;
  membershipSplitCache = null;
  revenueTrendCache = null;
}

/**
 * Fetches dynamic options for the Add Member modal (Memberships & Coaches)
 */
export async function getMemberFormOptions() {
  if (formOptionsCache) return formOptionsCache;

  formOptionsCache = (async () => {
    const supabase = createClient();
    const [mtRes, staffRes] = await Promise.all([
      supabase.from("membership_types").select("id, name, monthly_fee, student_fee"),

      supabase.from("staff").select(`
          id,
          profile:users (
            full_name
          )
        `),
    ]);

    const coaches = (staffRes.data || []).map((s: any) => ({
      id: s.id,
      full_name: s.profile?.full_name || "Unknown Coach",
    }));

    return {
      membershipTypes: mtRes.data || [],
      coaches: coaches,
    };
  })();

  return formOptionsCache;
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

  clearDashboardCache();
  return data;
}

export async function getMemberDetails(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_member_details", {
    p_user_id: userId,
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
    p_coach_id: payload.coachId === "none" ? null : payload.coachId,
  });

  if (error) throw new Error(error.message);
  clearDashboardCache();
  return data;
}

export async function renewMember(payload: {
  memberId: string;
  membershipTypeId: string | number;
  durationMonths: number;
  isDiscounted?: boolean;
  processedBy?: string;
}) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("renew_member", {
    p_member_id: payload.memberId,
    p_membership_type_id: Number(payload.membershipTypeId),
    p_duration_months: payload.durationMonths,
    p_is_discounted: payload.isDiscounted ?? null,
    p_processed_by: payload.processedBy ?? null,
  });


  if (error) {
    throw new Error(error.message);
  }

  if (data && typeof data === "object" && !data.success) {
    throw new Error(data.error || "Failed to renew membership");
  }

  clearDashboardCache();
  return true;
}


export async function terminateMembership(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("terminate_member_membership", {
    p_user_id: userId,
  });

  if (error) throw new Error(error.message);

  if (data && typeof data === "object" && !data.success) {
    throw new Error(data.error || "Failed to terminate membership");
  }

  clearDashboardCache();
  return true;
}

/**
 * Fetches peak occupancy data for the analytics dashboard
 */
export async function getPeakHours(): Promise<PeakHoursData | null> {
  const now = Date.now();
  if (peakHoursCache && now - peakHoursCache.timestamp < CACHE_TTL) {
    return peakHoursCache.data;
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_peak_hours");
  if (error) {
    console.error("Error fetching peak hours:", error);
    return null;
  }

  peakHoursCache = { data, timestamp: now, promise: null };
  return data as PeakHoursData;
}

export async function getWeeklyAttendance() {
  const now = Date.now();
  if (
    weeklyAttendanceCache &&
    now - weeklyAttendanceCache.timestamp < CACHE_TTL
  ) {
    return weeklyAttendanceCache.data;
  }

  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_weekly_attendance_count");
  if (error) {
    console.error("Error fetching weekly attendance:", error);
    return null;
  }

  weeklyAttendanceCache = { data, timestamp: now, promise: null };
  return data;
}

/**
 * Fetches the whole attendance log
 */
export async function getAttendanceList(
  page: number = 1,
  limit: number = 5,
  searchQuery: string = "",
  dateFilter: string = "all",
  statusFilter: string = "all",
  startDate?: string,
  endDate?: string,
) {
  const supabase = createClient();
  const offset = (page - 1) * limit;

  const { data, error } = await supabase.rpc("get_attendance_list", {
    p_search_query: searchQuery,
    p_date_filter: dateFilter,
    p_status_filter: statusFilter,
    p_limit: limit,
    p_offset: offset,
    p_start_date: startDate || null,
    p_end_date: endDate || null,
  });

  if (error) throw new Error(error.message);

  return {
    logs: (data.logs ?? []) as AttendanceLogItem[],
    totalCount: (data.total_count ?? 0) as number,
  };
}

/**
 * Manually records an attendance log entry via RPC.
 */
export async function manualCheckIn(
  userId: string,
  status: string,
  role?: string,
) {
  const supabase = createClient();
  const { error } = await supabase.rpc("manual_check_in", {
    p_user_id: userId,
    p_status: status,
    p_role: role || null,
  });

  if (error) throw new Error(error.message);

  clearDashboardCache();
  return true;
}

export interface StaffListItem {
  id: string;
  name: string;
  staff_id: string;
  role: "Coach" | "Receptionist" | "Maintenance" | "Admin";
  contact: string;
  last_active: string;
}

export interface StaffListResponse {
  staff: StaffListItem[];
  totalCount: number;
}

/**
 * Fetches a paginated list of staff members
 */
export async function getStaffList(
  page: number = 1,
  itemsPerPage: number = 10,
  searchQuery: string = "",
  roleFilter: string = "all",
): Promise<StaffListResponse> {
  const supabase = createClient();
  const offset = (page - 1) * itemsPerPage;

  const { data, error } = await supabase.rpc("get_staff_management_list", {
    p_limit: Math.floor(itemsPerPage),
    p_offset: Math.floor(offset),
    p_search_query: searchQuery,
    p_role_filter: roleFilter,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    staff: (data.staff || []) as StaffListItem[],
    totalCount: data.total_count || 0,
  };
}

export interface CreateStaffPayload {
  p_full_name: string;
  p_nickname: string | null;
  p_short_id: string | null;
  p_contact_number: string | null;
  p_base_role: string;
  p_subrole: string;
}

/**
 * Calls the RPC to create a new staff profile
 */
export async function createStaffProfile(payload: CreateStaffPayload) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("create_staff_profile", payload);

  if (error) {
    throw new Error(error.message);
  }

  if (data && typeof data === "object" && !data.success) {
    throw new Error(data.error || "Failed to create staff member");
  }

  clearDashboardCache();
  return data;
}
/**
 * Calls the RPC to fetch detailed information for a single staff member
 */
const BASE_ROLE_OPTIONS = [
  { label: "Staff", value: "Staff" },
  { label: "Admin", value: "Admin" },
];

export async function getStaffDetails(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_staff_details", {
    p_user_id: userId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Calls the RPC to update an existing staff profile
 */
export async function updateStaffProfile(payload: {
  p_user_id: string;
  p_full_name: string;
  p_nickname: string;
  p_contact_number: string;
  p_role: string;
  p_subrole: string;
}) {
  const supabase = createClient();
  const { error } = await supabase.rpc("update_staff_profile", payload);

  if (error) {
    throw new Error(error.message);
  }

  clearDashboardCache();
  return true;
}

/**
 * Fetches the analytics summary for the analytics page stat cards
 */
export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const now = Date.now();

  if (
    analyticsSummaryCache &&
    now - analyticsSummaryCache.timestamp < CACHE_TTL
  ) {
    return analyticsSummaryCache.data!;
  }

  if (analyticsSummaryCache?.promise) {
    return analyticsSummaryCache.promise;
  }

  const fetchPromise = (async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_analytics_summary");
    if (error) throw new Error(error.message);

    analyticsSummaryCache = { data, timestamp: Date.now(), promise: null };
    return data;
  })();

  analyticsSummaryCache = {
    data: null,
    timestamp: 0,
    promise: fetchPromise,
  };
  return fetchPromise;
}

/**
 * Fetches the membership plan split data for the donut chart
 */
export async function getMembershipSplit(): Promise<MembershipSplitData[]> {
  const now = Date.now();

  if (
    membershipSplitCache &&
    now - membershipSplitCache.timestamp < CACHE_TTL
  ) {
    return membershipSplitCache.data!;
  }

  if (membershipSplitCache?.promise) {
    return membershipSplitCache.promise;
  }

  const fetchPromise = (async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_membership_split_data");
    if (error) throw new Error(error.message);

    membershipSplitCache = { data, timestamp: Date.now(), promise: null };
    return data;
  })();

  membershipSplitCache = {
    data: null,
    timestamp: 0,
    promise: fetchPromise,
  };
  return fetchPromise;
}

/**
 * Fetches the revenue trend data for the line chart
 */
export async function getRevenueTrendData(
  range: string = "last_30",
  startDate?: string,
  endDate?: string,
): Promise<RevenueTrendData> {
  const cacheKey = `${range}_${startDate || ""}_${endDate || ""}`;
  const now = Date.now();

  if (
    revenueTrendCache &&
    revenueTrendCache.key === cacheKey &&
    now - revenueTrendCache.timestamp < CACHE_TTL
  ) {
    return revenueTrendCache.data!;
  }

  if (revenueTrendCache?.promise && revenueTrendCache.key === cacheKey) {
    return revenueTrendCache.promise;
  }

  const fetchPromise = (async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_revenue_trend_data", {
      p_range: range,
      p_start_date: startDate || null,
      p_end_date: endDate || null,
    });
    if (error) throw new Error(error.message);

    revenueTrendCache = {
      data,
      timestamp: Date.now(),
      promise: null,
      key: cacheKey,
    };
    return data;
  })();

  revenueTrendCache = {
    data: null,
    timestamp: 0,
    promise: fetchPromise,
    key: cacheKey,
  };
  return fetchPromise;
}
