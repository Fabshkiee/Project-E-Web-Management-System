"use client";

// 1. Imports from your UI and Dashboard component folders
import PageTitle from "@/components/dashboard/page-title";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import {
  ExportPNG,
  PlusIcon,
  CheckedInToday,
  CalendarIcon,
  PeakHours,
} from "@/components/ui/Icons";
import { StatCard } from "@/components/ui/StatCard";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { DataTable } from "@/components/dashboard/data-table";
import { Pagination } from "@/components/ui/Pagination";
import { StatusTag } from "@/components/ui/StatusTag";
import { UserAvatar } from "@/components/ui/UserAvatar";
import React, { useState, useEffect } from "react";
import { getMemberCards } from "@/lib/api/dashboard"; // for checkin today

export default function AttendanceTracking() {
  const [todayCount, setTodayCount] = useState<number | string>("...");
  useEffect(() => {
    async function fetchStats() {
      try {
        const stats = await getMemberCards();
        // Just extract the checkin today card value
        setTodayCount(stats["Today Check-ins Card"].value);
      } catch (error) {
        console.error("Error fetching check-in stats:", error);
        setTodayCount(0); // Fallback
      }
    }
    fetchStats();
  }, []);

  // Columns configuration for DataTable
  const columns = [
    {
      header: "MEMBER",
      accessor: (item: any) => (
        <div className="flex items-center gap-4">
          {/* Avatar Bubble */}
          <UserAvatar name={item.member} />
          {/* Name and ID */}
          <div>
            <p className="font-medium text-foreground">{item.member}</p>
            <p className="text-[11px] font-medium uppercase tracking-wider text-secondary mt-0.5">
              ID: {item.memberId}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "CHECK-IN TIME",
      accessor: (item: any) => (
        <div>
          <p className="font-medium text-foreground">{item.time}</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-secondary mt-0.5">
            Today
          </p>
        </div>
      ),
    },
    {
      header: "STATUS",
      accessor: (item: any) => (
        // FIXED: Using 'type' prop instead of 'status'
        <StatusTag type={item.status} />
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 min-h-screen">
      {/* 1. Page Header */}
      <header className="flex justify-between items-center">
        <PageTitle
          title="Attendance Tracking"
          subtitle="Monitor real-time gym check-ins and history."
        />
        <div className="flex gap-3">
          <SecondaryButton icon={<ExportPNG />}>
            Export Logs (CSV)
          </SecondaryButton>
          <PrimaryButton icon={<PlusIcon />}>Manual Check-in</PrimaryButton>
        </div>
      </header>

      {/* 2. Stats Row (Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Checked in Today"
          value={todayCount}
          icon={<CheckedInToday />}
          color="blue"
        />
        <StatCard
          title="Peak Hours (Avg)"
          value="5pm - 7pm"
          icon={<PeakHours />}
          color="orange"
        />
        <StatCard
          title="Weekly Attendance"
          value="856"
          icon={<CalendarIcon />}
          color="purple"
        />
      </div>

      {/* 3. Search & Filter Bar */}
      <SearchFilter
        onSearch={(q) => console.log(q)}
        filters={[
          {
            label: "Date",
            value: "today",
            options: [{ label: "Today", value: "today" }],
            onChange: (val) => console.log(`Date changed: ${val}`),
          },
          {
            label: "Status",
            value: "all",
            options: [{ label: "Status: All", value: "all" }],
            onChange: (val) => console.log(`Status changed: ${val}`),
          },
        ]}
      />

      {/* 4. Attendance Table */}
      {/* Wrap DataTable and Pagination in a standard container card */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm">
        <DataTable columns={columns} data={[]} />

        <Pagination
          currentPage={1}
          totalItems={124}
          itemsPerPage={5}
          onPageChange={(page) => console.log(page)}
        />
      </div>
    </div>
  );
}
