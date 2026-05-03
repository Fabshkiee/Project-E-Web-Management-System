"use client";

import React from "react";

interface StatsCardProps {
  label: string;
  value?: string | number;
  isLoading?: boolean;
  error?: boolean;
  icon: React.ReactNode;
  trend?: {
    label: string;
    type: "up" | "down" | "neutral";
    icon?: React.ReactNode;
  };
}

export default function StatsCard({
  label,
  value,
  isLoading,
  error,
  icon,
  trend,
}: StatsCardProps) {
  return (
    <div className="bg-[#1a1a1a] border border-white/5 rounded-2xl p-6 flex justify-between items-start group hover:border-white/10 transition-all duration-300">
      <div className="flex flex-col">
        {/* Label */}
        <span className="font-lexend font-bold text-[13px] tracking-[0.15em] text-[#9ca3af] uppercase mb-3">
          {label}
        </span>
        {/* Value and Trend */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-10 w-20 bg-white/10 rounded animate-pulse" />
          ) : error ? (
            <span className="font-lexend font-bold text-[14px] text-primary">Error</span>
          ) : (
            <span className="font-teko font-bold text-[48px] leading-none text-white tracking-tight">
              {value}
            </span>
          )}
          {trend && !isLoading && !error && trend.label !== "0%" && trend.label !== "0.0%" && (
            <div
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 border ${
                trend.type === "up"
                  ? "bg-success/20 border-success/30 text-[#4ade80]"
                  : trend.type === "down"
                    ? "bg-[#ef4444]/20 border-[#ef4444]/30 text-[#f87171]"
                    : "bg-white/5 border-white/10 text-secondary"
              }`}
            >
              {trend.icon && <span className="shrink-0">{trend.icon}</span>}
              <span className="font-lexend font-bold text-[12px] leading-none">
                {!trend.icon &&
                  (trend.type === "up"
                    ? "↑ "
                    : trend.type === "down"
                      ? "↓ "
                      : "")}
                {trend.label}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Icon */}
      <div className="opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        {icon}
      </div>
    </div>
  );
}
