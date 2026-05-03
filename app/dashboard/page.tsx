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
        () => fetchStats()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance_logs" },
        () => fetchStats()
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
    </div>
  );
}
