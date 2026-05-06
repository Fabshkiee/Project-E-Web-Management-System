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
import {
  getMemberCards,
  MemberCardsResponse,
  getRecentAttendance,
  RecentAttendance,
} from "@/lib/api/dashboard";
import { createClient } from "@/lib/supabase/client";
import { DataTable } from "@/components/dashboard/data-table";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { StatusTag } from "@/components/ui/StatusTag";
import QuickActions from "@/components/dashboard/quick-actions";
import SystemStatus from "@/components/dashboard/system-status";

const attendanceColumns = [
  {
    header: "Member",
    accessor: (item: RecentAttendance) => (
      <div className="flex items-center gap-4">
        <div className="transition-transform duration-300 group-hover:scale-110">
          <UserAvatar name={item.full_name || "Unknown"} />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm font-lexend">
            {item.full_name || "Unknown Member"}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-secondary">
            ID: {item.member_short_id}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Check-in Time",
    accessor: (item: RecentAttendance) => (
      <span className="text-sm font-medium text-foreground font-lexend">
        {new Date(item.check_in_time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    ),
  },
  {
    header: "Membership",
    accessor: (item: RecentAttendance) => (
      <span className="text-sm font-medium text-secondary font-lexend">
        {item.membershiptype}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: (item: RecentAttendance) => (
      <StatusTag type={item.status as any} />
    ),
    className: "text-right md:text-left",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState<MemberCardsResponse | null>(null);
  const [attendance, setAttendance] = useState<RecentAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (isInitialLoad.current) setLoading(true);

        const [statsData, attendanceData] = await Promise.all([
          getMemberCards(),
          getRecentAttendance(),
        ]);

        setStats(statsData);
        setAttendance(attendanceData);
        setError(false);
        isInitialLoad.current = false;
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    // 1. Initial fetch
    fetchData();

    // 2. Set up realtime subscription
    const supabase = createClient();
    const channel = supabase
      .channel("dashboard-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        () => fetchData(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance_logs" },
        () => fetchData(),
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
    <main className="space-y-12">
      <header>
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
      </header>

      {/* Quick Stats Overview */}
      <section
        aria-label="Quick Stats"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
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
      </section>

      {/* Main Dashboard Content */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Attendance Table Section (Left) */}
        <section
          aria-labelledby="attendance-title"
          className="lg:col-span-8 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm"
        >
          <header className="px-8 py-6 border-b border-stroke dark:border-white/5 flex justify-between items-center">
            <h2
              id="attendance-title"
              className="font-teko font-medium text-[20px] uppercase tracking-wider text-foreground"
            >
              Recent Attendance
            </h2>
            <button className="text-primary font-bold p-sm-md hover:underline decoration-2 underline-offset-4">
              View All
            </button>
          </header>
          <DataTable columns={attendanceColumns} data={attendance} />
        </section>

        {/* Sidebar (Right) */}
        <aside className="lg:col-span-4 space-y-8">
          <QuickActions />
          <SystemStatus />
        </aside>
      </section>
    </main>
  );
}
