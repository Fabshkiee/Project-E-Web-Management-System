"use client";

import React, { useEffect, useState } from "react";
import { getPeakHours, PeakHoursData } from "@/lib/api/dashboard";

export default function PeakHoursCard() {
  const [data, setData] = useState<PeakHoursData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getPeakHours();
        setData(result);
      } catch (err) {
        console.error("Error fetching peak hours:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const getStatusInfo = (value: number, max: number) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    if (percentage >= 90)
      return { label: "Very High", color: "#F20D33", percentage };
    if (percentage >= 70)
      return { label: "High", color: "#F20D33", percentage };
    if (percentage >= 40)
      return { label: "Medium", color: "#F6AD55", percentage };
    return { label: "Low", color: "#A0AEC0", percentage };
  };

  const morningVal = data?.breakdown.morning || 0;
  const afternoonVal = data?.breakdown.afternoon || 0;
  const eveningVal = data?.breakdown.evening || 0;
  const maxVal = Math.max(morningVal, afternoonVal, eveningVal, 1);

  const slots = [
    { label: "Morning (7am - 11am)", value: morningVal },
    { label: "Afternoon (12pm - 4pm)", value: afternoonVal },
    { label: "Evening (5pm - 9pm)", value: eveningVal },
  ];

  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-stroke dark:border-white/10 p-6 shadow-sm flex flex-col h-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-[18px] font-bold font-teko text-foreground dark:text-white uppercase tracking-wider">
            PEAK HOURS
          </h3>
          <p className="text-[13px] font-lexend font-medium text-secondary/60">
            Gym occupancy by time of day
          </p>
        </div>
      </div>

      <div className="space-y-6 flex-1 flex flex-col justify-center">
        {loading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-32 h-3 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                  <div className="w-12 h-3 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden" />
              </div>
            ))
          : slots.map((item) => {
              const status = getStatusInfo(item.value, maxVal);
              return (
                <div key={item.label} className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-lexend font-semibold text-secondary dark:text-gray-300">
                      {item.label}
                    </span>
                    <span
                      className="text-[11px] font-lexend font-bold uppercase tracking-tight"
                      style={{ color: status.color }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div className="relative h-2 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${status.percentage}%`,
                        backgroundColor: status.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
