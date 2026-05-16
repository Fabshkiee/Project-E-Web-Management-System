"use client";

import React, { useState, useEffect, useMemo } from "react";
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
import { getRevenueTrendData, RevenueTrendData } from "@/lib/api/dashboard";

const dateOptions = [
  { label: "Last 7 Days", value: "last_7" },
  { label: "Last 30 Days", value: "last_30" },
  { label: "Last 90 Days", value: "last_90" },
  { label: "Custom Range", value: "custom" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-[#1a1a1a] border border-stroke dark:border-white/10 p-4 rounded-xl shadow-xl backdrop-blur-md">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="font-lexend font-bold text-[10px] text-primary uppercase tracking-widest opacity-70">
              Current Period
            </p>
            <p className="font-lexend font-bold text-sm text-foreground dark:text-white">
              {data.fullDate}
            </p>
            <p className="text-primary font-bold text-lg">
              ₱{payload[0].value.toLocaleString()}
            </p>
          </div>

          {payload[1] && (
            <div className="space-y-1 pt-2 border-t border-stroke dark:border-white/10">
              <p className="font-lexend font-bold text-[10px] text-secondary uppercase tracking-widest opacity-70">
                Comparison Period
              </p>
              <p className="font-lexend font-medium text-xs text-secondary dark:text-gray-400">
                {data.prevFullDate}
              </p>
              <p className="text-secondary dark:text-gray-400 font-bold text-sm">
                ₱{payload[1].value.toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function RevenueTrendCard() {
  const [dateFilter, setDateFilter] = useState("last_30");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<RevenueTrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Don't fetch custom if dates aren't set
      if (dateFilter === "custom" && (!startDate || !endDate)) return;

      try {
        setLoading(true);
        const result = await getRevenueTrendData(
          dateFilter,
          startDate,
          endDate,
        );
        setData(result);
      } catch (err) {
        console.error("Error fetching revenue trend:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dateFilter, startDate, endDate]);

  const chartData = useMemo(() => {
    if (!data) return [];

    const startDateObj = new Date(data.period.curr_start);
    const prevStartDateObj = new Date(data.period.prev_start);
    const maxIndex = Math.max(
      ...data.current_series.map((s) => s.day_index),
      ...data.previous_series.map((s) => s.day_index),
      0,
    );

    const series = [];
    for (let i = 0; i <= maxIndex; i++) {
      const curr = data.current_series.find((s) => s.day_index === i);
      const prev = data.previous_series.find((s) => s.day_index === i);

      // Calculate the actual date for this index
      const dateObj = new Date(startDateObj);
      dateObj.setDate(startDateObj.getDate() + i);

      const prevDateObj = new Date(prevStartDateObj);
      prevDateObj.setDate(prevStartDateObj.getDate() + i);

      const dateLabel = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      series.push({
        day_index: i,
        current: curr?.revenue || 0,
        previous: prev?.revenue || 0,
        date: dateLabel,
        fullDate: dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        prevFullDate: prevDateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      });
    }
    return series;
  }, [data]);

  const maxRevenue = useMemo(() => {
    if (chartData.length === 0) return 10000;
    const vals = chartData.flatMap((d) => [d.current, d.previous]);
    return Math.max(...vals, 10000) * 1.2;
  }, [chartData]);

  const comparisonLabel = useMemo(() => {
    switch (dateFilter) {
      case "last_7":
        return "vs. Previous Week";
      case "last_30":
        return "vs. Previous Month";
      case "last_90":
        return "vs. Previous Quarter";
      case "custom":
        return "vs. Previous Period";
      default:
        return "Comparison View";
    }
  }, [dateFilter]);

  return (
    <div className="bg-white dark:bg-surface rounded-2xl border border-stroke dark:border-white/10 p-6 shadow-sm flex flex-col h-full min-h-[520px]">
      <header className="flex flex-col lg:flex-row md:items-start justify-between gap-6 mb-6">
        <div className="space-y-4 flex-1">
          <div className="space-y-1">
            <h3 className="text-[18px] font-bold font-teko text-foreground dark:text-white uppercase tracking-wider">
              ESTIMATED REVENUE TREND
            </h3>
            <p className="text-[13px] font-lexend font-medium text-secondary/60">
              {comparisonLabel}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-14 w-40 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
            ) : (
              <>
                <span className="text-[54px] font-teko font-bold text-foreground dark:text-white leading-none tracking-tight">
                  ₱{data?.summary.current_total.toLocaleString() || "0"}
                </span>
                <div
                  className={`px-2 py-1 rounded-lg text-[12px] font-bold border flex items-center gap-1 ${
                    data?.summary.trend_type === "up"
                      ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 border-green-200 dark:border-green-500/20"
                      : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-200 dark:border-red-500/20"
                  }`}
                >
                  {data?.summary.trend_pct}%{" "}
                  <span className="text-[14px]">
                    {data?.summary.trend_type === "up" ? "↗" : "↘"}
                  </span>
                </div>
              </>
            )}
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

      <div className="flex-1 w-full min-h-[300px] min-w-0 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 z-10 bg-white/50 dark:bg-surface/50 backdrop-blur-[1px] flex items-center justify-center">
            <div className="w-full h-full p-4 flex flex-col gap-4">
              <div className="flex-1 w-full bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse" />
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: -20, bottom: 20 }}
          >
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
              dy={10}
              fontFamily="Lexend"
              interval={Math.floor(chartData.length / 7)}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
              tickFormatter={(value) => `₱${(value / 1000).toFixed(0)}k`}
              fontFamily="Lexend"
              domain={[0, maxRevenue]}
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
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#6B7280"
              strokeWidth={2}
              strokeDasharray="6 6"
              fill="transparent"
              opacity={0.3}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
