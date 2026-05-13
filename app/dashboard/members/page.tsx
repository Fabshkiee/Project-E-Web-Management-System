"use client";

import React, { useState, useEffect } from "react";
import PageTitle from "@/components/dashboard/page-title";
import { ExportPDF, PlusIcon } from "@/components/ui/Icons";
// Remove static imports to save memory and bundle size
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import AddMemberModal from "@/components/dashboard/add-member-modal";
import MemberDetailsModal from "@/components/dashboard/member-details-modal";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { DataTable } from "@/components/dashboard/data-table";
import { DatePicker } from "@/components/ui/DatePicker";
import {
  getMembersList,
  MemberListItem,
  getMemberFormOptions,
} from "@/lib/api/dashboard";
import { Pagination } from "@/components/ui/Pagination";
import { createClient } from "@/lib/supabase/client";

const toTitleCase = (str: string) => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
};

const MembersColumn = [
  {
    header: "Member",
    className: "w-[25%]",
    accessor: (item: MemberListItem) => (
      <div className="flex items-center gap-4">
        <div className="transition-transform duration-300 group-hover:scale-110">
          <UserAvatar name={item.full_name || "Unknown"} />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-foreground text-sm font-lexend whitespace-nowrap">
            {item.full_name}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.05em] text-secondary/60">
            ID: {item.member_id}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Status",
    className: "w-[12%]",
    accessor: (item: MemberListItem) => (
      <StatusTag type={item.member_status as any} />
    ),
  },
  {
    header: "Dates",
    className: "w-[18%]",
    accessor: (item: MemberListItem) => (
      <div className="flex flex-col gap-0.5">
        <div className="text-[11px] text-secondary font-medium font-lexend">
          <span className="opacity-60">Started:</span>{" "}
          {new Date(item.start_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
        <div className="text-[11px] font-medium font-lexend text-secondary">
          <span className="opacity-60">Expires:</span>{" "}
          {new Date(item.end_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
    ),
  },
  {
    header: "Membership",
    className: "w-[15%]",
    accessor: (item: MemberListItem) => (
      <span className="text-sm font-medium text-foreground font-lexend">
        {item.membership_type}
      </span>
    ),
  },
  {
    header: "Contact Number",
    className: "w-[15%]",
    accessor: (item: MemberListItem) => (
      <span
        className={`text-sm font-medium font-lexend ${
          item.contact_number === null
            ? "text-muted/40 italic"
            : "text-secondary"
        }`}
      >
        {item.contact_number === null ? "No contact" : item.contact_number}
      </span>
    ),
  },
  {
    header: "Coach",
    className: "w-[15%]",
    accessor: (item: MemberListItem) => (
      <span
        className={`text-sm font-medium font-lexend ${
          item.coach === "None" ? "text-muted/40 italic" : "text-secondary"
        }`}
      >
        {item.coach === "None" ? "No coach" : toTitleCase(item.coach)}
      </span>
    ),
  },
];

export default function Members() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [coachFilter, setCoachFilter] = useState("all");
  const [coachOptions, setCoachOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [realtimeTrigger, setRealtimeTrigger] = useState(0);
  const [members, setMembers] = useState<MemberListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [exporting, setExporting] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchCoaches() {
      try {
        const { coaches } = await getMemberFormOptions();
        const options = coaches.map((c) => ({
          label: "Coach " + c.full_name.split(" ")[0],
          value: c.full_name,
        }));
        setCoachOptions([
          { label: "All Coaches", value: "all" },
          ...options,
          { label: "None", value: "none" },
        ]);
      } catch (error) {
        console.error("Error fetching coaches:", error);
      }
    }
    fetchCoaches();
  }, []);

  // Set up Supabase Realtime listener
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("dashboard-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "members" },
        () => {
          setRealtimeTrigger((prev) => prev + 1);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        () => {
          setRealtimeTrigger((prev) => prev + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let apiStatus = statusFilter;
        let apiSort = "newest";

        if (statusFilter === "newest" || statusFilter === "oldest") {
          apiStatus = "all";
          apiSort = statusFilter;
        }

        const { members: fetchedMembers, totalCount: fetchedTotal } =
          await getMembersList(
            currentPage,
            itemsPerPage,
            searchQuery,
            apiStatus,
            apiSort,
            dateFilter,
            coachFilter,
            startDate,
            endDate,
          );
        setMembers(fetchedMembers);
        setTotalCount(fetchedTotal);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchData, 400);
    return () => clearTimeout(timer);
  }, [
    currentPage,
    searchQuery,
    statusFilter,
    dateFilter,
    coachFilter,
    realtimeTrigger,
    startDate,
    endDate,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleDateChange = (val: string) => {
    setDateFilter(val);
    setCurrentPage(1);
  };

  const handleCoachChange = (val: string) => {
    setCoachFilter(val);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      setExporting(true);

      let apiStatus = statusFilter;
      let apiSort = "newest";

      if (statusFilter === "newest" || statusFilter === "oldest") {
        apiStatus = "all";
        apiSort = statusFilter;
      }

      const { members: allMembers } = await getMembersList(
        1,
        1000,
        searchQuery,
        apiStatus,
        apiSort,
        dateFilter,
        coachFilter,
      );

      // Dynamically load heavy PDF libraries only when needed
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();

      // Report Header
      doc.setFontSize(20);
      doc.setTextColor(17, 24, 39);
      doc.text("Project-E: Members Report", 14, 22);

      doc.setFontSize(11);
      doc.setTextColor(107, 114, 128);
      doc.text(
        `Generated on ${new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
        14,
        30,
      );

      // Filters Summary
      doc.setFontSize(9);
      doc.text(
        `Filters Applied - Status: ${statusFilter.toUpperCase()} | Date Range: ${dateFilter.toUpperCase()} | Coach: ${coachFilter.toUpperCase()}`,
        14,
        38,
      );

      // Table Data
      const tableData = allMembers.map((m) => [
        m.full_name,
        m.member_id,
        m.member_status,
        m.membership_type,
        new Date(m.start_date).toLocaleDateString("en-GB"),
        new Date(m.end_date).toLocaleDateString("en-GB"),
        m.coach || "None",
      ]);

      autoTable(doc, {
        startY: 45,
        head: [
          [
            "Member Name",
            "ID",
            "Status",
            "Membership",
            "Started",
            "Expires",
            "Coach",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: "#f20d33",
          fontSize: 10,
          halign: "left",
          font: "helvetica",
          fontStyle: "bold",
        },
        bodyStyles: { fontSize: 9, textColor: [55, 65, 81], font: "helvetica" },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        margin: { top: 45 },
        didDrawPage: (data) => {
          // Footer with page numbers
          const str = `Page ${doc.internal.pages.length}`;
          doc.setFontSize(8);
          doc.setTextColor(156, 163, 175);
          doc.text(
            str,
            data.settings.margin.left,
            doc.internal.pageSize.height - 10,
          );
        },
      });

      doc.save(
        `ProjectE_Members_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <PageTitle
          title="Members Management"
          subtitle="Manage gym members, subscription, and status."
        />
        <div className="flex gap-3">
          <SecondaryButton
            onClick={handleExport}
            disabled={exporting}
            icon={<ExportPDF className="w-6 h-6" />}
          >
            {exporting ? "Exporting..." : "Export List (PDF)"}
          </SecondaryButton>
          <PrimaryButton
            onClick={() => setIsModalOpen(true)}
            icon={<PlusIcon className="w-6 h-6" />}
          >
            Add New Member
          </PrimaryButton>
        </div>
      </header>

      <SearchFilter
        onSearch={handleSearch}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: handleStatusChange,
            options: [
              { label: "Active", value: "active" },
              { label: "Expired", value: "expired" },
              { label: "Expiring", value: "expiring" },
              { label: "Newest Join Date", value: "newest" },
              { label: "Oldest Join Date", value: "oldest" },
            ],
          },
          {
            label: "Dates",
            value: dateFilter,
            onChange: (val) => {
              handleDateChange(val);
              if (val !== "custom") {
                setStartDate("");
                setEndDate("");
              }
            },
            options: [
              { label: "All Time", value: "all" },
              { label: "Today", value: "today" },
              { label: "Yesterday", value: "yesterday" },
              { label: "This Week", value: "this_week" },
              { label: "Last 7 Days", value: "last_7_days" },
              { label: "This Month", value: "this_month" },
              { label: "Custom", value: "custom" },
            ],
          },
          {
            label: "Coach",
            value: coachFilter,
            onChange: handleCoachChange,
            options:
              coachOptions.length > 0
                ? coachOptions
                : [
                    { label: "All Coaches", value: "all" },
                    { label: "None", value: "none" },
                  ],
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

      {/* Members Table Section */}
      <section className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm">
        <DataTable
          columns={MembersColumn}
          className="border-0 rounded-none h-fit"
          emptyMessage="No members found."
          data={members}
          isLoading={loading}
          onRowClick={(item) => setSelectedMemberId(item.id)}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </section>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setRealtimeTrigger((prev) => prev + 1)}
      />

      <MemberDetailsModal
        isOpen={!!selectedMemberId}
        onClose={() => setSelectedMemberId(null)}
        userId={selectedMemberId}
      />
    </div>
  );
}
