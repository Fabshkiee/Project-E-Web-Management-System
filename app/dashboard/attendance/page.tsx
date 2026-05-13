"use client";

import PageTitle from "@/components/dashboard/page-title";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import {
  PlusIcon,
  CheckedInToday,
  CalendarIcon,
  PeakHours,
  DownloadIcon,
} from "@/components/ui/Icons";
import { StatCard } from "@/components/ui/StatCard";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { DataTable } from "@/components/dashboard/data-table";
import { Pagination } from "@/components/ui/Pagination";
import { StatusTag } from "@/components/ui/StatusTag";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { DatePicker } from "@/components/ui/DatePicker";
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getMemberCards,
  getPeakHours,
  getWeeklyAttendance,
  getAttendanceList,
  AttendanceLogItem,
} from "@/lib/api/dashboard";
import ManualCheckInModal from "@/components/dashboard/manual-checkin-modal";

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
  const [dateFilter, setDateFilter] = useState("all"); // Default to All Time
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tableLoading, setTableLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [isManualCheckInOpen, setIsManualCheckInOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);


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
  }, [refreshTrigger]);

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
          startDate,
          endDate,
        );
        setAttendanceLogs(logs);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setTableLoading(false);
      }
    }
    const timer = setTimeout(fetchLogs, 400);
    return () => clearTimeout(timer);
  }, [
    currentPage,
    searchQuery,
    dateFilter,
    statusFilter,
    startDate,
    endDate,
    refreshTrigger,
  ]);

  // Set up Supabase Realtime listener
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("attendance-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance_logs" },
        () => {
          setRefreshTrigger((prev) => prev + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);



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

  // Export to CSV Logic
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      // Fetch all logs matching current filters (up to a reasonable limit)
      const { logs } = await getAttendanceList(
        1,
        3000, // Fetch up to 3000 logs for export
        searchQuery,
        dateFilter,
        statusFilter,
        startDate,
        endDate,
      );

      if (logs.length === 0) {
        alert("No logs found to export.");
        return;
      }

      // CSV Header
      const headers = [
        "Full Name",
        "Short ID",
        "Type",
        "Membership/Role",
        "Check-in Time",
        "Status",
      ];

      // Filter Summary Rows
      const filterInfo = [
        ["Report", "Attendance Logs Export"],
        ["Generated", new Date().toLocaleString()],
        [
          "Filters",
          `Date: ${dateFilter.toUpperCase()} | Status: ${statusFilter.toUpperCase()} | Search: ${searchQuery || "None"}`,
        ],
        ...(dateFilter === "custom"
          ? [["Date Range", `${startDate} to ${endDate}`]]
          : []),
        [], // Empty row separator
      ];

      // Map logs to CSV rows
      const dataRows = logs.map((log) => [
        `"${log.full_name}"`,
        `"${log.short_id}"`,
        `"${log.type}"`,
        `"${log.type === "staff" ? log.staff_subrole || "Staff" : log.membership_type || "No Plan"}"`,
        `"${new Date(log.check_in_time).toLocaleString("en-US")}"`,
        `"${log.status}"`,
      ]);

      const csvContent = [
        ...filterInfo.map((row) => row.join(",")),
        headers.join(","),
        ...dataRows.map((e) => e.join(",")),
      ].join("\n");

      // Download Logic
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `attendance_logs_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* 1. Page Header */}
      <header className="flex justify-between items-center">
        <PageTitle
          title="Attendance Tracking"
          subtitle="Monitor real-time gym check-ins and history."
        />
        <div className="flex gap-3">
          <SecondaryButton
            onClick={handleExportCSV}
            disabled={exporting}
            icon={<DownloadIcon className="w-5 h-5" />}
          >
            {exporting ? "Exporting..." : "Export Logs (CSV)"}
          </SecondaryButton>
          <PrimaryButton
            onClick={() => setIsManualCheckInOpen(true)}
            icon={<PlusIcon />}
          >
            Manual Check-in
          </PrimaryButton>
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
              { label: "All Time", value: "all" },
              { label: "Today", value: "today" },
              { label: "Yesterday", value: "yesterday" },
              { label: "This Week", value: "this_week" },
              { label: "Last 7 Days", value: "last_7_days" },
              { label: "This Month", value: "this_month" },
              { label: "Custom Range", value: "custom" },
            ],

            onChange: (val) => {
              setDateFilter(val);
              setCurrentPage(1);

              if (val !== "custom") {
                setStartDate("");
                setEndDate("");
              }
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

      {/* Custom Date Range Pickers (Conditional) */}
      {dateFilter === "custom" && (
        <div className="flex gap-4 p-5 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(val) => {
              setStartDate(val);
              setCurrentPage(1);
            }}
            className="flex-1"
          />

          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(val) => {
              setEndDate(val);
              setCurrentPage(1);
            }}
            className="flex-1"
          />
        </div>
      )}

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

      <ManualCheckInModal
        isOpen={isManualCheckInOpen}
        onClose={() => setIsManualCheckInOpen(false)}
        onSuccess={() => setRefreshTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
