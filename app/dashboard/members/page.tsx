"use client";

import React, { useState } from "react";
import PageTitle from "@/components/dashboard/page-title";
import { ExportPDF, PlusIcon } from "@/components/ui/Icons";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import AddMemberModal from "@/components/dashboard/add-member-modal";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { DataTable } from "@/components/dashboard/data-table";

const MembersColumn = [
  {
    header: "Member",
    accessor: (item: any) => (
      <div className="flex items-center gap-4">
        <div className="transition-transform duration-300 group-hover:scale-110">
          <UserAvatar name={item.name || "Unknown"} />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-foreground text-sm font-lexend">
            {item.name || "Unknown Member"}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-secondary">
            ID: {item.id}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: (item: any) => <StatusTag type={item.status as any} />,
  },
  {
    header: "Dates",
    accessor: (item: any) => (
      <div className="flex flex-col gap-0.5">
        <div className="text-[11px] text-secondary font-medium font-lexend">
          <span className="opacity-60">Started:</span> {item.start_date}
        </div>
        <div className={`text-[11px] font-medium font-lexend ${item.status === 'Expired' ? 'text-red-500' : 'text-secondary'}`}>
          <span className="opacity-60">{item.status === 'Expired' ? 'Expired:' : 'Expires:'}</span> {item.end_date}
        </div>
      </div>
    ),
  },
  {
    header: "Membership",
    accessor: (item: any) => (
      <span className="text-sm font-medium text-foreground font-lexend">
        {item.membershiptype}
      </span>
    ),
  },
  {
    header: "Coach",
    accessor: (item: any) => (
      <span className={`text-sm font-medium font-lexend ${item.coach === 'None' ? 'text-gray-300' : 'text-secondary'}`}>
        {item.coach === 'None' ? 'None' : `Coach ${item.coach}`}
      </span>
    ),
  },
];

export default function Members() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [coachFilter, setCoachFilter] = useState("all");

  return (
    <main className="space-y-8">
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
        onSearch={setSearchQuery}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: [
              { label: "Active", value: "active" },
              { label: "Expired", value: "expired" },
              { label: "Expiring", value: "expiring" },
            ],
          },
          {
            label: "Coach",
            value: coachFilter,
            onChange: setCoachFilter,
            options: [
              { label: "Coach Eric", value: "eric" },
              { label: "Coach Sarah", value: "sarah" },
            ],
          },
        ]}
      />

      {/* Members Table */}
      <section
        aria-labelledby="members-title"
        className="lg:col-span-8 bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm flex flex-col"
      >
        <div className="flex-1 flex flex-col">
          <DataTable
            columns={MembersColumn}
            className="flex-1"
            emptyMessage="No members found."
            data={[]}
          />
        </div>
      </section>

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
