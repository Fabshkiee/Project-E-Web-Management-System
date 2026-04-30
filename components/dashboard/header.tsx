"use client";

import { useState, useEffect } from "react";
import {
  LightModeIcon,
  DarkModeIcon,
  NotificationIcon,
  AdminIcon,
} from "@/components/ui/Icons";

export default function Header() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // Format: 10:25:08 AM
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );

      // Format: TUESDAY, FEBRUARY 24, 2026
      setDate(
        now
          .toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          .toUpperCase(),
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-[80px] w-full bg-surface border-b border-stroke flex items-center justify-between px-10 shrink-0 transition-colors duration-300">
      {/* Left Section: Time & Date */}
      <div className="flex flex-col">
        <span className="font-lexend font-bold text-[24px] leading-tight text-foreground">
          {time || "00:00:00 AM"}
        </span>
        <span className="font-lexend font-bold text-[11px] tracking-[0.15em] text-primary uppercase">
          {date || "LOADING..."}
        </span>
      </div>

      {/* Right Section: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Theme Toggle Button */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-muted/10 hover:bg-muted/20 transition-all group"
          onClick={() => document.documentElement.classList.toggle("dark")}
        >
          <div className="hidden dark:block">
            <LightModeIcon className="w-5 h-5 text-foreground" />
          </div>
          <div className="block dark:hidden">
            <DarkModeIcon className="w-5 h-5 text-secondary group-hover:text-foreground" />
          </div>
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-muted/10 transition-all group">
          <NotificationIcon className="w-5 h-5 text-secondary group-hover:text-foreground" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-[8px] h-[8px] bg-primary rounded-full border-2 border-surface"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 ml-2 cursor-pointer group">
          <div className="flex flex-col items-end">
            <span className="font-lexend font-bold text-[14px] leading-none text-foreground">
              Admin User
            </span>
            <span className="font-lexend font-medium text-[12px] text-secondary mt-1">
              Gym Manager
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-muted/10 border border-stroke/50 flex items-center justify-center transition-all duration-300 group-hover:bg-muted/20 group-hover:border-primary/30">
            <AdminIcon className="w-5 h-5 text-secondary group-hover:text-foreground transition-colors" />
          </div>
        </div>
      </div>
    </header>
  );
}
