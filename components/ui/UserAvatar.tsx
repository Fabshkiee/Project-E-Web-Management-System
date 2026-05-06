type AvatarColor =
  | "blue"
  | "rose"
  | "amber"
  | "emerald"
  | "indigo"
  | "violet"
  | "cyan";

interface UserAvatarProps {
  name: string;
  className?: string;
}

const colorMap: Record<AvatarColor, string> = {
  blue: "bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF] dark:bg-[#3B82F6]/10 dark:border-[#3B82F6]/50 dark:text-[#60A5FA]",
  rose: "bg-[#FFE4E6] border-[#FDA4AF] text-[#9F1239] dark:bg-[#F20D33]/10 dark:border-[#F20D33]/50 dark:text-[#F87171]",
  amber:
    "bg-[#FEF3C7] border-[#FCD34D] text-[#92400E] dark:bg-[#FBBF24]/10 dark:border-[#FBBF24]/50 dark:text-[#FBBF24]",
  emerald:
    "bg-[#DCFCE7] border-[#8BF7D0] text-[#166534] dark:bg-[#22C55E]/10 dark:border-[#22C55E]/50 dark:text-[#4ADE80]",
  indigo:
    "bg-[#E0E7FF] border-[#A5B4FC] text-[#3730A3] dark:bg-[#6366F1]/10 dark:border-[#6366F1]/50 dark:text-[#818CF8]",
  violet:
    "bg-[#F3E8FF] border-[#D8B4FE] text-[#6B21A8] dark:bg-[#A855F7]/10 dark:border-[#A855F7]/50 dark:text-[#C084FC]",
  cyan: "bg-[#CCFBFE] border-[#67E8F9] text-[#0E7490] dark:bg-[#06B6D4]/10 dark:border-[#06B6D4]/50 dark:text-[#22D3EE]",
};

const colors: AvatarColor[] = [
  "blue",
  "rose",
  "amber",
  "emerald",
  "indigo",
  "violet",
  "cyan",
];

function getDeterministicColor(name: string): AvatarColor {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({ name, className = "" }: UserAvatarProps) {
  const colorType = getDeterministicColor(name);
  const initials = getInitials(name);
  const styles = colorMap[colorType];

  return (
    <div
      className={`w-10 h-10 rounded-full border flex items-center justify-center font-bold text-xs transition-colors duration-200 ${styles} ${className}`}
    >
      <span className="leading-none">{initials}</span>
    </div>
  );
}
