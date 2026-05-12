"use client";

import React, { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { createClient } from "@/lib/supabase/client";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { manualCheckIn } from "@/lib/api/dashboard";
import { useToast } from "@/lib/contexts/ToastContext";
import { SearchIcon } from "@/components/ui/Icons";

interface ManualCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface SearchResult {
  id: string;
  full_name: string;
  short_id: string;
  role: string;
  status: string;
  subtext: string;
}

export default function ManualCheckInModal({
  isOpen,
  onClose,
  onSuccess,
}: ManualCheckInModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const supabase = createClient();

        // Fetch users matching query
        const { data, error } = await supabase
          .from("users")
          .select(
            `
            id,
            full_name,
            short_id,
            role,
            members (
              status,
              valid_until
            ),
            staff (
              subrole
            )
          `,
          )
          .or(
            `full_name.ilike.%${searchQuery}%,short_id.ilike.%${searchQuery}%`,
          )
          .limit(5);

        if (error) throw error;

        const formattedResults: SearchResult[] = (data || []).map(
          (user: any) => {
            let status = "Active";
            let subtext = user.role;

            if (user.role === "Member" && user.members?.[0]) {
              status = user.members[0].status || "Active";
              subtext = `Member • ${status}`;
            } else if (user.role === "Staff" && user.staff?.[0]) {
              status = "Active";
              subtext = `Staff • ${user.staff[0].subrole}`;
            }

            return {
              id: user.id,
              full_name: user.full_name,
              short_id: user.short_id,
              role: user.role,
              status: status,
              subtext: subtext,
            };
          },
        );

        setResults(formattedResults);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCheckIn = async (user: SearchResult) => {
    setCheckingIn(user.id);
    try {
      await manualCheckIn(user.id, user.status);
      showToast(`Successfully checked in ${user.full_name}`, "success");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || "Failed to check in", "error");
    } finally {
      setCheckingIn(null);
    }
  };

  // Reset state on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setResults([]);
    }
  }, [isOpen]);

  const inputBase =
    "w-full px-4 py-3 pl-11 rounded-xl border border-stroke dark:border-white/10 bg-gray-100/50 dark:bg-transparent text-foreground text-sm font-lexend placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manual Check-in"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        <div className="relative">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
          <input
            autoFocus
            type="text"
            placeholder="Search member name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={inputBase}
          />
        </div>

        <div className="space-y-2 min-h-[200px]">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-xl border border-stroke dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/2 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar name={user.full_name} />
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground text-sm font-lexend">
                      {user.full_name}
                    </span>
                    <span className="text-[10px] text-secondary font-lexend uppercase tracking-wider">
                      ID: {user.short_id} • {user.subtext}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCheckIn(user)}
                  disabled={checkingIn === user.id}
                  className="px-4 py-1.5 bg-primary text-white text-xs font-bold font-lexend rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
                >
                  {checkingIn === user.id ? "..." : "Check-in"}
                </button>
              </div>
            ))
          ) : searchQuery.trim() ? (
            <div className="text-center py-10">
              <span className="text-sm text-secondary font-lexend">
                No users found for "{searchQuery}"
              </span>
            </div>
          ) : (
            <div className="text-center py-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-secondary">
                <SearchIcon className="w-6 h-6" />
              </div>
              <span className="text-sm text-secondary font-lexend">
                Search for a member to check in
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
