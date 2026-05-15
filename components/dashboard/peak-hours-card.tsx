"use client";

import React from "react";

const peakData = [
  {
    label: "Morning (6am - 9am)",
    status: "High",
    value: 85,
    color: "#F20D33",
  },
  {
    label: "Afternoon (12pm - 2pm)",
    status: "Medium",
    value: 45,
    color: "#F6AD55", // Yellow/Orange
  },
  {
    label: "Evening (5pm - 8pm)",
    status: "Very High",
    value: 95,
    color: "#F20D33",
  },
];

export default function PeakHoursCard() {
  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-stroke dark:border-white/10 p-6 shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-[18px] font-bold font-teko text-foreground dark:text-white uppercase tracking-wider">
          PEAK HOURS
        </h3>
        <p className="text-[13px] font-lexend font-medium text-secondary/60">
          Gym occupancy by time of day
        </p>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {peakData.map((item) => (
          <div key={item.label} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-lexend font-semibold text-secondary dark:text-gray-300">
                {item.label}
              </span>
              <span className="text-[13px] font-lexend font-medium text-foreground dark:text-white uppercase tracking-tight">
                {item.status}
              </span>
            </div>

            <div className="relative h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
