"use client";

import { useState } from "react";
import {
  ChevronRightIcon,
  AddMemberIcon,
  ExportAnalyticsIcon,
} from "@/components/ui/Icons";
import AddMemberModal from "@/components/dashboard/add-member-modal";
import { exportAnalyticsReport } from "@/lib/utils/exportReport";
import { useToast } from "@/lib/contexts/ToastContext";

interface ActionItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  onClick?: () => void;
  disabled?: boolean;
}

function ActionItem({
  title,
  subtitle,
  icon,
  iconBg,
  onClick,
  disabled,
}: ActionItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-xl h-[107px] w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-white/2 transition-all group active:scale-[0.98] border border-stroke dark:border-white/5 disabled:opacity-50 disabled:pointer-events-none"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg} shadow-sm group-hover:scale-110 transition-transform`}
        >
          {icon}
        </div>
        <div className="flex flex-col text-left">
          <span className="font-medium text-foreground text-sm font-lexend">
            {title}
          </span>
          <span className="text-secondary text-[11px] font-lexend">
            {subtitle}
          </span>
        </div>
      </div>
      <ChevronRightIcon className="w-5 h-5 text-secondary group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

export default function QuickActions() {
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const { showToast } = useToast();

  const handleExportReport = async () => {
    try {
      setExporting(true);
      await exportAnalyticsReport("last_30");
      showToast("Report generated successfully", "success");
    } catch (error) {
      console.error("Failed to generate report:", error);
      showToast("Failed to generate report", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl border border-stroke dark:border-white/5 p-6 shadow-sm">
      <h2 className="font-teko font-medium text-[20px] uppercase tracking-wider text-foreground mb-6">
        Quick Actions
      </h2>

      <div className="flex flex-col gap-4">
        <ActionItem
          title="Add Member"
          subtitle="Register a new Member"
          iconBg="bg-red-50 dark:bg-red-500/10"
          icon={<AddMemberIcon color="red" />}
          onClick={() => setIsAddMemberOpen(true)}
        />

        <ActionItem
          title={exporting ? "Generating..." : "Export Analytics"}
          subtitle={exporting ? "Please wait..." : "Export Last Month's Analytics"}
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          icon={
            exporting ? (
              <div className="w-5 h-5 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            ) : (
              <ExportAnalyticsIcon />
            )
          }
          onClick={handleExportReport}
          disabled={exporting}
        />
      </div>

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
      />
    </div>
  );
}
