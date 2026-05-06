"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { ChevronDownIcon } from "@/components/ui/Icons";
import { getMemberFormOptions, createMemberProfile } from "@/lib/api/dashboard";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEMBERSHIP_OPTIONS = ["Basic", "Supervision", "Coaching"];
const COACH_OPTIONS = ["Coach Eric", "Coach Ezekiel"];

const PRICES = {
  Basic: { regular: 900, discounted: 700 },
  Supervision: { regular: 1500, discounted: 1200 },
  Coaching: { regular: 3000, discounted: 2500 },
};

export default function AddMemberModal({
  isOpen,
  onClose,
}: AddMemberModalProps) {
  // DB Options State
  const [membershipOptions, setMembershipOptions] = useState<any[]>([]);
  const [coachOptions, setCoachOptions] = useState<any[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [membership, setMembership] = useState("");
  const [duration, setDuration] = useState("");
  const [coach, setCoach] = useState("");
  const [hasDiscount, setHasDiscount] = useState(false);

  // Dropdown states
  const [isMembershipOpen, setIsMembershipOpen] = useState(false);
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  // Fetch Options from DB
  useEffect(() => {
    async function loadOptions() {
      setIsLoadingOptions(true);
      try {
        const { membershipTypes, coaches } = await getMemberFormOptions();
        setMembershipOptions(membershipTypes);
        setCoachOptions(coaches);
      } catch (err) {
        console.error("Failed to load form options", err);
      } finally {
        setIsLoadingOptions(false);
      }
    }
    loadOptions();
  }, []);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFullName("");
      setNickname("");
      setContactNumber("");
      setMembership("");
      setDuration("");
      setCoach("");
      setHasDiscount(false);
      setIsMembershipOpen(false);
      setIsCoachOpen(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Find UUIDs
      const selectedPlan = membershipOptions.find((m) => m.name === membership);
      const selectedCoach = coachOptions.find((c) => c.full_name === coach);

      if (!selectedPlan) throw new Error("Invalid membership selected");

      // Set start date to today
      const today = new Date().toISOString().split("T")[0];

      await createMemberProfile({
        p_short_id: null, // Auto-generated
        p_membership_type_id: selectedPlan.id,
        p_coach_id: selectedCoach ? selectedCoach.id : null,
        p_full_name: fullName,
        p_nickname: nickname || null,
        p_contact_number: contactNumber || null,
        p_started_date: today,
        p_duration_months: Number(duration),
        p_is_discounted: hasDiscount,
      });

      // Reset & Close on success
      onClose();
    } catch (error) {
      console.error("Error creating member:", error);
      alert("Failed to create member. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    fullName.trim() !== "" &&
    membership !== "" &&
    duration !== "" &&
    (membership === "Coaching" ? coach !== "" : true);

  const calculateTotal = () => {
    if (!membership || !duration) return 0;
    const rates = PRICES[membership as keyof typeof PRICES];
    const rate = hasDiscount ? rates.discounted : rates.regular;
    return rate * Number(duration);
  };

  const total = calculateTotal();

  const inputBase =
    "w-full px-4 py-3 rounded-xl border border-stroke dark:border-white/10 bg-gray-100/50 dark:bg-transparent text-foreground text-sm font-lexend placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  const labelBase =
    "text-[11px] font-medium font-lexend uppercase tracking-wider text-gray-500 dark:text-[#9CA3AF] mb-1.5 block";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Member" maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Full Name */}
          <div className="md:col-span-1">
            <label htmlFor="add-member-fullname" className={labelBase}>
              Full Name
            </label>
            <input
              id="add-member-fullname"
              type="text"
              placeholder="e.g. Alex Johnson"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Nickname */}
          <div className="md:col-span-1">
            <label htmlFor="add-member-nickname" className={labelBase}>
              Nickname (Optional)
            </label>
            <input
              id="add-member-nickname"
              type="text"
              placeholder="e.g. Lex"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={inputBase}
            />
          </div>

          {/* Contact Number */}
          <div className="md:col-span-1">
            <label htmlFor="add-member-contact" className={labelBase}>
              Contact Number (Optional)
            </label>
            <input
              id="add-member-contact"
              type="tel"
              placeholder="09XXXXXXXXX"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              maxLength={11}
              className={inputBase}
            />
          </div>

          {/* Membership Dropdown */}
          <div className="md:col-span-1 relative">
            <label className={labelBase}>Membership</label>
            <div
              className={`${inputBase} flex items-center justify-between cursor-pointer ${isMembershipOpen ? "border-primary ring-2 ring-primary/30" : ""}`}
              onClick={() => setIsMembershipOpen(!isMembershipOpen)}
            >
              <span className={membership ? "text-foreground" : "text-[#9CA3AF]"}>
                {membership || "Select plan"}
              </span>
              <ChevronDownIcon className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${isMembershipOpen ? "rotate-180" : ""}`} />
            </div>

            {isMembershipOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMembershipOpen(false)} />
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#1f1f1f] border border-stroke dark:border-white/10 rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-1 duration-200 max-h-48 overflow-y-auto">
                  {isLoadingOptions ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                  ) : membershipOptions.length > 0 ? (
                    membershipOptions.map((opt) => (
                      <div
                        key={opt.id}
                        className="px-4 py-2 text-sm font-lexend text-foreground hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                        onClick={() => {
                          setMembership(opt.name);
                          setIsMembershipOpen(false);
                        }}
                      >
                        {opt.name}
                      </div>
                    ))
                  ) : (
                    // Fallback to static if DB fails
                    MEMBERSHIP_OPTIONS.map((opt) => (
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
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          {/* Duration Input */}
          <div className={membership === "Coaching" ? "md:col-span-1" : "md:col-span-2"}>
            <label htmlFor="add-member-duration" className={labelBase}>
              Duration (Months)
            </label>
            <input
              id="add-member-duration"
              type="text"
              placeholder="e.g. 1"
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

          {/* Conditional Coach Dropdown */}
          {membership === "Coaching" && (
            <div className="md:col-span-1 relative animate-in fade-in slide-in-from-right-2 duration-300">
              <label className={labelBase}>Assign Coach</label>
              <div
                className={`${inputBase} flex items-center justify-between cursor-pointer ${isCoachOpen ? "border-primary ring-2 ring-primary/30" : ""}`}
                onClick={() => setIsCoachOpen(!isCoachOpen)}
              >
                <span className={coach ? "text-foreground" : "text-[#9CA3AF]"}>
                  {coach || "Select a coach"}
                </span>
                <ChevronDownIcon className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${isCoachOpen ? "rotate-180" : ""}`} />
              </div>

              {isCoachOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCoachOpen(false)} />
                  <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white dark:bg-[#1f1f1f] border border-stroke dark:border-white/10 rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-1 duration-200 max-h-48 overflow-y-auto">
                    {isLoadingOptions ? (
                      <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                    ) : coachOptions.length > 0 ? (
                      coachOptions.map((opt) => (
                        <div
                          key={opt.id}
                          className="px-4 py-2 text-sm font-lexend text-foreground hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => {
                            setCoach(opt.full_name);
                            setIsCoachOpen(false);
                          }}
                        >
                          {opt.full_name}
                        </div>
                      ))
                    ) : (
                      // Fallback to static if DB fails
                      COACH_OPTIONS.map((opt) => (
                        <div
                          key={opt}
                          className="px-4 py-2 text-sm font-lexend text-foreground hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors"
                          onClick={() => {
                            setCoach(opt);
                            setIsCoachOpen(false);
                          }}
                        >
                          {opt}
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Discount Toggle - Full Width */}
        <div
          className="flex items-center justify-between p-4 rounded-xl border border-stroke dark:border-white/10 bg-gray-100/50 dark:bg-white/2 cursor-pointer hover:bg-gray-200/50 dark:hover:bg-white/5 transition-all group"
          onClick={() => setHasDiscount(!hasDiscount)}
        >
          <div className="flex flex-col">
            <span className="text-sm font-semibold font-lexend text-foreground">
              Student / Senior / PWD
            </span>
            <span className="text-[11px] font-lexend text-gray-500 dark:text-[#9CA3AF]">
              Please verify the ID before applying the discount.
            </span>
          </div>
          <div className="relative">
            <div
              className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
                hasDiscount ? "bg-primary" : "bg-gray-300 dark:bg-white/10"
              }`}
            />
            <div
              className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${
                hasDiscount ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
        </div>

        {/* Actions Area */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium font-lexend text-secondary hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold font-lexend transition-all shadow-sm flex items-center justify-center min-w-[120px] ${
                isFormValid && !isSubmitting
                  ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98] cursor-pointer"
                  : "bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                "Add Member"
              )}
            </button>
          </div>

          <div className="flex flex-col items-end">
            {membership && duration && (
              <div className="animate-in fade-in slide-in-from-right-2 duration-300 text-right">
                <span className="text-[10px] font-bold tracking-[0.1em] text-gray-400 dark:text-white/30 uppercase">
                  Total Amount
                </span>
                <p className="text-xl font-bold font-lexend text-primary leading-none">
                  ₱{total.toLocaleString()}
                </p>
                <p className="text-[10px] font-lexend text-gray-400 dark:text-white/20 mt-1 uppercase tracking-wider">
                  ₱{hasDiscount ? PRICES[membership as keyof typeof PRICES].discounted : PRICES[membership as keyof typeof PRICES].regular} × {duration} Month{Number(duration) > 1 ? "s" : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
