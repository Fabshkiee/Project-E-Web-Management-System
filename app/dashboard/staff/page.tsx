"use client";

import React, { useState, useEffect } from "react";
import PageTitle from "@/components/dashboard/page-title";
import { ExportPDF, PlusIcon } from "@/components/ui/Icons";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import { SearchFilter } from "@/components/dashboard/search-filter";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { StatusTag } from "@/components/ui/StatusTag";
import { DataTable } from "@/components/dashboard/data-table";
import { Pagination } from "@/components/ui/Pagination";
import AddStaffModal from "@/components/dashboard/add-staff-modal";
import StaffDetailsModal from "@/components/dashboard/staff-details-modal";
import { createClient } from "@/lib/supabase/client";
import { getStaffList, StaffListItem } from "@/lib/api/dashboard";

const StaffColumns = [
  {
    header: "Staff Member",
    className: "w-[30%]",
    accessor: (item: StaffListItem) => (
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
    className: "w-[20%]",
    accessor: (item: StaffListItem) => <StatusTag type={item.role} />,
  },
  {
    header: "Contact",
    className: "w-[25%]",
    accessor: (item: StaffListItem) => (
      <span className="text-sm font-medium text-foreground font-lexend">
        {item.contact}
      </span>
    ),
  },
  {
    header: "Last Active",
    className: "w-[25%]",
    accessor: (item: StaffListItem) => (
      <span className="text-sm font-medium text-secondary font-lexend">
        {item.last_active}
      </span>
    ),
  },
];

export default function Staff() {
  const [staff, setStaff] = useState<StaffListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [realtimeTrigger, setRealtimeTrigger] = useState(0);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    async function fetchStaff() {
      setLoading(true);
      try {
        const { staff: fetchedStaff, totalCount: fetchedTotal } =
          await getStaffList(
            currentPage,
            itemsPerPage,
            searchQuery,
            roleFilter,
          );
        setStaff(fetchedStaff);
        setTotalCount(fetchedTotal);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchStaff, 400);
    return () => clearTimeout(timer);
  }, [currentPage, searchQuery, roleFilter, realtimeTrigger]);

  // Set up Supabase Realtime listener
  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("staff-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "staff" },
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

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkRole() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("users")
          .select("role")
          .eq("auth_user_id", user.id)
          .single();
        setIsAdmin(profile?.role === "Admin");
      }
    }
    checkRole();
  }, []);

  const handleExport = async () => {
    try {
      setExporting(true);
      
      // Dynamically load heavy PDF libraries only when needed
      const { default: jsPDF } = await import("jspdf");
      const { default: autoTable } = await import("jspdf-autotable");

      const doc = new jsPDF();

      // Report Header
      doc.setFontSize(20);
      doc.setTextColor(17, 24, 39);
      doc.text("Project-E: Staff Report", 14, 22);

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
        `Filters Applied - Role: ${roleFilter.toUpperCase()}`,
        14,
        38,
      );

      // Table Data
      const tableData = staff.map((s) => [
        s.name,
        s.staff_id,
        s.role,
        s.contact,
        s.last_active,
      ]);

      autoTable(doc, {
        startY: 45,
        head: [["Staff Name", "ID", "Role", "Contact", "Last Activity"]],
        body: tableData,
        theme: "grid",
        headStyles: {
          fillColor: [31, 41, 55],
          textColor: [255, 255, 255],
          fontSize: 10,
          fontStyle: "bold",
        },
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251],
        },
      });

      doc.save(`project_e_staff_report_${new Date().toISOString().split("T")[0]}.pdf`);
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
          {isAdmin && (
            <AddStaffModal
              onSuccess={() => setRealtimeTrigger((prev) => prev + 1)}
            />
          )}
        </div>
      </header>

      <SearchFilter
        placeholder="Search by name, role or ID..."
        onSearch={(query) => {
          setSearchQuery(query);
          setCurrentPage(1);
        }}
        filters={[
          {
            label: "Role",
            value: roleFilter,
            onChange: (val) => {
              setRoleFilter(val);
              setCurrentPage(1);
            },
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
          isLoading={loading}
          data={staff}
          onRowClick={(item) => setSelectedStaffId(item.id)}
        />

        <Pagination
          currentPage={currentPage}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </section>

      <StaffDetailsModal
        isOpen={!!selectedStaffId}
        onClose={() => setSelectedStaffId(null)}
        userId={selectedStaffId}
      />
    </div>
  );
}
