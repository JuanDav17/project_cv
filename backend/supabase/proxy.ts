import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { AUTH_VERIFIED_COOKIE } from "@/backend/auth/cookies";
import { getSupabasePublicEnv, hasSupabasePublicEnv } from "@/backend/config/env";

const PRIVATE_FRONTEND_PATHS = [
  "/frontend/pagina-principal",
  "/frontend/subir-certificado",
  "/frontend/mis-certificados",
  "/frontend/codigo-qr",
  "/frontend/mi-cuenta",
];

function isPrivateFrontendPath(pathname: string) {
  return PRIVATE_FRONTEND_PATHS.some((path) => pathname.startsWith(path));
}

export async function updateSession(request: NextRequest) {
  if (!hasSupabasePublicEnv()) {
    return NextResponse.next({ request });
  }

  const { url, publishableKey } = getSupabasePublicEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });

        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isPrivateFrontendPath(request.nextUrl.pathname)) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/frontend/iniciar-sesion";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (
    user &&
    isPrivateFrontendPath(request.nextUrl.pathname) &&
    request.cookies.get(AUTH_VERIFIED_COOKIE)?.value !== "true"
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/frontend/codigo";
    redirectUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
