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

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <PageTitle
          title="Analytics & Insights"
          subtitle="Comprehensive overview of gym performance and member trends."
        />
        <SecondaryButton
          icon={<ExportPDF className="w-5 h-5" />}
          className="md:mt-2"
        >
          Download Report (PDF)
        </SecondaryButton>
      </header>

      {/* Row 1: Stat Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Members"
          value="200"
          color="blue"
          icon={<MembersIcon />}
          trend={{
            value: "5%",
            isPositive: true,
            variant: "badge",
          }}
        />
        <StatCard
          title="New Sign-ups (Monthly)"
          value="28"
          color="green"
          icon={<AddMemberIcon />}
          trend={{
            value: "+12 from last month",
            isPositive: true,
            variant: "text",
          }}
        />
        <StatCard
          title="Returning Members"
          value="92"
          color="orange"
          icon={<RefreshIcon />}
          trend={{
            value: "+12 from last month",
            isPositive: true,
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
