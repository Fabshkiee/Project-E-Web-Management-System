"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import {
  getMemberDetails,
  updateMemberProfile,
  getMemberFormOptions,
} from "@/lib/api/dashboard";
import MemberWelcomeCard from "./MemberWelcomeCard";
import { useToast } from "@/lib/contexts/ToastContext";
import { PrimaryButton } from "../ui/ActionButton";

interface MemberDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export default function MemberDetailsModal({
  isOpen,
  onClose,
  userId,
}: MemberDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "qr">("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [memberData, setMemberData] = useState<any>(null);
  const [coachOptions, setCoachOptions] = useState<any[]>([]);

  // Form State
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [coachId, setCoachId] = useState<string>("none");

  const { showToast } = useToast();

  useEffect(() => {
    if (!isOpen || !userId) return;

    async function fetchData() {
      setLoading(true);
      try {
        const [memberRes, optionsRes] = await Promise.all([
          getMemberDetails(userId!),
          getMemberFormOptions(),
        ]);

        if (memberRes) {
          setMemberData(memberRes);
          setFullName(memberRes.full_name);
          setNickname(memberRes.nickname || "");
          setContactNumber(memberRes.contact_number || "");
          setCoachId(memberRes.coach_id || "none");
        }

        if (optionsRes) {
          setCoachOptions(optionsRes.coaches);
        }
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    setActiveTab("profile"); // Reset tab on open
  }, [isOpen, userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
      await updateMemberProfile({
        userId,
        fullName,
        nickname,
        contactNumber,
        coachId: coachId === "none" ? null : coachId,
      });
      showToast("Profile updated successfully!", "success");
      onClose();
    } catch (error: any) {
      showToast(error.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-stroke dark:border-white/10 bg-gray-100/50 dark:bg-transparent text-foreground text-sm font-lexend placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  const labelBase =
    "text-[11px] font-medium font-lexend uppercase tracking-wider text-gray-500 dark:text-[#9CA3AF] mb-1.5 block";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Member Details"
      maxWidth="max-w-2xl"
    >
      {loading || !memberData ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {/* Tabs */}
          <div className="flex gap-4 border-b border-stroke dark:border-white/10 mb-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-3 text-sm font-semibold font-lexend transition-colors relative ${
                activeTab === "profile"
                  ? "text-primary"
                  : "text-gray-500 hover:text-foreground"
              }`}
            >
              Edit Profile
              {activeTab === "profile" && (
                <span className="absolute -bottom-px left-0 w-full h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("qr")}
              className={`pb-3 text-sm font-semibold font-lexend transition-colors relative ${
                activeTab === "qr"
                  ? "text-primary"
                  : "text-gray-500 hover:text-foreground"
              }`}
            >
              QR Profile
              {activeTab === "qr" && (
                <span className="absolute -bottom-px left-0 w-full h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === "profile" ? (
              <form onSubmit={handleSave} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <label className={labelBase}>Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputBase}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className={labelBase}>Nickname</label>
                    <input
                      type="text"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      className={inputBase}
                    />
                  </div>

                  <div className="md:col-span-1">
                    <label className={labelBase}>Contact Number</label>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className={inputBase}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelBase}>Assigned Coach</label>
                    <select
                      value={coachId}
                      onChange={(e) => setCoachId(e.target.value)}
                      className={inputBase}
                    >
                      <option value="none">No Coach (Self-Guided)</option>
                      {coachOptions.map((coach) => (
                        <option key={coach.id} value={coach.id}>
                          {coach.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4 mt-2 border-t border-stroke dark:border-white/10">
                  <PrimaryButton type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </PrimaryButton>
                </div>
              </form>
            ) : (
              <div className="flex justify-center items-center py-4">
                <MemberWelcomeCard
                  member={{
                    full_name: memberData.full_name,
                    nickname: memberData.nickname,
                    short_id: memberData.short_id,
                    qr_token: memberData.qr_token,
                    valid_until: memberData.valid_until,
                    membership_name: memberData.membership_name,
                    coach_name: memberData.coach_name,
                  }}
                  title="Digital ID Card"
                  subtitle={`QR Profile for ${memberData.full_name}`}
                  showDoneButton={false}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
