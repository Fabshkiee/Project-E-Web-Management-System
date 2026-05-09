"use client";

import React, { useState } from "react";
import PageTitle from "@/components/dashboard/page-title";
import { ExportPDF, PlusIcon } from "@/components/ui/Icons";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import AddMemberModal from "@/components/dashboard/add-member-modal";
import { SearchFilter } from "@/components/dashboard/search-filter";

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

      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}
