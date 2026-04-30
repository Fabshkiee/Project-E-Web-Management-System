import Sidebar from "@/components/dashboard/sidebar";
import Header from "@/components/dashboard/header";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userProfile = { name: "Guest", role: "Member" };

  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("full_name, role")
      .eq("auth_user_id", user.id)
      .single();

    if (profile) {
      userProfile = {
        name: profile.full_name || "Admin User",
        role: profile.role || "Staff Member",
      };
    } else {
      // Fallback to metadata if profile record is missing
      userProfile = {
        name:
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Admin User",
        role: user.app_metadata?.role || "Staff Member",
      };
    }
  }
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header userProfile={userProfile} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
