type TagType =
  | "Active"
  | "Expired"
  | "Expiring"
  | "Online"
  | "Syncing"
  | "Offline"
  | "Staff"
  | "Member"
  | "Admin"
  | "Coach"
  | "Receptionist"
  | "Gym Manager"
  | "Maintenance";

interface StatusTagProps {
  type: TagType;
  className?: string;
}

const tagStyles: Record<TagType, string> = {
  // Statuses
  Active:
    "bg-[#DCFCE7] border-[#8BF7D0] text-[#166534] dark:bg-[#22C55E]/10 dark:border-[#22C55E]/50 dark:text-[#4ADE80]",
  Expired:
    "bg-[#FFE4E6] border-[#FDA4AF] text-[#9F1239] dark:bg-[#F20D33]/10 dark:border-[#F20D33]/50 dark:text-[#F87171]",
  Expiring:
    "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E] dark:bg-[#FBBF24]/10 dark:border-[#FBBF24]/50 dark:text-[#FBBF24]",
  Online:
    "bg-[#DCFCE7] border-[#8BF7D0] text-[#166534] dark:bg-[#22C55E]/10 dark:border-[#22C55E]/50 dark:text-[#4ADE80]",
  Syncing:
    "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E] dark:bg-[#FBBF24]/10 dark:border-[#FBBF24]/50 dark:text-[#FBBF24]",
  Offline:
    "bg-[#FFE4E6] border-[#FDA4AF] text-[#9F1239] dark:bg-[#F20D33]/10 dark:border-[#F20D33]/50 dark:text-[#F87171]",

  // Primary Roles
  Admin:
    "bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A] dark:bg-white/5 dark:border-white/20 dark:text-white",
  Staff:
    "bg-[#F3F4F6] border-[#D1D5DB] text-[#374151] dark:bg-[#9CA3AF]/10 dark:border-[#9CA3AF]/50 dark:text-[#D1D5DB]",
  Member:
    "bg-[#F3F4F6] border-[#D1D5DB] text-[#374151] dark:bg-[#9CA3AF]/10 dark:border-[#9CA3AF]/50 dark:text-[#D1D5DB]",

  // Subroles
  Coach:
    "bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF] dark:bg-[#3B82F6]/10 dark:border-[#3B82F6]/50 dark:text-[#60A5FA]",
  Receptionist:
    "bg-[#FEF9C3] border-[#FDE047] text-[#854D0E] dark:bg-[#EAB308]/10 dark:border-[#EAB308]/50 dark:text-[#FACC15]",
  "Gym Manager":
    "bg-[#CCFBFE] border-[#67E8F9] text-[#0E7490] dark:bg-[#06B6D4]/10 dark:border-[#06B6D4]/50 dark:text-[#22D3EE]",
  Maintenance:
    "bg-[#F3E8FF] border-[#D8B4FE] text-[#6B21A8] dark:bg-[#A855F7]/10 dark:border-[#A855F7]/50 dark:text-[#C084FC]",
};

export function StatusTag({ type, className = "" }: StatusTagProps) {
  return (
    <div
      className={`px-3 py-1 rounded-full border-2 ${tagStyles[type]} inline-flex items-center justify-center transition-colors duration-200 ${className}`}
    >
      <span className="text-xs font-semibold tracking-wide leading-none whitespace-nowrap">
        {type}
      </span>
    </div>
  );
}
