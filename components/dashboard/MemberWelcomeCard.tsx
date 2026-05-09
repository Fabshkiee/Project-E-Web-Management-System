"use client";

import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { QRCodeSVG } from "qrcode.react";
import {
  FingerprintIcon,
  LockIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  BadgeIcon,
  CalendarIcon,
  CoachIcon,
  ExportPDF,
  ExportPNG,
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
  onDone?: () => void;
  title?: string;
  subtitle?: string;
  showDoneButton?: boolean;
}

export default function MemberWelcomeCard({
  member,
  onDone,
  title = "Member Registered!",
  subtitle,
  showDoneButton = true,
}: MemberWelcomeCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const firstName = member.nickname || member.full_name.split(" ")[0];
  const displaySubtitle = subtitle || `Welcome to the family, ${firstName}`;
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (format: "png" | "pdf") => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Wait for entrance animations (duration-500) to complete
      await new Promise((resolve) => setTimeout(resolve, 600));

      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: document.documentElement.classList.contains("dark")
          ? "#111111"
          : "#ffffff",
        style: {
          padding: "0px",
          borderRadius: "0px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
          width: "440px",
          transform: "none",
        },
        pixelRatio: 2,
      });

      if (format === "png") {
        const link = document.createElement("a");
        link.download = `ProjectE_ID_${
          member.full_name.trim().split(" ")[0]
        }.png`;
        link.href = dataUrl;
        link.click();
      } else {
        const pdf: any = new jsPDF();
        const imgProps: any = pdf.getImageProperties(dataUrl);
        // Create a PDF with custom dimensions matching the image
        const pdf2: any = new jsPDF({
          orientation: imgProps.width > imgProps.height ? "l" : "p",
          unit: "px",
          format: [imgProps.width, imgProps.height],
        });
        pdf2.addImage(dataUrl, "PNG", 0, 0, imgProps.width, imgProps.height);
        pdf2.save(`ProjectE_ID_${member.full_name.trim().split(" ")[0]}.pdf`);
      }
    } catch (err) {
      console.error("Download failed:", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[440px] mx-auto animate-in fade-in zoom-in-95 duration-500">
      {/* Capture Container */}
      <div
        ref={cardRef}
        className="flex flex-col items-center gap-5 w-full bg-transparent"
      >
        {/* Header */}
        <div className="text-center pt-2">
          <h3 className="text-xl font-bold font-lexend text-foreground mb-0.5">
            {title}
          </h3>
          <p className="text-[13px] text-gray-500 dark:text-[#9CA3AF] font-lexend">
            {displaySubtitle}
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
              size={120}
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
              <div className="flex items-center gap-2.5 min-w-0">
                <FingerprintIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] font-lexend text-gray-500 truncate">
                  Member ID
                </span>
              </div>
              <span className="text-xs font-bold font-lexend text-foreground tracking-wider flex-shrink-0 ml-4">
                {member.short_id}
              </span>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <LockIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] font-lexend text-gray-500 truncate">
                  Password
                </span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
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
              <div className="flex items-center gap-2.5 min-w-0">
                <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] font-lexend text-gray-500 truncate">
                  Valid Until
                </span>
              </div>
              <span className="text-xs font-bold font-lexend text-foreground flex-shrink-0 ml-4">
                {new Date(member.valid_until).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Coach */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-white/2 border border-stroke dark:border-white/5">
              <div className="flex items-center gap-2.5 min-w-0">
                <CoachIcon className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[11px] font-lexend text-gray-500 truncate">
                  Coach
                </span>
              </div>
              <span className="text-xs font-bold font-lexend text-foreground flex-shrink-0 ml-4">
                {member.coach_name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Actions */}
      <div className="grid grid-cols-2 gap-3 w-full mt-2">
        <button
          onClick={() => handleDownload("png")}
          disabled={downloading}
          className="flex items-center justify-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-stroke dark:border-white/10 rounded-xl text-[11px] font-bold font-lexend text-foreground hover:bg-gray-50 dark:hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <ExportPNG className="w-3.5 h-3.5 text-green-500" />
          {downloading ? "Processing..." : "Download PNG"}
        </button>
        <button
          onClick={() => handleDownload("pdf")}
          disabled={downloading}
          className="flex items-center justify-center gap-2 px-4 py-1.5 bg-white dark:bg-white/5 border border-stroke dark:border-white/10 rounded-xl text-[11px] font-bold font-lexend text-foreground hover:bg-gray-50 dark:hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <ExportPDF className="w-3.5 h-3.5" />
          {downloading ? "Processing..." : "Download PDF"}
        </button>
      </div>

      {showDoneButton && (
        <button
          onClick={onDone}
          className="w-full py-3 bg-primary text-white rounded-2xl font-bold font-lexend hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
        >
          Done
        </button>
      )}
    </div>
  );
}
