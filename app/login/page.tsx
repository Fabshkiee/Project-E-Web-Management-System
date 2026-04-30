"use client";

import {
  IdCardIcon,
  LockIcon,
  EyeOpenIcon,
  EyeClosedIcon,
} from "@/components/ui/Icons";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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

    // call supabase auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: fakeEmail,
      password,
    });

    if (authError || !data.user) {
      setError(authError?.message || "Invalid Login Credentials");
      setLoading(false);
      return;
    }

    const authId = data.user.id;

    // 1. Fetch user role and public ID
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, role")
      .eq("auth_user_id", authId)
      .single();

    if (userError || !userData) {
      await supabase.auth.signOut();
      setError("User profile not found. Please contact staff.");
      setLoading(false);
      return;
    }

    // 2. Route based on role
    if (userData.role === "Admin" || userData.role === "Staff") {
      router.push("/dashboard/");
      router.refresh();
      return;
    }

    if (userData.role === "Member") {
      // Check membership status/expiry
      const { data: memberData } = await supabase
        .from("members")
        .select("valid_until, status")
        .eq("id", userData.id)
        .single();

      if (memberData) {
        const isExpired =
          new Date(memberData.valid_until) < new Date() ||
          memberData.status === "Expired";

        if (!isExpired) {
          router.push("/portal/");
          router.refresh();
          return;
        } else {
          await supabase.auth.signOut();
          setError("Access Denied: Your membership is expired or unpaid.");
          setLoading(false);
          return;
        }
      }
    }

    await supabase.auth.signOut();
    setError("Unauthorized access.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/*Background Logo*/}
      <section className="absolute right-0 bottom-0 pointer-events-none translate-x-1/4 translate-y-1/4 select-none">
        <Image
          src="/assets/proje_logo.svg"
          alt="Logo"
          width={600}
          height={600}
          className="opacity-10"
        />
        <div className="absolute inset-0 bg-primary opacity-8 blur-3xl z-0 rounded-full"></div>
      </section>

      {/* Back Button */}
      <button
        onClick={() => router.push("/")}
        className="hover:cursor-pointer flex flex-row items-center gap-2 absolute top-8 left-8 bg-primary text-white px-6 py-3 rounded-lg font-inter text-sm font-semibold hover:brightness-110 transition-all uppercase z-10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3.1875 7.5L7.85417 12.1667L6.66667 13.3333L0 6.66667L6.66667 0L7.85417 1.16667L3.1875 5.83333H13.3333V7.5H3.1875V7.5"
            fill="white"
          />
        </svg>
        Back to Home
      </button>

      {/* Login Form Card */}
      <section className="w-full max-w-md bg-surface border border-stroke gap-8 rounded-2xl p-10 shadow-xl z-10">
        {/*Logo*/}
        <div className="flex justify-center">
          <Image
            src="/assets/proje_logo.svg"
            alt="Logo"
            width={60}
            height={60}
          />
        </div>
        <h1 className="h4-b-lexend text-center mb-2">Project-E Portal</h1>
        <p className="font-inter text-sm text-center text-muted mb-8 opacity-50">
          Enter your credentials to access your account
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Error Message */}
          {error && (
            <p className="text-primary text-sm text-center font-medium bg-primary/10 py-2 rounded-lg border border-primary/20">
              {error}
            </p>
          )}

          {/* Member ID Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="userId"
              className="p-xs-sb text-muted opacity-50 uppercase tracking-widest pl-1"
            >
              Member ID
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                <IdCardIcon />
              </span>
              <input
                id="userId"
                name="userId"
                autoComplete="off"
                required
                className="w-full bg-background border border-stroke rounded-lg p-3 pl-10 text-muted text-sm focus:border-primary outline-none transition-all"
                placeholder="e.g. 1290"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2 mb-10">
            <label
              htmlFor="password"
              className="p-xs-sb opacity-50 text-muted uppercase tracking-widest pl-1"
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                <LockIcon className="opacity-30" />
              </span>
              <input
                id="password"
                name="password"
                autoComplete="off"
                required
                type={showPassword ? "text" : "password"}
                className="w-full bg-background border border-stroke rounded-lg p-3 pl-10 text-muted text-sm focus:border-primary outline-none transition-all"
                placeholder="• • • • • • • •"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="hover:cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeClosedIcon className="w-5 h-5 opacity-30" />
                ) : (
                  <EyeOpenIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-lexend text-sm py-4 rounded-xl disabled:opacity-50 hover:brightness-110 transition-all uppercase tracking-widest"
          >
            {loading ? "Verifying..." : "SIGN IN"}
          </button>
          <p className="text-center text-sm text-muted opacity-50 mt-4">
            Not a member yet? Visit the gym to register
          </p>
        </form>
      </section>
    </main>
  );
}
