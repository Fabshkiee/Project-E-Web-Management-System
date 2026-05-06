"use client";

import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { ChevronDownIcon } from "@/components/ui/Icons";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEMBERSHIP_OPTIONS = ["Basic", "Supervision", "Coaching"];

export default function AddMemberModal({
  isOpen,
  onClose,
}: AddMemberModalProps) {
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [membership, setMembership] = useState("");
  const [duration, setDuration] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);

  // Dropdown states
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual member creation logic
    console.log({
      fullName,
      nickname,
      contactNumber,
      membership,
      duration,
      hasDiscount,
    });
    onClose();
  };

  const isFormValid = fullName.trim() !== "" && membership !== "" && duration !== "";

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-stroke dark:border-white/10 bg-transparent text-foreground text-sm font-lexend placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  const labelBase =
    "text-[11px] font-medium font-lexend uppercase tracking-wider text-[#9CA3AF] mb-1.5 block";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Member">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <label htmlFor="add-member-fullname" className={labelBase}>
            Full Name
          </label>
          <input
            id="add-member-fullname"
            type="text"
            placeholder="Enter full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={inputBase}
          />
        </div>

        {/* Nickname */}
        <div>
          <label htmlFor="add-member-nickname" className={labelBase}>
            Nickname (Optional)
          </label>
          <input
            id="add-member-nickname"
            type="text"
            placeholder="Enter nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className={inputBase}
          />
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="add-member-contact" className={labelBase}>
            Contact Number (Optional)
          </label>
          <input
            id="add-member-contact"
            type="tel"
            placeholder="09XX XXX XXXX"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            maxLength={11}
            className={inputBase}
          />
        </div>

        {/* Membership & Duration Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Custom Membership Dropdown */}
          <div className="relative">
            <label className={labelBase}>Membership</label>
            <div
              className={`${inputBase} flex items-center justify-between cursor-pointer ${isMembershipOpen ? "border-primary ring-2 ring-primary/30" : ""}`}
              onClick={() => setIsMembershipOpen(!isMembershipOpen)}
            >
              <span
                className={membership ? "text-foreground" : "text-[#9CA3AF]"}
              >
                {membership || "Select plan"}
              </span>
              <ChevronDownIcon
                className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${isMembershipOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isMembershipOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMembershipOpen(false)}
                />
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#1f1f1f] border border-stroke dark:border-white/10 rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
                  {MEMBERSHIP_OPTIONS.map((opt) => (
                    <div
                      key={opt}
                      className="px-4 py-2 text-sm font-lexend text-foreground hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                      onClick={() => {
                        setMembership(opt);
                        setIsMembershipOpen(false);
                      }}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Duration Input */}
          <div>
            <label htmlFor="add-member-duration" className={labelBase}>
              Duration
            </label>
            <input
              id="add-member-duration"
              type="text"
              placeholder="Months (1-12)"
              value={duration}
              min={1}
              max={12}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,2}$/.test(val) && Number(val) <= 12) {
                  setDuration(val);
                }
              }}
              maxLength={2}
              pattern="[0-9]*"
              inputMode="numeric"
              className={inputBase}
            />
          </div>
        </div>

        {/* Discount Toggle */}
        <div
          className="flex items-center justify-between p-4 rounded-xl border border-stroke dark:border-white/10 bg-gray-50/50 dark:bg-white/2 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 transition-all group"
          onClick={() => setHasDiscount(!hasDiscount)}
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold font-lexend text-foreground">
              Student / Senior / PWD
            </span>
            <span className="text-[11px] font-lexend text-[#9CA3AF]">
              Please verify the ID before applying the discount.
            </span>
          </div>
          <div className="relative">
            <div
              className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                hasDiscount ? "bg-primary" : "bg-gray-200 dark:bg-white/10"
              }`}
            />
            <div
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                hasDiscount ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stroke dark:border-white/5" />

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium font-lexend text-secondary hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold font-lexend transition-all shadow-sm ${
              isFormValid 
                ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98] cursor-pointer" 
                : "bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed"
            }`}
          >
            Add Member
          </button>
        </div>
      </form>
    </Modal>
  );
}
