"use client";
import { QRCodeSVG } from "qrcode.react";
import {
  ChevronDownIcon,
  FingerprintIcon,
  LockIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  CalendarIcon,
  BadgeIcon,
  CoachIcon,
  StatusIcon,
  LogoutIcon,
  DashboardIcon,
} from "@/components/ui/Icons";
import { StatusTag } from "@/components/ui/StatusTag";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Portal() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select(
            `
            full_name, 
            nickname, 
            qr_token, 
            short_id,
            members (
              valid_until,
              status,
              coach:staff (
                profile:users (
                  full_name
                )
              )
            )
          `,
          )
          .eq("auth_user_id", user.id)
          .single();

        if (!userError && userData) {
          // Handle member details extraction
          const memberInfo = Array.isArray(userData.members)
            ? userData.members[0]
            : userData.members;

          const coachData = Array.isArray(memberInfo?.coach)
            ? memberInfo.coach[0]
            : memberInfo?.coach;
          const coachProfile = Array.isArray(coachData?.profile)
            ? coachData.profile[0]
            : coachData?.profile;
          const coachName = coachProfile?.full_name || "No Coach Assigned";

          setProfile({
            full_name: userData.full_name,
            nickname: userData.nickname,
            member_id: userData.short_id,
            qr_token: userData.qr_token,
            valid_until: memberInfo?.valid_until,
            status: memberInfo?.status || "Guest",
            coach_name: coachName,
          });
        }
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const supabase = await createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      setIsSigningOut(false);
    }
  };

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
      {/** Floating Navigation Menu */}
      <header className="fixed top-10 left-6 md:top-10 md:left-24 z-100">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-3 px-4 py-2 md:px-5 md:py-2.5 bg-[#111111]/60 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-surface hover:border-primary/50 transition-all group shadow-2xl"
          >
            <span className="text-[10px] md:text-xs font-lexend font-medium uppercase tracking-[0.2em] text-muted group-hover:text-white transition-colors hidden xs:block">
              Menu
            </span>
            <div className="w-px h-3 bg-white/10 group-hover:bg-primary/30 transition-colors hidden xs:block"></div>
            <ChevronDownIcon
              className={`w-4 h-4 text-muted group-hover:text-white transition-transform duration-300 ${showUserMenu ? "rotate-180" : ""}`}
            />
          </button>

          {/**Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="absolute left-0 mt-3 w-52 bg-[#111111] border border-stroke rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-3 py-2 mb-1 border-b border-stroke/30">
                  <p className="text-[10px] text-muted uppercase tracking-widest font-medium">
                    Signed in as
                  </p>
                  <p className="text-sm font-lexend font-semibold text-white truncate">
                    {profile?.full_name || "Member"}
                  </p>
                </div>

                {/* Home Link */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    router.push("/");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 text-muted hover:text-white transition-all group"
                >
                  <DashboardIcon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs font-lexend font-medium uppercase tracking-wider">
                    Home
                  </span>
                </button>

                {/* Sign Out Action */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleSignOut();
                  }}
                  disabled={isSigningOut}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-primary/10 text-muted hover:text-primary transition-all group"
                >
                  <LogoutIcon
                    className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isSigningOut ? "animate-pulse" : ""}`}
                  />
                  <span className="text-xs font-lexend font-medium uppercase tracking-wider">
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <main className="flex flex-col items-center justify-center gap-8 pt-20 md:pt-24 mb-12">
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
          <p className="p-xs-sb text-muted mt-6 uppercase tracking-[0.2em] text-center">
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
                {/*hide password first then show once onclick*/}
                {showPassword ? (
                  <span className="text-sm tracking-widest leading-none">
                    {"Member" + profile?.member_id}
                  </span>
                ) : (
                  <span className="text-sm tracking-widest leading-none">
                    ••••••••
                  </span>
                )}
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeClosedIcon className="w-4 h-4 opacity-30" />
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
              <span className="p-sm-sb text-white font-bold">
                {validUntilDate}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between py-2 border-y border-stroke/30">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#1B1B1B] rounded-lg flex items-center justify-center text-muted border border-stroke/50">
                  <StatusIcon className="w-5 h-5 opacity-40" />
                </div>
                <span className="p-sm-md text-muted font-lexend">Status</span>
              </div>
              <StatusTag type={(profile?.status as any) || "Active"} />
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
                  {/*fetch coach name from coach_id*/}
                  {profile?.coach_name}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
