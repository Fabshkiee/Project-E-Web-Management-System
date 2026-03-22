"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  //State: Track user types
  const router = useRouter();
  const supabase = createClient();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //Login Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    let user_id = null;

    //fake email for supabaseuath (0001@projecte.local)
    const formattedId = loginId.trim().toLowerCase();
    const fakeEmail = `${formattedId}@projecte.local`;

    //call supabase
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message || "Invalid Login Credentials");
      setLoading(false);
      return;
    }

    user_id = data.user.id;

    //check if staff
    const { data: StaffData } = await supabase
      .from("staff")
      .select("role")
      .eq("user_id", user_id)
      .maybeSingle();

    if (StaffData) {
      router.push("/dashboard/");
      router.refresh();
      return;
    }

    //check if member
    const { data: memberData } = await supabase
      .from("members")
      .select("valid_until")
      .eq("user_id", user_id)
      .maybeSingle();

    if (memberData) {
      const isExpired = new Date(memberData.valid_until) < new Date();

      if (!isExpired) {
        router.push("/portal/");
        router.refresh();
        return;
      } else {
        await supabase.auth.signOut();
        setError(
          "Access Denied: Your membership has expired. Please visit the front desk.",
        );
        setLoading(false);
        return;
      }
    }

    await supabase.auth.signOut();
    setError("User profile not found. Please contact staff.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <section className="w-full max-w-md bg-surface border border-stroke rounded-2xl p-8 shadow-xl">
        <h1 className="h2-b text-center mb-6 uppercase">Sign In</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="p-xs-sb text-muted uppercase tracking-widest pl-1">
              Member ID
            </label>
            <input
              required
              className="w-full bg-background border border-stroke rounded-lg p-3 text-white focus:border-primary outline-none transition-all"
              placeholder="0001"
              onChange={(e) => setLoginId(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <label className="p-xs-sb text-muted uppercase tracking-widest pl-1">
              Password
            </label>
            <input
              required
              type={showPassword ? "text" : "password"}
              className="w-full bg-background border border-stroke rounded-lg p-3 text-white focus:border-primary outline-none transition-all pr-12"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-10 text-muted hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && (
            <p className="text-primary text-sm text-center font-medium bg-primary/10 py-2 rounded-lg border border-primary/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-teko text-2xl py-3 rounded-xl disabled:opacity-50 hover:brightness-110 transition-all uppercase tracking-widest mt-2"
          >
            {loading ? "Verifying..." : "Enter Portal"}
          </button>
        </form>
      </section>
    </main>
  );
}
