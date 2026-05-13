"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/lib/contexts/ToastContext";
import { getStaffDetails, updateStaffProfile } from "@/lib/api/dashboard";

import StaffQRCard from "./StaffQRCard";

interface StaffDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  currentUserRole: string | null;
  currentUserId: string | null;
}

const SUBROLE_OPTIONS = [
  { label: "Coach", value: "Coach" },
  { label: "Receptionist", value: "Receptionist" },
  { label: "Gym Manager", value: "Gym Manager" },
  { label: "Maintenance", value: "Maintenance" },
];

const BASE_ROLE_OPTIONS = [
  { label: "Staff", value: "Staff" },
  { label: "Admin", value: "Admin" },
];

export default function StaffDetailsModal({
  isOpen,
  onClose,
  userId,
  currentUserRole,
  currentUserId,
}: StaffDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "qr">("profile");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [staffData, setStaffData] = useState<any>(null);
  const { showToast } = useToast();

  const isOwnProfile = userId && currentUserId ? userId === currentUserId : false;
  const isAdmin = currentUserRole === "Admin";
  
  // Rule: Staff can ONLY edit their own profile basic info.
  // Admins can edit everything.
  const isReadOnly = !isAdmin && !isOwnProfile;
  const canEditRole = isAdmin;

  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    contactNumber: "",
    baseRole: "Staff",
    subrole: "Coach",
  });

  useEffect(() => {
    if (isOpen && userId) {
      fetchStaffDetails();
      setActiveTab("profile");
    }
  }, [isOpen, userId]);

  const fetchStaffDetails = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const data = await getStaffDetails(userId);

      if (data) {
        setStaffData(data);
        setFormData({
          fullName: data.full_name || "",
          nickname: data.nickname || "",
          contactNumber: data.contact_number || "",
          baseRole: data.base_role || "Staff",
          subrole: data.subrole || "Coach",
        });
      }
    } catch (error: any) {
      showToast(error.message || "Failed to fetch staff details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    try {
      await updateStaffProfile({
        p_user_id: userId,
        p_full_name: formData.fullName,
        p_nickname: formData.nickname,
        p_contact_number: formData.contactNumber,
        p_role: formData.baseRole,
        p_subrole: formData.subrole,
      });

      showToast("Staff profile updated successfully", "success");
      onClose();
    } catch (error: any) {
      showToast(error.message || "Failed to update staff profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-stroke dark:border-white/10 bg-gray-100/50 dark:bg-transparent text-foreground text-sm font-lexend transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none";
  const labelClass =
    "text-[11px] font-medium font-lexend uppercase tracking-wider text-gray-500 dark:text-[#9CA3AF] mb-1.5 block";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Staff Details"
      maxWidth="max-w-2xl"
    >
      {loading || !staffData ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
            {(isAdmin || isOwnProfile) && (
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
            )}
          </div>

          <div className="flex-1">
            {activeTab === "profile" ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      required
                      readOnly={isReadOnly}
                      className={`${inputClass} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                      value={formData.fullName}
                      onKeyDown={(e) => {
                        if (
                          !/[a-zA-Z ]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                    />
                  </div>

                  {/* Nickname */}
                  <div>
                    <label className={labelClass}>Nickname (Optional)</label>
                    <input
                      type="text"
                      readOnly={isReadOnly}
                      className={`${inputClass} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                      value={formData.nickname}
                      onKeyDown={(e) => {
                        if (
                          !/[a-zA-Z ]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        setFormData({ ...formData, nickname: e.target.value })
                      }
                    />
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className={labelClass}>Contact Number</label>
                    <input
                      type="tel"
                      maxLength={11}
                      readOnly={isReadOnly}
                      className={`${inputClass} ${isReadOnly ? "opacity-60 cursor-not-allowed" : ""}`}
                      value={formData.contactNumber}
                      onKeyDown={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactNumber: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Select
                    label="Base Role"
                    options={BASE_ROLE_OPTIONS}
                    value={formData.baseRole}
                    disabled={!canEditRole}
                    onChange={(val) =>
                      setFormData({ ...formData, baseRole: val })
                    }
                  />

                  {/* Subrole */}
                  <Select
                    label="Subrole"
                    options={SUBROLE_OPTIONS}
                    value={formData.subrole}
                    disabled={!canEditRole}
                    onChange={(val) =>
                      setFormData({ ...formData, subrole: val })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
                  {!isReadOnly && (
                    <>
                      <SecondaryButton type="button" onClick={onClose}>
                        Cancel
                      </SecondaryButton>
                      <PrimaryButton type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                      </PrimaryButton>
                    </>
                  )}
                  {isReadOnly && (
                    <PrimaryButton type="button" onClick={onClose}>
                      Close
                    </PrimaryButton>
                  )}
                </div>
              </form>
            ) : (
              <div className="py-4">
                <StaffQRCard
                  staff={staffData}
                  showDoneButton={false}
                  title={`${staffData.full_name}'s Identity`}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
