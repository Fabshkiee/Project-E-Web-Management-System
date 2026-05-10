import React from "react";

export type StatCardColor =
  | "blue"
  | "green"
  | "orange"
  | "purple"
  | "red"
  | "primary";

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: StatCardColor;
  trend?: {
    value: string;
    isPositive?: boolean;
    variant?: "badge" | "text";
    customColor?: string; // e.g. "text-blue-500" for custom text trend colors
  };
  className?: string;
}

const colorMap: Record<StatCardColor, string> = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border border-transparent dark:border-blue-500/30",
  green:
    "bg-green-50 text-green-600 dark:bg-green-500/20 dark:text-green-400 border border-transparent dark:border-green-500/30",
  orange:
    "bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 border border-transparent dark:border-orange-500/30",
  purple:
    "bg-purple-50 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border border-transparent dark:border-purple-500/30",
  red: "bg-red-50 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-transparent dark:border-red-500/30",
  primary:
    "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary border border-transparent dark:border-primary/30",
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = "blue",
  trend,
  className = "",
}) => {
  return (
    <div
      className={`bg-white dark:bg-[#0f0f0f] rounded-2xl border border-stroke dark:border-white/10 p-6 shadow-sm flex items-center justify-between ${className}`}
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-[11px] font-bold font-lexend text-secondary dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold font-lexend text-foreground dark:text-white leading-none">
            {value}
          </span>
          {trend &&
            (trend.variant === "badge" ? (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mb-0.5 border border-transparent ${
                  trend.isPositive
                    ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30"
                    : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30"
                }`}
              >
                {trend.value}
              </span>
            ) : (
              <span
                className={`text-xs font-bold mb-0.5 ${
                  trend.customColor
                    ? trend.customColor
                    : trend.isPositive
                      ? "text-green-500"
                      : "text-red-500"
                }`}
              >
                {trend.value}
              </span>
            ))}
        </div>
      </div>
      <div
        className={`w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0 ${colorMap[color]}`}
      >
        {/* Clone the icon and inject standard sizing if needed, or just let it inherit */}
        {React.isValidElement(icon)
          ? React.cloneElement(icon as React.ReactElement<any>, {
              className: `w-6 h-6`,
            })
          : icon}
      </div>
    </div>
  );
};
