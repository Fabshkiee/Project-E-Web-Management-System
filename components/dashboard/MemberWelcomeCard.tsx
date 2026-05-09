"use client";

import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  FingerprintIcon,
  LockIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  BadgeIcon,
  CalendarIcon,
  CoachIcon,
} from "@/components/ui/Icons";

interface MemberWelcomeCardProps {
  member: {
    full_name: string;
    nickname?: string;
    short_id: string;
    qr_token: string;
    valid_until: string;
    membership_name: string;
    coach_name: string;
  };
  onDone: () => void;
}

export default function MemberWelcomeCard({
  member,
  onDone,
}: MemberWelcomeCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5 py-2 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold font-lexend text-foreground mb-0.5">
          Member Registered!
        </h3>
        <p className="text-[13px] text-gray-500 dark:text-[#9CA3AF] font-lexend">
          Welcome to the family,{" "}
          {member.nickname || member.full_name.split(" ")[0]}
        </p>
      </div>

      {/* QR Card - Matching Portal Style */}
      <div className="flex flex-col items-center gap-3">
        <div className="bg-gray-100 dark:bg-[#111111] rounded-3xl p-5 relative border border-stroke dark:border-white/5 shadow-2xl">
          <div className="rounded-tl-lg absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
          <div className="rounded-tr-lg absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
          <div className="rounded-bl-lg absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
          <div className="rounded-br-lg absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
          <QRCodeSVG
            value={`PROJE:MEM:${member.short_id}:${member.qr_token}`}
            size={140}
            level="M"
            marginSize={1}
            className="rounded-xl"
          />
        </div>
        <p className="text-[9px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] text-center">
          Scan this for attendance
        </p>
      </div>

      {/* Details Card */}
      <div className="w-full bg-gray-50 dark:bg-[#111111] border border-stroke dark:border-white/5 rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2.5 pb-2 border-b border-stroke dark:border-white/5">
          <BadgeIcon className="text-primary w-4 h-4" />
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground">
            Account Credentials
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* ID */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <FingerprintIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-lexend text-gray-500">
                Member ID
              </span>
            </div>
            <span className="text-xs font-bold font-lexend text-foreground tracking-wider">
              {member.short_id}
            </span>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <LockIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-lexend text-gray-500">
                Password
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-lexend text-foreground tracking-wider">
                {showPassword ? `Member${member.short_id}` : "••••••••"}
              </span>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeClosedIcon className="w-3.5 h-3.5" />
                ) : (
                  <EyeOpenIcon className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Valid Until */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <CalendarIcon className="w-3.5 h-3.5 text-gray-400 opacity-50" />
              <span className="text-[11px] font-lexend text-gray-500">
                Valid Until
              </span>
            </div>
            <span className="text-[11px] font-bold font-lexend text-foreground">
              {new Date(member.valid_until).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Coach */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <CoachIcon className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[11px] font-lexend text-gray-500">Coach</span>
            </div>
            <span className="text-[11px] font-bold font-lexend text-foreground">
              {member.coach_name}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full py-3 bg-primary text-white rounded-2xl font-bold font-lexend hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
}
