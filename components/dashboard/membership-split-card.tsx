"use client";

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getMembershipSplit, MembershipSplitData } from "@/lib/api/dashboard";

const COLORS = {
  Basic: "#F20D33",
  Standard: "#F20D33",
  Coaching: "#2D3748",
  Supervision: "#A0AEC0",
};

const DEFAULT_COLORS = ["#718096", "#4A5568", "#2D3748", "#1A202C"];

export default function MembershipSplitCard() {
  const [data, setData] = useState<MembershipSplitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await getMembershipSplit();
        setData(result);
      } catch (err) {
        console.error("Error fetching membership split:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const getEntryColor = (name: string, index: number) => {
    return (COLORS as any)[name] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  };

  const onPieEnter = (_: any, index: number) => {
    const item = data[index];
    setActiveItem({ ...item, color: getEntryColor(item.name, index) });
  };

  const onPieLeave = () => {
    setActiveItem(null);
  };

  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-stroke dark:border-white/10 p-6 shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-[18px] font-bold font-teko text-foreground dark:text-white uppercase tracking-wider">
          MEMBERSHIP PLAN SPLIT
        </h3>
        <p className="text-[13px] font-lexend font-medium text-secondary/60">
          Distribution by membership type
        </p>
      </div>

      <div className="flex-1 relative flex items-center justify-center min-h-[180px] w-full min-w-0 overflow-hidden">
        {loading ? (
          <div className="w-40 h-40 rounded-full border-[12px] border-gray-100 dark:border-white/5 animate-pulse flex items-center justify-center">
            <div className="w-16 h-4 bg-gray-100 dark:bg-white/5 rounded-md" />
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="85%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={onPieEnter}
                  onMouseLeave={onPieLeave}
                  style={{ cursor: "pointer", outline: "none" }}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getEntryColor(entry.name, index)}
                      style={{
                        filter:
                          activeItem?.name === entry.name
                            ? "brightness(1.1)"
                            : "none",
                        transition: "all 0.3s ease",
                      }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Dynamic Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-1 transition-all duration-300">
              <span
                className={`font-teko font-bold leading-none transition-all duration-300 ${
                  activeItem
                    ? "text-[36px]"
                    : "text-[32px] text-foreground dark:text-white"
                }`}
                style={{ color: activeItem ? activeItem.color : undefined }}
              >
                {activeItem ? activeItem.value : total}
              </span>
              <span className="text-[11px] font-lexend font-medium text-secondary/60 uppercase tracking-wider transition-all duration-300">
                {activeItem ? activeItem.name : "Members"}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 space-y-3">
        {loading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-sm bg-gray-100 dark:bg-white/5 animate-pulse" />
                  <div className="w-20 h-3 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
                </div>
                <div className="w-8 h-3 bg-gray-100 dark:bg-white/5 rounded-md animate-pulse" />
              </div>
            ))
          : data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: getEntryColor(item.name, index) }}
                  />
                  <span className="text-[13px] font-lexend font-semibold text-secondary dark:text-gray-300">
                    {item.name}
                  </span>
                </div>
                <span className="text-[13px] font-lexend font-bold text-foreground dark:text-white">
                  {item.percentage}%
                </span>
              </div>
            ))}
      </div>
    </div>
  );
}
