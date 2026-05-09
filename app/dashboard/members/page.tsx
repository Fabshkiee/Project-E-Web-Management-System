"use client";

import React, { useState, useEffect } from "react";
import PageTitle from "@/components/dashboard/page-title";
import { ExportPDF, PlusIcon } from "@/components/ui/Icons";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import AddMemberModal from "@/components/dashboard/add-member-modal";
import MemberDetailsModal from "@/components/dashboard/member-details-modal";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { DataTable } from "@/components/dashboard/data-table";
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
        <div className="flex flex-col min-w-0 max-w-[200px] sm:max-w-[250px]">
          <span className="font-medium text-foreground text-sm font-lexend whitespace-nowrap truncate">
            {toTitleCase(item.full_name || "Unknown Member")}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-secondary whitespace-nowrap truncate">
            ID: {item.member_id}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Status",
    className: "w-[15%]",
    accessor: (item: MemberListItem) => (
      <StatusTag type={item.payment_status as any} />
    ),
  },
  {
    header: "Dates",
    className: "w-[20%]",
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
        <div
          className={`text-[11px] font-medium font-lexend ${item.payment_status === "Expired" ? "text-red-500" : "text-secondary"}`}
        >
          <span className="opacity-60">
            {item.payment_status === "Expired" ? "Expired:" : "Expires:"}
          </span>{" "}
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
    className: "w-[20%]",
    accessor: (item: MemberListItem) => (
      <span className="text-sm font-medium text-foreground font-lexend">
        {item.membership_type}
      </span>
    ),
  },
  {
    header: "Coach",
    className: "w-[20%]",
    accessor: (item: MemberListItem) => (
      <span
        className={`text-sm font-medium font-lexend ${item.coach === "None" ? "text-gray-300" : "text-secondary"}`}
      >
        {item.coach === "None" ? "None" : `${toTitleCase(item.coach)}`}
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
        // Map UI filter to API logic
        let apiStatus = statusFilter;
        let apiSort = "newest";

        if (statusFilter === "newest" || statusFilter === "oldest") {
          apiStatus = "all";
          apiSort = statusFilter;
        }

        const { members, totalCount } = await getMembersList(
          currentPage,
          itemsPerPage,
          searchQuery,
          apiStatus,
          apiSort,
          dateFilter,
          coachFilter,
        );
        setMembers(members);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(timer);
  }, [
    currentPage,
    searchQuery,
    statusFilter,
    dateFilter,
    coachFilter,
    realtimeTrigger,
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

  return (
    <main className="space-y-8 h-fit">
      <header className="flex justify-between items-center">
        <PageTitle
          title="Members Management"
          subtitle="Manage gym members, subscription, and status."
        />
        <div className="flex gap-3">
          <SecondaryButton icon={<ExportPDF className="w-6 h-6" />}>
            Export List (PDF)
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
            onChange: handleDateChange,
            options: [
              { label: "All Time", value: "all" },
              { label: "This Month", value: "month" },
              { label: "Last Month", value: "last_month" },
              { label: "Last 3 Months", value: "3_months" },
              { label: "Last 6 Months", value: "6_months" },
              { label: "Last 1 Year", value: "1_year" },
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

      {/* Members Table Section */}
      <section className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm">
        <DataTable
          columns={MembersColumn}
          className="border-0 rounded-none h-fit"
          emptyMessage={loading ? "Loading members..." : "No members found."}
          data={members}
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
    </main>
  );
}
