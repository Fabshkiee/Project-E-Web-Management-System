"use client";

import PageTitle from "@/components/dashboard/page-title";
import { StatCard } from "@/components/ui/StatCard";
import { SecondaryButton } from "@/components/ui/ActionButton";
import {
  ExportPDF,
  MembersIcon,
  AddMemberIcon,
  RefreshIcon,
} from "@/components/ui/Icons";
import RevenueTrendCard from "@/components/dashboard/revenue-trend-card";
import MembershipSplitCard from "@/components/dashboard/membership-split-card";
import PeakHoursCard from "@/components/dashboard/peak-hours-card";
import { getAnalyticsSummary, AnalyticsSummary } from "@/lib/api/dashboard";
import { useEffect, useState } from "react";
import { exportAnalyticsReport } from "@/lib/utils/exportReport";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [reportPeriod, setReportPeriod] = useState<
    "last_7" | "last_30" | "last_90" | "custom"
  >("last_30");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAnalyticsSummary();
        setSummary(data);
      } catch (err) {
        console.error("Error fetching analytics summary:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDelta = (delta: number) => {
    if (delta > 0) return `+${delta} from last month`;
    if (delta < 0) return `${delta} from last month`;
    return "No change";
  };

  const handleExportReport = async () => {
    try {
      setExporting(true);
      await exportAnalyticsReport(reportPeriod, startDate, endDate);
    } catch (error) {
      console.error("Failed to generate report:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageTitle
          title="Analytics & Insights"
          subtitle="Comprehensive overview of gym performance and member trends."
        />
        <div className="flex items-center gap-3 md:mt-2">
          <div className="w-40">
            <Select
              value={reportPeriod}
              onChange={(v) =>
                setReportPeriod(v as "last_7" | "last_30" | "last_90" | "custom")
              }
              options={[
                { label: "Last 7 Days", value: "last_7" },
                { label: "Last 30 Days", value: "last_30" },
                { label: "Last 90 Days", value: "last_90" },
                { label: "Custom Range", value: "custom" },
              ]}
              placeholder="Period"
            />
          </div>
          {reportPeriod === "custom" && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Start Date"
                className="w-36"
              />
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="End Date"
                className="w-36"
              />
            </div>
          )}
          <SecondaryButton
            icon={
              exporting ? (
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              ) : (
                <ExportPDF className="w-5 h-5" />
              )
            }
            onClick={handleExportReport}
            disabled={exporting}
          >
            {exporting ? "Generating..." : "Download Report"}
          </SecondaryButton>
        </div>
      </header>

      {/* Row 1: Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Members"
          value={summary?.active_members.value.toString() || "0"}
          color="blue"
          icon={<MembersIcon />}
          isLoading={loading}
          trend={{
            value: formatDelta(summary?.active_members.delta || 0),
            isPositive: (summary?.active_members.delta || 0) >= 0,
            variant: "text",
          }}
        />
        <StatCard
          title="New Sign-ups (Monthly)"
          value={summary?.signups.current.toString() || "0"}
          color="green"
          icon={<AddMemberIcon />}
          isLoading={loading}
          trend={{
            value: formatDelta(summary?.signups.delta || 0),
            isPositive: (summary?.signups.delta || 0) >= 0,
            variant: "text",
          }}
        />
        <StatCard
          title="Returning Members"
          value={summary?.returning.current.toString() || "0"}
          color="orange"
          icon={<RefreshIcon />}
          isLoading={loading}
          trend={{
            value: formatDelta(summary?.returning.delta || 0),
            isPositive: (summary?.returning.delta || 0) >= 0,
            variant: "text",
          }}
        />
      </section>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Revenue Trend (Wider) */}
        <div className="lg:col-span-2">
          <RevenueTrendCard />
        </div>

        {/* Right Column: Split & Peak (Stacked) */}
        <div className="flex flex-col gap-6">
          <MembershipSplitCard />
          <PeakHoursCard />
        </div>
      </div>

      {/* Additional analytics content can go here in the future */}
    </div>
  );
}
