import React from "react";
import { CalendarIcon } from "./Icons";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const DatePicker = ({
  label,
  value,
  onChange,
  className = "",
}: DatePickerProps) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-[11px] font-medium uppercase tracking-wider text-secondary px-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
          <CalendarIcon className="w-4 h-4" />
        </span>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/5 rounded-xl text-sm font-lexend focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 transition-all shadow-sm text-foreground [color-scheme:light] dark:[color-scheme:dark]"
        />
      </div>
    </div>
  );
};
