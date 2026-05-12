"use client";

import React, { useState } from "react";
import PageTitle from "@/components/dashboard/page-title";
import { ExportPDF, PlusIcon } from "@/components/ui/Icons";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { DataTable } from "@/components/dashboard/data-table";
import { Pagination } from "@/components/ui/Pagination";

type StaffRole = "Coach" | "Receptionist" | "Maintenance";

interface StaffItem {
  id: string;
  name: string;
  staff_id: string;
  role: StaffRole;
  contact: string;
  last_active: string;
}

const mockStaffData: StaffItem[] = [
  { id: "1",  name: "Coach Eric",      staff_id: "#STF-001", role: "Coach",         contact: "0912-345-6789", last_active: "Today, 09:15 AM" },
  { id: "2",  name: "Kazuya Mishima",    staff_id: "#STF-004", role: "Receptionist",  contact: "0917-987-6543", last_active: "Yesterday, 06:00 PM" },
  { id: "3",  name: "Coach Ezekiel",      staff_id: "#STF-007", role: "Coach",         contact: "0917-007-0007", last_active: "2 days ago" },
  { id: "4",  name: "Jin Kazama",    staff_id: "#STF-012", role: "Coach",         contact: "0922-333-4444", last_active: "Today, 08:30 AM" },
  { id: "5",  name: "Heihachi Mishima",    staff_id: "#STF-009", role: "Maintenance",   contact: "0919-888-7777", last_active: "Yesterday, 5:00 PM" },
  { id: "6",  name: "Anna Williams",       staff_id: "#STF-015", role: "Receptionist",  contact: "0921-111-2222", last_active: "Today, 07:45 AM" },
  { id: "7",  name: "Armor King",    staff_id: "#STF-018", role: "Coach",         contact: "0915-222-3333", last_active: "Today, 10:00 AM" },
  { id: "8",  name: "Paul Phoenix",    staff_id: "#STF-021", role: "Maintenance",   contact: "0918-444-5555", last_active: "3 days ago" },
  { id: "9",  name: "Steve Fox",       staff_id: "#STF-023", role: "Coach",         contact: "0926-666-7777", last_active: "Yesterday, 08:00 AM" },
  { id: "10", name: "Marshall Law",    staff_id: "#STF-025", role: "Receptionist",  contact: "0920-888-9999", last_active: "Today, 11:30 AM" },
];

const StaffColumns = [
  {
    header: "Staff Member",
    className: "w-[34%]",
    accessor: (item: StaffItem) => (
      <div className="flex items-center gap-4">
        <div className="transition-transform duration-300 group-hover:scale-110">
          <UserAvatar name={item.name} />
        </div>
        <div className="flex flex-col min-w-0 max-w-[200px] sm:max-w-[250px]">
          <span className="font-medium text-foreground text-sm font-lexend whitespace-nowrap truncate">
            {item.name}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-secondary whitespace-nowrap truncate">
            ID: {item.staff_id}
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Role",
    className: "w-[22%]",
    accessor: (item: StaffItem) => (
      <StatusTag type={item.role} />
    ),
  },
  {
    header: "Contact",
    className: "w-[24%]",
    accessor: (item: StaffItem) => (
      <span className="text-sm font-medium text-foreground font-lexend">
        {item.contact}
      </span>
    ),
  },
  {
    header: "Last Active",
    className: "w-[20%]",
    accessor: (item: StaffItem) => (
      <span className="text-sm font-medium text-secondary font-lexend">
        {item.last_active}
      </span>
    ),
  },
];

export default function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const itemsPerPage = 5;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      // PDF export logic will be added later
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExporting(false);
    }
  };

  const filteredData = mockStaffData.filter((staff) => {
    const matchesSearch =
      searchQuery === "" ||
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.staff_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      staff.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <PageTitle
          title="Staff Management"
          subtitle="Manage and monitor gym employees."
        />
        <div className="flex gap-3">
          <SecondaryButton
            onClick={handleExport}
            disabled={exporting}
            icon={<ExportPDF className="w-6 h-6" />}
          >
            {exporting ? "Exporting..." : "Export Staff List (PDF)"}
          </SecondaryButton>
          <PrimaryButton icon={<PlusIcon className="w-6 h-6" />}>
            Add New Staff
          </PrimaryButton>
        </div>
      </header>

      <SearchFilter
        placeholder="Search by name, role or ID..."
        onSearch={handleSearch}
        filters={[
          {
            label: "Role",
            value: roleFilter,
            onChange: handleRoleChange,
            options: [
              { label: "All", value: "all" },
              { label: "Coach", value: "Coach" },
              { label: "Receptionist", value: "Receptionist" },
              { label: "Maintenance", value: "Maintenance" },
            ],
          },
        ]}
      />

      {/* Staff Table Section */}
      <section className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 overflow-hidden shadow-sm">
        <DataTable
          columns={StaffColumns}
          className="border-0 rounded-none h-fit"
          emptyMessage="No staff members found."
          data={paginatedData}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </section>
    </div>
  );
}