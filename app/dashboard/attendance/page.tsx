"use client";

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
import {
  getMemberCards,
  getPeakHours,
  getWeeklyAttendance,
  getAttendanceList,
  AttendanceLogItem,
} from "@/lib/api/dashboard";

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
};

export default function AttendanceTracking() {
  const [todayCount, setTodayCount] = useState<number>(0);
  const [peakHour, setPeakHour] = useState<string>("...");
  const [weeklyAttendance, setWeeklyAttendance] = useState<number>(0);
  const [statsLoading, setStatsLoading] = useState(true);

  // Table State
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("today");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tableLoading, setTableLoading] = useState(true);

  const itemsPerPage = 5;

  // Fetch Stats (Today, Peak, Weekly)
  useEffect(() => {
    async function fetchStats() {
      try {
        setStatsLoading(true);
        const [stats, peakData, weeklyData] = await Promise.all([
          getMemberCards(),
          getPeakHours(),
          getWeeklyAttendance(),
        ]);

        if (stats?.["Today Check-ins Card"]) {
          setTodayCount(stats["Today Check-ins Card"].value);
        }
        setPeakHour(peakData?.peak_window || "N/A");
        if (weeklyData !== null) setWeeklyAttendance(weeklyData);
      } catch (error) {
        console.error("Error fetching attendance stats:", error);
      } finally {
        setStatsLoading(false);
      }
    }
    fetchStats();
  }, []);

  // Fetch Attendance List
  useEffect(() => {
    async function fetchLogs() {
      try {
        setTableLoading(true);
        const { logs, totalCount } = await getAttendanceList(
          currentPage,
          itemsPerPage,
          searchQuery,
          dateFilter,
          statusFilter,
        );
        setAttendanceLogs(logs);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setTableLoading(false);
      }
    }
    fetchLogs();
  }, [currentPage, searchQuery, dateFilter, statusFilter]);

  // Columns configuration for DataTable
  const columns = [
    {
      header: "Member",
      className: "w-[30%]",
      accessor: (item: AttendanceLogItem) => (
        <div className="flex items-center gap-4">
          <UserAvatar name={item.full_name} />
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-sm font-lexend">
              {toTitleCase(item.full_name)}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-secondary">
              ID: {item.short_id}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Membership",
      className: "w-[25%]",
      accessor: (item: AttendanceLogItem) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm font-lexend">
            {item.type === "staff"
              ? toTitleCase(item.staff_subrole || "Staff")
              : toTitleCase(item.membership_type || "No Plan")}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-secondary">
            {item.type}
          </span>
        </div>
      ),
    },
    {
      header: "Check-in Time",
      className: "w-[25%]",
      accessor: (item: AttendanceLogItem) => {
        const checkInDate = new Date(item.check_in_time);

        const formattedTime = checkInDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const formattedDate = checkInDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground text-sm font-lexend">
              {formattedTime}
            </span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-secondary">
              {dateFilter === "today" ? "Today" : formattedDate}
            </span>
          </div>
        );
      },
    },
    {
      header: "Status",
      className: "w-[20%]",
      accessor: (item: AttendanceLogItem) => (
        <StatusTag type={item.status as any} />
      ),
    },
  ];

  return (
    <div className="space-y-5">
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
          isLoading={statsLoading}
          icon={<CheckedInToday />}
          color="blue"
        />
        <StatCard
          title="Peak Hours (Avg)"
          value={peakHour}
          isLoading={statsLoading}
          icon={<PeakHours />}
          color="orange"
        />
        <StatCard
          title="Weekly Attendance"
          value={weeklyAttendance}
          isLoading={statsLoading}
          icon={<CalendarIcon />}
          color="purple"
        />
      </div>

      {/* 3. Search & Filter Bar */}
      <SearchFilter
        onSearch={(q) => {
          setSearchQuery(q);
          setCurrentPage(1); // Reset to first page on search
        }}
        filters={[
          {
            label: "Date",
            value: dateFilter,
            options: [
              { label: "Today", value: "today" },
              { label: "Yesterday", value: "yesterday" },
              { label: "This Week", value: "week" },
            ],
            onChange: (val) => {
              setDateFilter(val);
              setCurrentPage(1);
            },
          },
          {
            label: "Status",
            value: statusFilter,
            options: [
              { label: "All", value: "all" },
              { label: "Active", value: "Active" },
              { label: "Expired", value: "Expired" },
            ],
            onChange: (val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            },
          },
        ]}
      />

      {/* 4. Attendance Table */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm">
        <DataTable
          columns={columns}
          data={attendanceLogs}
          isLoading={tableLoading}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
}
