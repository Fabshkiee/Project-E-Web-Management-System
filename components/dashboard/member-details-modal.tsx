"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import {
  getMemberDetails,
  updateMemberProfile,
  getMemberFormOptions,
  renewMember,
  terminateMembership,
} from "@/lib/api/dashboard";
import MemberWelcomeCard from "./MemberWelcomeCard";
import { StatusTag } from "@/components/ui/StatusTag";
import { Select } from "../ui/Select";
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
  const [activeTab, setActiveTab] = useState<"profile" | "qr" | "renew" | "terminate">(
    "profile",
  );
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [memberData, setMemberData] = useState<any>(null);
  const [coachOptions, setCoachOptions] = useState<any[]>([]);
  const [membershipOptions, setMembershipOptions] = useState<any[]>([]);

  // Form State - Profile
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [coachId, setCoachId] = useState<string>("none");

  // Form State - Renewal
  const [membershipTypeId, setMembershipTypeId] = useState("");
  const [durationMonths, setDurationMonths] = useState(1);
  const [confirmedTerminate, setConfirmedTerminate] = useState(false);

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
          setMembershipOptions(optionsRes.membershipTypes);
          if (optionsRes.membershipTypes.length > 0) {
            setMembershipTypeId(optionsRes.membershipTypes[0].id);
          }
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

  const handleRenew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    try {
      await renewMember({
        memberId: userId,
        membershipTypeId,
        durationMonths,
      });
      showToast("Membership renewed successfully!", "success");
      onClose();
    } catch (error: any) {
      showToast(error.message || "Failed to renew membership", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTerminate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !confirmedTerminate) return;

    setSaving(true);
    try {
      await terminateMembership(userId);
      showToast("Membership terminated successfully", "success");
      onClose();
    } catch (error: any) {
      showToast(error.message || "Failed to terminate membership", "error");
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
            <button
              onClick={() => setActiveTab("renew")}
              className={`pb-3 text-sm font-semibold font-lexend transition-colors relative ${
                activeTab === "renew"
                  ? "text-primary"
                  : "text-gray-500 hover:text-foreground"
              }`}
            >
              Renew Membership
              {activeTab === "renew" && (
                <span className="absolute -bottom-px left-0 w-full h-[2px] bg-primary rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("terminate")}
              className={`pb-3 text-sm font-semibold font-lexend transition-colors relative ${
                activeTab === "terminate"
                  ? "text-red-500"
                  : "text-gray-500 hover:text-red-500"
              }`}
            >
              Terminate
              {activeTab === "terminate" && (
                <span className="absolute -bottom-px left-0 w-full h-[2px] bg-red-500 rounded-t-full" />
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
                    <Select
                      label="Assigned Coach"
                      value={coachId || "none"}
                      onChange={(val) => setCoachId(val === "none" ? null : val)}
                      options={[
                        { label: "No Coach (Self-Guided)", value: "none" },
                        ...coachOptions.map((coach) => ({
                          label: coach.full_name,
                          value: coach.id,
                        })),
                      ]}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 mt-2 border-t border-stroke dark:border-white/10">
                  <PrimaryButton type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </PrimaryButton>
                </div>
              </form>
            ) : activeTab === "qr" ? (
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
            ) : activeTab === "renew" ? (
              <form onSubmit={handleRenew} className="flex flex-col gap-5">
                <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 mb-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 font-lexend">
                      Current Expiration
                    </span>
                    <span
                      className={`text-xs font-bold font-lexend ${(() => {
                        const expiry = new Date(memberData.valid_until);
                        const now = new Date();
                        const diffDays = Math.ceil(
                          (expiry.getTime() - now.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                        if (expiry < now)
                          return "text-[#9F1239] dark:text-[#F87171]";
                        if (diffDays <= 3)
                          return "text-[#92400E] dark:text-[#FBBF24]";
                        return "text-[#166534] dark:text-[#4ADE80]";
                      })()}`}
                    >
                      {new Date(memberData.valid_until).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "short", year: "numeric" },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 font-lexend">
                      Status
                    </span>
                    <StatusTag
                      type={(() => {
                        const expiry = new Date(memberData.valid_until);
                        const now = new Date();
                        const diffDays = Math.ceil(
                          (expiry.getTime() - now.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );

                        if (expiry < now) return "Expired";
                        if (diffDays <= 3) return "Expiring";
                        return "Active";
                      })()}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="md:col-span-2">
                    <Select
                      label="Membership Type"
                      value={membershipTypeId}
                      onChange={(val) => setMembershipTypeId(val)}
                      options={membershipOptions.map((mt) => ({
                        label: mt.name,
                        value: mt.id,
                      }))}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelBase}>Duration (Months)</label>
                    <input
                      type="text"
                      min="1"
                      required
                      value={durationMonths}
                      onChange={(e) =>
                        setDurationMonths(parseInt(e.target.value) || 0)
                      }
                      className={inputBase}
                      placeholder="Enter number of months"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 mt-2 border-t border-stroke dark:border-white/10">
                  <PrimaryButton type="submit" disabled={saving}>
                    {saving ? "Processing..." : "Confirm Renewal"}
                  </PrimaryButton>
                </div>
              </form>
            ) : (
              <form onSubmit={handleTerminate} className="flex flex-col gap-6">
                <div className="p-6 bg-red-50 dark:bg-red-500/10 rounded-2xl border border-red-200 dark:border-red-500/20">
                  <h3 className="text-red-700 dark:text-red-400 font-bold font-lexend mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    Warning: Critical Action
                  </h3>
                  <p className="text-sm text-red-600/80 dark:text-red-400/80 font-lexend leading-relaxed">
                    Terminating this membership will set the expiration date to
                    today immediately. The member will no longer have access to
                    gym facilities starting now. This action can only be undone
                    by manual renewal.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-2">
                  <input
                    type="checkbox"
                    id="confirm-terminate"
                    checked={confirmedTerminate}
                    onChange={(e) => setConfirmedTerminate(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label
                    htmlFor="confirm-terminate"
                    className="text-sm text-gray-600 dark:text-gray-400 font-lexend cursor-pointer select-none"
                  >
                    I understand that this will immediately revoke gym access
                    for{" "}
                    <span className="font-bold text-foreground">
                      {memberData.full_name}
                    </span>
                    .
                  </label>
                </div>

                <div className="flex justify-end pt-4 mt-2 border-t border-stroke dark:border-white/10">
                  <button
                    type="submit"
                    disabled={!confirmedTerminate || saving}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold font-lexend rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95 flex items-center gap-2"
                  >
                    {saving ? "Processing..." : "Terminate Membership"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
