"use client";

import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { CalendarIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";

const data = [
  { date: "Oct 1", current: 15000, previous: 25000 },
  { date: "Oct 5", current: 35000, previous: 28000 },
  { date: "Oct 10", current: 42000, previous: 22000 },
  { date: "Oct 15", current: 38000, previous: 38000 },
  { date: "Oct 20", current: 58000, previous: 32000 },
  { date: "Oct 25", current: 52000, previous: 42000 },
  { date: "Oct 30", current: 68000, previous: 38000 },
  { date: "Nov 1", current: 62000, previous: 48000 },
  { date: "Nov 5", current: 78000, previous: 42000 },
  { date: "Nov 10", current: 72000, previous: 52000 },
  { date: "Nov 15", current: 84000, previous: 58000 },
];

const dateOptions = [
  { label: "Last 7 Days", value: "last_7_days" },
  { label: "Last 30 Days", value: "last_30_days" },
  { label: "Last 90 Days", value: "last_90_days" },
  { label: "Custom Range", value: "custom" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md">
        <p className="font-lexend font-bold text-xs text-secondary mb-2 uppercase tracking-wider">
          {label}
        </p>
        <div className="space-y-1">
          <p className="text-primary font-bold text-sm">
            Current: ₱{payload[0].value.toLocaleString()}
          </p>
          <p className="text-secondary dark:text-gray-400 font-medium text-xs">
            Previous: ₱{payload[1].value.toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueTrendCard() {
  const [dateFilter, setDateFilter] = useState("last_30_days");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-stroke dark:border-white/10 p-6 shadow-sm flex flex-col h-full min-h-[520px]">
      <header className="flex flex-col lg:flex-row md:items-start justify-between gap-6 mb-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-[18px] font-bold font-teko text-foreground dark:text-white uppercase tracking-wider">
              ESTIMATED REVENUE TREND
            </h3>
            <p className="text-[13px] font-lexend font-medium text-secondary/60">
              Monthly revenue comparison
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-[54px] font-teko font-bold text-foreground dark:text-white leading-none tracking-tight">
              ₱84,000
            </span>
            <div className="bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-2 py-1 rounded-lg text-[12px] font-bold border border-green-200 dark:border-green-500/20 flex items-center gap-1">
              +8.2% <span className="text-[14px]">↗</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-5 w-full lg:w-auto lg:min-w-[240px]">
          <div className="flex items-center gap-6 text-[13px] font-lexend font-bold">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-foreground dark:text-gray-300">
                Current
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-400 dark:bg-gray-600" />
              <span className="text-secondary">Previous</span>
            </div>
          </div>

          <Select
            options={dateOptions}
            value={dateFilter}
            onChange={setDateFilter}
            icon={<CalendarIcon className="w-4 h-4 text-secondary/60" />}
            className="w-full"
          />

          {dateFilter === "custom" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full animate-in fade-in slide-in-from-top-2 duration-300">
              <DatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="Start Date"
                className="flex-1"
              />
              <DatePicker
                value={endDate}
                onChange={setEndDate}
                placeholder="End Date"
                className="flex-1"
              />
            </div>
          )}
        </div>
      </header>

      <div className="flex-1 w-full min-h-[300px] min-w-0 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F20D33" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#F20D33" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="currentColor"
              className="opacity-[0.1] dark:opacity-[0.05]"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
              dy={15}
              fontFamily="Lexend"
              interval={1}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
              tickFormatter={(value) => `₱${value / 1000}k`}
              fontFamily="Lexend"
              domain={[0, 100000]}
              ticks={[0, 25000, 50000, 75000, 100000]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#F20D33"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCurrent)"
              activeDot={{ r: 6, strokeWidth: 0, fill: "#F20D33" }}
              animationDuration={1500}
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#6B7280"
              strokeWidth={2}
              strokeDasharray="6 6"
              fill="transparent"
              opacity={0.5}
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
