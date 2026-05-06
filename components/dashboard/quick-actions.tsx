import {
  ChevronRightIcon,
  AddMemberIcon,
  ExportAnalyticsIcon,
} from "@/components/ui/Icons";

interface ActionItemProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  onClick?: () => void;
}

function ActionItem({
  title,
  subtitle,
  icon,
  iconBg,
  onClick,
}: ActionItemProps) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl h-[107px] w-full flex items-center justify-between p-3 order-white/5 hover:bg-gray-50 dark:hover:bg-white/2 transition-all group activrounded-xl border border-stroke dark:be:scale-[0.98]"
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
          icon={<AddMemberIcon />}
          onClick={() => console.log("Add Member clicked")}
        />

        <ActionItem
          title="Export Analytics"
          subtitle="Export Last Month's Analytics"
          iconBg="bg-emerald-50 dark:bg-emerald-500/10"
          icon={<ExportAnalyticsIcon />}
          onClick={() => console.log("Export Analytics clicked")}
        />
      </div>
    </div>
  );
}
