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

interface MemberQRCardProps {
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

export default function MemberQRCard({
  member,
  onDone,
  title = "Member Registered!",
  subtitle,
  showDoneButton = true,
}: MemberQRCardProps) {
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
        backgroundColor: "#0a0a0a", // Match card background
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
    <div className="dark flex flex-col gap-4 w-full max-w-[480px] mx-auto animate-in fade-in zoom-in-95 duration-500 text-white">
      {/* Capture Container */}
      <div
        ref={cardRef}
        className="flex flex-col items-center gap-4 w-full bg-[#0a0a0a] p-5 rounded-[32px] border border-white/5 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center pt-2">
          <h3 className="text-xl font-bold font-lexend text-white mb-0.5">
            {title}
          </h3>
          <p className="text-[13px] text-gray-400 font-lexend">
            {displaySubtitle}
          </p>
        </div>

        {/* QR Card - Matching Portal Style */}
        <div className="flex flex-col items-center gap-3">
          <div className="bg-[#111111] rounded-3xl p-5 relative border border-white/5 shadow-2xl">
            <div className="rounded-tl-lg absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
            <div className="rounded-tr-lg absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
            <div className="rounded-bl-lg absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
            <div className="rounded-br-lg absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
            <QRCodeSVG
              value={`PROJE:MEM:${member.short_id}:${member.qr_token}`}
              size={110}
              level="M"
              marginSize={1}
              className="rounded-xl"
              bgColor="#111111"
              fgColor="#ffffff"
            />
          </div>
          <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] text-center">
            Scan this for attendance
          </p>
        </div>

        {/* Details Card */}
        <div className="w-full bg-[#111111] border border-white/5 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
            <BadgeIcon className="text-primary w-4 h-4" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">
              Account Credentials
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {/* ID */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 gap-1.5">
              <div className="flex items-center gap-1.5 shrink-0">
                <FingerprintIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-lexend text-gray-400">
                  ID
                </span>
              </div>
              <span className="text-[11px] font-bold font-lexend text-white truncate">
                {member.short_id}
              </span>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 gap-1.5">
              <div className="flex items-center gap-1.5 shrink-0">
                <LockIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-lexend text-gray-400">
                  Password
                </span>
              </div>
              <div className="flex items-center gap-1.5 min-w-0 justify-end">
                <span className="text-[11px] font-bold font-lexend text-white truncate">
                  {showPassword ? `Member${member.short_id}` : "••••••••"}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-white transition-colors shrink-0"
                >
                  {showPassword ? (
                    <EyeClosedIcon className="w-3 h-3" />
                  ) : (
                    <EyeOpenIcon className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Valid Until */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 gap-1.5">
              <div className="flex items-center gap-1.5 shrink-0">
                <CalendarIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-lexend text-gray-400">
                  Expires
                </span>
              </div>
              <span className="text-[11px] font-bold font-lexend text-white truncate">
                {new Date(member.valid_until).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Coach */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 gap-1.5">
              <div className="flex items-center gap-1.5 shrink-0">
                <CoachIcon className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-[10px] font-lexend text-gray-400">
                  Coach
                </span>
              </div>
              <span className="text-[11px] font-bold font-lexend text-white truncate">
                {member.coach_name || "None"}
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
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl text-[11px] font-bold font-lexend text-white hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <ExportPNG className="w-3.5 h-3.5" />
          {downloading ? "Processing..." : "Download PNG"}
        </button>
        <button
          onClick={() => handleDownload("pdf")}
          disabled={downloading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded-xl text-[11px] font-bold font-lexend text-white hover:bg-white/10 transition-all disabled:opacity-50"
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
