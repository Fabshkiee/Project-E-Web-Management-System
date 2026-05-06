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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [membership, setMembership] = useState("");
  const [duration, setDuration] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [isSenior, setIsSenior] = useState(false);
  const [isPWD, setIsPWD] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual member creation logic
    console.log({
      fullName,
      nickname,
      phoneNumber,
      membership,
      duration,
      isStudent,
      isSenior,
      isPWD,
    });
    onClose();
  };

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
            Nickname
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

        {/* Phone Number */}
        <div>
          <label htmlFor="add-member-phone" className={labelBase}>
            Phone Number
          </label>
          <input
            id="add-member-phone"
            type="tel"
            placeholder="09XX XXX XXXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={inputBase}
          />
        </div>

        {/* Membership & Duration Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Membership Dropdown */}
          <div>
            <label htmlFor="add-member-membership" className={labelBase}>
              Membership
            </label>
            <div className="relative">
              <select
                id="add-member-membership"
                value={membership}
                onChange={(e) => setMembership(e.target.value)}
                className={`${inputBase} appearance-none pr-10 cursor-pointer`}
              >
                <option value="" disabled>
                  Select plan
                </option>
                {MEMBERSHIP_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
            </div>
          </div>

          {/* Duration Dropdown */}
          <div>
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
                className={`${inputBase} appearance-none pr-10 cursor-pointer`}
              />
            </div>
          </div>
        </div>

        {/* Discount Checkboxes */}
        <div>
          <span className={labelBase}>Discount Category</span>
          <div className="flex items-center gap-6 mt-2">
            <CheckboxItem
              id="add-member-student"
              label="Student"
              checked={isStudent}
              onChange={setIsStudent}
            />
            <CheckboxItem
              id="add-member-senior"
              label="Senior"
              checked={isSenior}
              onChange={setIsSenior}
            />
            <CheckboxItem
              id="add-member-pwd"
              label="PWD"
              checked={isPWD}
              onChange={setIsPWD}
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
            className="px-6 py-2.5 rounded-xl text-sm font-semibold font-lexend bg-primary text-white hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
          >
            Add Member
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CheckboxItem({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-2 cursor-pointer group select-none"
    >
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-[18px] h-[18px] rounded-md border-2 border-stroke dark:border-white/20 peer-checked:border-primary peer-checked:bg-primary transition-all flex items-center justify-center">
          {checked && (
            <svg
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-sm font-medium font-lexend text-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
    </label>
  );
}
