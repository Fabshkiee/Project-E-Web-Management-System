"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  DashboardIcon,
  MembersIcon,
  AttendanceIcon,
  StaffIcon,
  AnalyticsIcon,
  SettingsIcon,
  LogoutIcon,
} from "@/components/ui/Icons";

interface SidebarProps {
  userProfile: {
    name: string;
    role: string;
  };
}

export default function Sidebar({ userProfile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin = userProfile.role === "Admin";

  const mainMenuItems = [
    { label: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { label: "Members", href: "/dashboard/members", icon: MembersIcon },
    { label: "Attendance", href: "/dashboard/attendance", icon: AttendanceIcon },
    { label: "Staff", href: "/dashboard/staff", icon: StaffIcon },
    ...(isAdmin
      ? [
          { label: "Analytics", href: "/dashboard/analytics", icon: AnalyticsIcon },
        ]
      : []),
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    document.documentElement.classList.add("dark");
    router.push("/login");
  };

  return (
    <aside className="w-[260px] h-screen bg-surface border-r border-stroke flex flex-col flex-shrink-0 dark:bg-dark-bg">
      {/* Brand Section */}
      <div className="px-6 py-4 flex items-center gap-3 border-b border-stroke dark:bg-dark-bg">
        <div className="w-12 h-12 relative shrink-0">
          <Image
            src="/assets/proje_logo.svg"
            alt="Project-E Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="flex flex-col mt-1">
          <h1 className="font-teko font-bold text-[20px] leading-none tracking-wider text-foreground">
            PROJECT-E
          </h1>
          <span className="font-lexend font-bold text-[10px] tracking-[0.20em] text-primary uppercase mt-[2px]">
            Fitness Gym
          </span>
        </div>
      </div>

      {/* Main Navigation Section */}
      <nav className="flex-1 px-4 py-6 space-y-2 dark:bg-surface">
        {mainMenuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname === "/login" && item.href === "/dashboard");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-5 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary/10 text-primary" // Light rose background for active state
                  : "text-secondary hover:bg-muted/10 hover:text-foreground"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary rounded-l-lg" />
              )}
              <Icon
                className={`w-[18px] h-[18px] transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-secondary group-hover:text-foreground"
                }`}
              />
              <span
                className={`font-lexend font-medium text-[15px] ${isActive ? "text-primary" : "text-secondary group-hover:text-foreground"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section (Settings & Logout) */}
      <div className="px-4 pb-6 space-y-4 mt-auto border-t border-stroke pt-6 dark:bg-surface">
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-4 px-4 py-3.5 rounded-lg transition-all duration-200 group relative ${
            pathname === "/dashboard/settings"
              ? "bg-primary/10 text-primary"
              : "text-secondary hover:bg-muted/10 hover:text-foreground"
          }`}
        >
          {pathname === "/dashboard/settings" && (
            <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary rounded-l-lg" />
          )}
          <SettingsIcon
            className={`w-[18px] h-[18px] transition-colors ${
              pathname === "/dashboard/settings"
                ? "text-primary"
                : "text-secondary group-hover:text-foreground"
            }`}
          />
          <span
            className={`font-lexend font-medium text-[15px] ${pathname === "/dashboard/settings" ? "text-primary" : "text-secondary group-hover:text-foreground"}`}
          >
            Settings
          </span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-lg bg-[#1F2937] text-white transition-all hover:bg-[#111827] cursor-pointer"
        >
          <LogoutIcon className="w-[18px] h-[18px]" />
          <span className="font-lexend font-medium text-[15px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}
