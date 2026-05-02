import PageTitle from "@/components/dashboard/page-title";

export default function Dashboard() {
  return (
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
  );
}
