"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/lib/contexts/ToastContext";
import { createClient } from "@/lib/supabase/client";
import { getStaffDetails, updateStaffProfile } from "@/lib/api/dashboard";

interface StaffDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
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
}: StaffDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

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
    }
  }, [isOpen, userId]);

  const fetchStaffDetails = async () => {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();

    try {
      const data = await getStaffDetails(userId);

      if (data) {
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
      title="Edit Staff Member"
      maxWidth="max-w-md"
    >
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                required
                className={inputClass}
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
                className={inputClass}
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
            <div className="col-span-1">
              <label className={labelClass}>Contact Number</label>
              <input
                type="tel"
                maxLength={11}
                className={inputClass}
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
                  setFormData({ ...formData, contactNumber: e.target.value })
                }
              />
            </div>

            {/* Base Role */}
            <Select
              label="Base Role"
              options={BASE_ROLE_OPTIONS}
              value={formData.baseRole}
              onChange={(val) => setFormData({ ...formData, baseRole: val })}
            />

            {/* Subrole */}
            <div className="col-span-2">
              <Select
                label="Subrole"
                options={SUBROLE_OPTIONS}
                value={formData.subrole}
                onChange={(val) => setFormData({ ...formData, subrole: val })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton type="button" onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </PrimaryButton>
          </div>
        </form>
      )}
    </Modal>
  );
}
