type StatusType = "Active" | "Expired" | "Expiring";

interface StatusTagProps {
  status: StatusType;
}

const statusStyles = {
  Active: {
    bg: "bg-[#22C55E]/15",
    border: "border-[#16A34A]/80",
    text: "text-[#4ADE80]",
    label: "Active",
  },
  Expired: {
    bg: "bg-[#F20D33]/15",
    border: "border-[#F20D33]/70",
    text: "text-[#F87171]",
    label: "Expired",
  },
  Expiring: {
    bg: "bg-[#FBBF24]/15",
    border: "border-[#D97706]/80",
    text: "text-[#FBBF24]",
    label: "Expiring",
  },
};

export function StatusTag({ status }: StatusTagProps) {
  const style = statusStyles[status];

  return (
    <div
      className={`px-4 py-1 rounded-full border ${style.bg} ${style.border} inline-flex items-center justify-center`}
    >
      <span
        className={`text-xs font-bold uppercase tracking-wider ${style.text}`}
      >
        {style.label}
      </span>
    </div>
  );
}
