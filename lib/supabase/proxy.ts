import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Quick check for session cookie to avoid unnecessary network calls
  const hasSession = request.cookies.getAll().some(c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token'));
  
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  const isPortal = request.nextUrl.pathname.startsWith("/portal");
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!hasSession && (isDashboard || isPortal)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // 2. Only call getUser if we likely have a session or need to verify it
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && (isDashboard || isPortal)) {
    // no user, redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    //Check if they are an Admin or Staff member
    const userRole = user.app_metadata?.role;
    const isStaff = userRole === "Admin" || userRole === "Staff";

    // Prevent Members from accessing the Staff Dashboard
    if (!isStaff && isDashboard) {
      const url = request.nextUrl.clone();
      url.pathname = "/portal";
      return NextResponse.redirect(url);
    }

    // Prevent Staff from accessing the Member Portal
    if (isStaff && isPortal) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    // Prevent logged-in users from seeing the Login page again
    if (isLoginPage) {
      const url = request.nextUrl.clone();
      url.pathname = isStaff ? "/dashboard" : "/portal";
      return NextResponse.redirect(url);
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid mutating
  //    the supabaseResponse object directly after its creation!

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Run only on paths that REQUIRE authentication or session handling.
     * Avoid matching the root ('/') if the landing page is public.
     */
    "/dashboard/:path*",
    "/portal/:path*",
    "/login",
  ],
};
