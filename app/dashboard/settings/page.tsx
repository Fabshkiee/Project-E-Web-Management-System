"use client";

import header from "@/components/dashboard/header";
import PageTitle from "@/components/dashboard/page-title";
import { PrimaryButton } from "@/components/ui/ActionButton";
import {
  ChevronDownIcon,
  CleanIcon,
  MoneyPurple,
  MonitorIcon,
  PencilIcon,
  PlusIcon,
  SaveIcon,
} from "@/components/ui/Icons"; // Use a disk/save icon
import { Toggle } from "@/components/dashboard/toggle-button";
import { DataTable } from "@/components/dashboard/data-table";
import { useState } from "react";

const columns = [
  { header: "MEMBERSHIP TYPE", accessor: "type" as const },
  { header: "MONTHLY FEE (₱)", accessor: "monthly" as const },
  { header: "STUDENT FEE (₱)", accessor: "student" as const },
  {
    header: "ACTIONS",
    className: "text-right",
    accessor: (item: (typeof pricingData)[0]) => (
      <div className="flex justify-end">
        <button className="text-blue-500 transition-colors">
          <PencilIcon className="w-4 h-4" />
        </button>
      </div>
    ),
  },
];

const pricingData = [
  { type: "Monthly", monthly: "900", student: "700", actions: "" },
  { type: "Supervision", monthly: "1500", student: "1200", actions: "" },
  { type: "Coaching", monthly: "3000", student: "2500", actions: "" },
];

export default function Settings() {
  const [autoExpiry, setAutoExpiry] = useState(false);
  const [inactiveDeletion, setInactiveDeletion] = useState(false);
  return (
    <div className="space-y-8">
      {/* Title page and Save button */}
      <header className="flex justify-between items-center">
        <PageTitle
          title="Membership & Access Settings"
          subtitle="Configure gym rules, membership types, and system preferences."
        />
        <PrimaryButton icon={<SaveIcon />}>Save Changes</PrimaryButton>
      </header>

      {/* Configuration cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD 1 */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-2xl p-8 gap-8 flex flex-col">
          {/* CONFIG TITLE CARD */}
          <div className="flex items-center gap-3 pb-6 border-b border-[#F3F4F6] dark:border-white/5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <MonitorIcon />
            </div>
            <h3 className="font-bold text-lg">Membership & Access</h3>
          </div>
          <div className="gap-1 flex flex-col">
            <div>
              <div className="p-sm-sb text-muted">Grace Period (Days)</div>
            </div>

            <div className="flex items-center justify-between ">
              <input
                type="number"
                min="0"
                placeholder="e.g. 7"
                className="w-full px-2.5 py-2.5 bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-md text-sm font-lexend focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm placeholder:text-gray-400 text-foreground"
              />

              <div className="ps-sm-rg text-muted ml-3 whitespace-nowrap">
                days allowed after expiry
              </div>
            </div>
          </div>

          <div className="mb-29">
            <Toggle
              label="Auto Expiry Blocking"
              description="Prevent expired Members from scanning in"
              checked={autoExpiry}
              onChange={setAutoExpiry}
            />
          </div>
        </div>

        {/* CARD 2 */}
        <div className="bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-2xl p-8 gap-8 flex flex-col">
          {/* CONFIG TITLE CARD */}
          <div className="flex items-center gap-3 pb-6 border-b border-[#F3F4F6] dark:border-white/5">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-orange-50 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <CleanIcon />
            </div>
            <h3 className="font-bold text-lg">Automated Cleanup</h3>
          </div>

          <div className=" flex flex-col gap-6">
            <div>
              <Toggle
                label="Inactive Member Deletion"
                description="Automatically remove old inactive accounts"
                checked={inactiveDeletion}
                onChange={setInactiveDeletion}
              />
            </div>

            <div className="gap-1 flex flex-col">
              <div className="p-sm-sb text-muted">Cleanup Threshold</div>

              <div className="relative">
                <select className="w-full px-2.5 py-2.5 pr-8 appearance-none bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-md text-sm font-lexend focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm text-foreground">
                  <option value="option1">
                    Delete Members unpaid for two months
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-2xl p-8 gap-8 flex flex-col">
        <div className="flex items-center gap-3 pb-6 border-b border-[#F3F4F6] dark:border-white/5">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
            <MoneyPurple />
          </div>
          <h3 className="font-bold text-lg">Membership Types & Pricing</h3>
        </div>

        <div className="[&_th]:w-1/4 [&_td]:w-1/4">
          <DataTable columns={columns} data={pricingData} />
        </div>

        <PrimaryButton
          className="w-full justify-center py-4"
          icon={<PlusIcon />}
        >
          Add New Type
        </PrimaryButton>
      </div>
    </div>
  );
}
