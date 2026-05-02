import PageTitle from "@/components/dashboard/page-title";
import StatsCard from "@/components/dashboard/overview-card";
import { PeopleIcon } from "@/components/ui/Icons";

export default function Dashboard() {
  return (
    <div>
      <PageTitle
        title="Gym Overview"
        subtitle={`Real-time statistics for ${new Date().toLocaleDateString(
          "en-US",
          {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        )}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <StatsCard
          label="Total Members"
          value="212"
          icon={<PeopleIcon className="w-12 h-12" />}
          trend={{ label: "12%", type: "up" }}
        />
      </div>
    </div>
  );
}
