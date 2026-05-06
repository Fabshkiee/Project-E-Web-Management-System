"use client";

import React, { useEffect, useState, useRef } from "react";
import PageTitle from "@/components/dashboard/page-title";
import StatsCard from "@/components/dashboard/overview-card";
import {
  DumbellIcon,
  MoneyIcon,
  PeopleIcon,
  RedWarningIcon,
  RevenueIcon,
  TimerIcon,
} from "@/components/ui/Icons";
import { getMemberCards, MemberCardsResponse } from "@/lib/api/dashboard";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/dashboard/data-table";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { StatusTag } from "@/components/ui/StatusTag";

// Mock data for Recent Attendance
const recentAttendanceData = [
  {
    member: { name: "Marcus Johnson", id: "#8821" },
    checkInTime: "10:42 AM",
    membership: "Standard",
    status: "Active" as const,
  },
  {
    member: { name: "Sarah Connor", id: "#9932" },
    checkInTime: "10:38 AM",
    membership: "Supervision",
    status: "Active" as const,
  },
  {
    member: { name: "James Doe", id: "#5322" },
    checkInTime: "10:15 AM",
    membership: "Coaching",
    status: "Active" as const,
  },
  {
    member: { name: "Mike Ross", id: "LOGIN FAILED" },
    checkInTime: "09:55 AM",
    membership: "Standard",
    status: "Expired" as const,
  },
];

const attendanceColumns = [
  {
    header: "Member",
    accessor: (item: (typeof recentAttendanceData)[0]) => (
      <div className="flex items-center gap-4">
        <UserAvatar name={item.member.name} />
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm font-lexend">
            {item.member.name}
          </span>
          <span
            className={`text-[11px] font-medium uppercase tracking-wider ${item.member.id === "LOGIN FAILED" ? "text-primary" : "text-secondary"}`}
          >
            {item.member.id === "LOGIN FAILED"
              ? "LOGIN FAILED"
              : `ID: ${item.member.id}`}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Check-in Time",
    accessor: (item: (typeof recentAttendanceData)[0]) => (
      <span className="text-sm font-medium text-foreground font-lexend">
        {item.checkInTime}
      </span>
    ),
  },
  {
    header: "Membership",
    accessor: (item: (typeof recentAttendanceData)[0]) => (
      <span className="text-sm font-medium text-secondary font-lexend">
        {item.membership}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: (item: (typeof recentAttendanceData)[0]) => (
      <StatusTag type={item.status} />
    ),
    className: "text-right md:text-left",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<MemberCardsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        // Only show loading skeleton if it's the very first load
        if (isInitialLoad.current) {
          setLoading(true);
        }

        const data = await getMemberCards();
        setStats(data);
        setError(false);
        isInitialLoad.current = false;
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    // 1. Initial fetch
    fetchStats();

    // 2. Set up realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        () => fetchStats(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance_logs" },
        () => fetchStats(),
      )
      .subscribe();

    // 3. Cleanup on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const totalMembers = stats?.["Total Members Card"];
  const expiringSoon = stats?.["Expiring Soon Card"];
  const todaysCheckins = stats?.["Today Check-ins Card"];

  return (
    <div>
      <PageTitle
        title="Gym Overview"
        subtitle={`Real-time statistics for ${new Date().toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {/* ... (StatsCards) */}
        <StatsCard
          label="Total Members"
          value={totalMembers?.value}
          trend={totalMembers?.trend}
          isLoading={loading}
          error={error}
          icon={<PeopleIcon className="w-12 h-12" />}
        />
        <StatsCard
          label="Today's Check-ins"
          value={todaysCheckins?.value}
          trend={todaysCheckins?.trend}
          isLoading={loading}
          error={error}
          icon={<DumbellIcon className="w-12 h-12" />}
        />
        <StatsCard
          label="Expiring Soon"
          value={expiringSoon?.value}
          trend={
            expiringSoon?.trend
              ? {
                  ...expiringSoon.trend,
                  icon: <TimerIcon className="w-3.5 h-3.5" />,
                }
              : undefined
          }
          isLoading={loading}
          error={error}
          icon={<RedWarningIcon className="w-12 h-10" />}
        />
        <StatsCard
          label="Monthly Revenue"
          value="₱42.5k"
          icon={<MoneyIcon className="w-12 h-10" />}
          trend={{
            label: "5%",
            type: "up",
            icon: <RevenueIcon className="w-3.5 h-3.5" />,
          }}
        />
      </div>

      {/* Recent Attendance Table Section */}
      <div className="mt-12 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm">
        <div className="px-8 py-6 border-b border-stroke dark:border-white/5 flex justify-between items-center">
          <h2 className="font-teko font-medium text-[20px] uppercase tracking-wider text-foreground">
            Recent Attendance
          </h2>
          <button className="text-primary font-bold p-sm-md hover:underline decoration-2 underline-offset-4">
            View All
          </button>
        </div>
        <DataTable columns={attendanceColumns} data={recentAttendanceData} />
      </div>
    </div>
  );
}
