import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";



export async function proxy(request) {

  // 🟦 2. Create Supabase client with synced cookies
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );

          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // // 🟦 3. Get user session
  //   const { data } = await supabase.auth.getClaims()
  // const user = data?.claims
  // const username = user?.user_metadata?.username;


  // // 🟦 4. Define protected and auth pages
  // const protectedPaths = ["/Profile", "/orders", "/messages"];
  // const authPaths = ["/LogIn", "/SignUp" , "/callback"];

  // const currentPath = request.nextUrl.pathname;

  // // 🟦 5. Redirect unauthenticated users from protected pages
  // const isProtected = protectedPaths.some((path) =>
  //   currentPath.includes(path)
  // );

  // if (!user && isProtected) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/LogIn";
  //   return NextResponse.redirect(url);
  // }

  // if(user && !username){
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/profileInfo";
  //   return NextResponse.redirect(url);
  // }

  // // 🟦 6. Redirect authenticated users away from auth pages
  // const isAuthPage = authPaths.some((path) =>
  //   currentPath.toLowerCase().includes(path.toLowerCase())
  // );

  // if (user && isAuthPage) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/Profile";
  //   return NextResponse.redirect(url);
  // }

  // 🟦 7. Return final response
  return response;
}

// 🟩 8. Apply middleware to all routes except static files and assets
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
