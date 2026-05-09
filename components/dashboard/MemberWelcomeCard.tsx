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
    <div className="flex flex-col items-center gap-8 py-4 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold font-lexend text-foreground mb-1">
          Member Registered!
        </h3>
        <p className="text-sm text-gray-500 dark:text-[#9CA3AF] font-lexend">
          Welcome to the family,{" "}
          {member.nickname || member.full_name.split(" ")[0]}
        </p>
      </div>

      {/* QR Card - Matching Portal Style */}
      <div className="flex flex-col items-center gap-4">
        <div className="bg-gray-100 dark:bg-[#111111] rounded-3xl p-8 relative border border-stroke dark:border-white/5 shadow-2xl">
          <div className="rounded-tl-lg absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
          <div className="rounded-tr-lg absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-primary"></div>
          <div className="rounded-bl-lg absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-primary"></div>
          <div className="rounded-br-lg absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-primary"></div>
          <QRCodeSVG
            value={`PROJE:MEM:${member.short_id}:${member.qr_token}`}
            size={180}
            level="M"
            marginSize={1}
            className="rounded-xl"
          />
        </div>
        <p className="text-[10px] font-bold text-gray-400 dark:text-white/30 uppercase tracking-[0.2em] text-center">
          Scan this for attendance
        </p>
      </div>

      {/* Details Card */}
      <div className="w-full bg-gray-50 dark:bg-[#111111] border border-stroke dark:border-white/5 rounded-2xl p-6 space-y-5 shadow-sm">
        <div className="flex items-center gap-3 pb-3 border-b border-stroke dark:border-white/5">
          <BadgeIcon className="text-primary w-5 h-5" />
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-foreground">
            Account Credentials
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* ID */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
            <div className="flex items-center gap-3">
              <FingerprintIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-lexend text-gray-500">
                Member ID
              </span>
            </div>
            <span className="text-sm font-bold font-lexend text-foreground tracking-wider">
              {member.short_id}
            </span>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
            <div className="flex items-center gap-3">
              <LockIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-lexend text-gray-500">
                Password
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-lexend text-foreground tracking-wider">
                {showPassword ? `Member${member.short_id}` : "••••••••"}
              </span>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-primary transition-colors"
              >
                {showPassword ? (
                  <EyeClosedIcon className="w-4 h-4" />
                ) : (
                  <EyeOpenIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Valid Until */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-4 h-4 text-gray-400 opacity-50" />
              <span className="text-xs font-lexend text-gray-500">
                Valid Until
              </span>
            </div>
            <span className="text-xs font-bold font-lexend text-foreground">
              {new Date(member.valid_until).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Coach */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
            <div className="flex items-center gap-3">
              <CoachIcon className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-lexend text-gray-500">Coach</span>
            </div>
            <span className="text-xs font-bold font-lexend text-foreground">
              {member.coach_name}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onDone}
        className="w-full py-4 bg-primary text-white rounded-2xl font-bold font-lexend hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
}
