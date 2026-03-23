"use client";
import { QRCodeSVG } from "qrcode.react";
import {
  BackIcon,
  FingerprintIcon,
  LockIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  CalendarIcon,
  BadgeIcon,
  CoachIcon,
  StatusIcon,
} from "@/components/ui/Icons";
import { StatusTag } from "@/components/ui/StatusTag";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export default function Portal() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      try {
        const supabase = await createClient();
        // get auth user
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/login");
          return;
        }

        // fetch member profile
        const { data: profileData, error: profileError } = await supabase
          .from("members")
          .select(
            "full_name, member_id, nickname, valid_until, status, coach_id, qr_token",
          )
          .eq("user_id", user.id)
          .single();

        if (!profileError) {
          setProfile(profileData);
        }
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  // Format the date if it exists
  const validUntilDate = profile?.valid_until
    ? new Date(profile.valid_until).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  if (loading) return <div className="min-h-screen bg-black">Loading</div>;

  return (
    <div
      className="min-h-screen relative p-10 overflow-hidden"
      style={{
        backgroundImage: "url(/assets/portal_bg.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/**Back Button */}
      <div
        onClick={() => router.push("/")}
        className="absolute top-8 left-8 hover:cursor-pointer hover:opacity-80 items-center rounded-full gap-2 w-fit bg-surface px-6 py-3 flex flex-row shadow-lg z-50"
      >
        <BackIcon />
        <button className="hover:cursor-pointer p-sm-md text-[#a1a1a1] uppercase tracking-wider">
          Exit
        </button>
      </div>

      <main className="flex flex-col items-center justify-center gap-8 mt-15">
        {/**Greet User Section */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="h3-b-lexend text-white mb-2">
            Welcome,{" "}
            {profile?.nickname || profile?.full_name?.split(" ")[0] || "Member"}
            {/*Nickname then first name then member*/}
          </h1>
          <p className="p-sm-md text-muted">Ready to train today?</p>
        </div>

        {/**QR Code Section */}
        <section className="flex justify-center flex-col items-center">
          <div className="bg-surface rounded-2xl p-8 relative">
            <div className="rounded-tl-lg absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
            <div className="rounded-tr-lg absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-primary"></div>
            <div className="rounded-bl-lg absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-primary"></div>
            <div className="rounded-br-lg absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-primary"></div>
            <QRCodeSVG
              value={
                "PROJE:MEM:" + profile?.member_id + ":" + profile?.qr_token
              }
              size={200}
              level={"M"}
              marginSize={1}
              className="rounded-xl"
            />
          </div>
          <p className="p-xs-sb text-muted mt-6 uppercase tracking-[0.2em]">
            Show this QR code at the gym entrance
          </p>
        </section>

        {/**Membership Details Section */}
        <section className="w-full max-w-md bg-[#111111] border border-stroke rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8 border-b border-stroke pb-4">
            <BadgeIcon className="text-primary w-6 h-6" />
            <h2 className="p-md-md uppercase tracking-widest text-white">
              Membership Details
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {/* Member ID */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1B1B1B] rounded-lg flex items-center justify-center text-muted border border-stroke/50">
                  <FingerprintIcon className="w-5 h-5" />
                </div>
                <span className="p-sm-md text-muted font-lexend">
                  Member ID
                </span>
              </div>
              <div className="bg-background px-4 py-2 rounded-lg border border-stroke">
                <span className="font-lexend text-sm text-white font-bold tracking-wider">
                  {profile?.member_id}
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1B1B1B] rounded-lg flex items-center justify-center text-muted border border-stroke/50">
                  <LockIcon className="w-4 h-4 text-[#A1A1AA]" />
                </div>
                <span className="p-sm-md text-muted font-lexend">Password</span>
              </div>
              <div className="bg-background pl-4 pr-3 py-2 rounded-lg border border-stroke flex items-center gap-2 text-white">
                <span className="text-sm tracking-widest leading-none">
                  {"Member" + profile?.member_id}
                </span>
                <button className="text-muted hover:text-white transition-colors">
                  {showPassword ? (
                    <EyeClosedIcon className="w-4 h-4" />
                  ) : (
                    <EyeOpenIcon className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Valid Until */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1B1B1B] rounded-lg flex items-center justify-center text-muted border border-stroke/50">
                  <CalendarIcon className="w-5 h-5 opacity-40" />
                </div>
                <span className="p-sm-md text-muted font-lexend">
                  Valid Until
                </span>
              </div>
              <span className="p-sm-sb text-white font-bold">12 Dec, 2024</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-2 border-y border-stroke/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1B1B1B] rounded-lg flex items-center justify-center text-muted border border-stroke/50">
                  <StatusIcon className="w-5 h-5 opacity-40" />
                </div>
                <span className="p-sm-md text-muted font-lexend">Status</span>
              </div>
              <StatusTag status="Expired" />
            </div>

            {/* Coach */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1B1B1B] rounded-lg flex items-center justify-center text-muted border border-stroke/50">
                  <CoachIcon className="w-5 h-5" />
                </div>
                <span className="p-sm-md text-muted font-lexend">Coach</span>
              </div>
              <div className="px-5 py-2 rounded-full border border-stroke bg-[#1B1B1B]">
                <span className="text-sm font-semibold text-white">
                  Coach Eric
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
