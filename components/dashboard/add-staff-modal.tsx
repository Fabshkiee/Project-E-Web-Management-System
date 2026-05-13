"use client";

import React, { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { PrimaryButton, SecondaryButton } from "@/components/ui/ActionButton";
import { PlusIcon } from "@/components/ui/Icons";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/lib/contexts/ToastContext";
import { createStaffProfile, CreateStaffPayload } from "@/lib/api/dashboard";

interface AddStaffModalProps {
  onSuccess?: () => void;
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

export default function AddStaffModal({ onSuccess }: AddStaffModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [formData, setFormData] = useState<CreateStaffPayload>({
    p_full_name: "",
    p_nickname: "",
    p_short_id: "",
    p_contact_number: "",
    p_base_role: "Staff",
    p_subrole: "Coach",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createStaffProfile(formData);
      showToast("Staff member added successfully", "success");
      setIsOpen(false);
      setFormData({
        p_full_name: "",
        p_nickname: "",
        p_short_id: "",
        p_contact_number: "",
        p_base_role: "Staff",
        p_subrole: "Coach",
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      showToast(error.message || "Failed to add staff member", "error");
    } finally {
      setLoading(false);
    }
  };

  //reset form when exit
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        p_full_name: "",
        p_nickname: "",
        p_short_id: "",
        p_contact_number: "",
        p_base_role: "Staff",
        p_subrole: "Coach",
      });
    }
  }, [isOpen]);

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-stroke dark:border-white/10 bg-gray-100/50 dark:bg-transparent text-foreground text-sm font-lexend transition-all focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none";
  const labelClass =
    "text-[11px] font-medium font-lexend uppercase tracking-wider text-gray-500 dark:text-[#9CA3AF] mb-1.5 block";

  return (
    <>
      <PrimaryButton
        onClick={() => setIsOpen(true)}
        icon={<PlusIcon className="w-6 h-6" />}
      >
        Add New Staff
      </PrimaryButton>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Staff Member"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Full Name */}
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                required
                className={inputClass}
                value={formData.p_full_name}
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
                  setFormData({ ...formData, p_full_name: e.target.value })
                }
              />
            </div>

            {/* Nickname */}
            <div>
              <label className={labelClass}>Nickname (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Coach John"
                className={inputClass}
                value={formData.p_nickname || ""}
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
                  setFormData({ ...formData, p_nickname: e.target.value })
                }
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className={labelClass}>Contact Number</label>
              <input
                type="tel"
                placeholder="09XXXXXXXXX"
                maxLength={11}
                className={inputClass}
                value={formData.p_contact_number || ""}
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
                  setFormData({ ...formData, p_contact_number: e.target.value })
                }
              />
            </div>

            {/* Base Role */}
            <Select
              label="Base Role"
              options={BASE_ROLE_OPTIONS}
              value={formData.p_base_role}
              onChange={(val) => setFormData({ ...formData, p_base_role: val })}
            />

            {/* Subrole */}
            <div className="col-span-2">
              <Select
                label="Subrole"
                options={SUBROLE_OPTIONS}
                value={formData.p_subrole}
                onChange={(val) => setFormData({ ...formData, p_subrole: val })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <SecondaryButton type="button" onClick={() => setIsOpen(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Staff Member"}
            </PrimaryButton>
          </div>
        </form>
      </Modal>
    </>
  );
}
