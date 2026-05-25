import type { NextResponse } from "next/server";

export const AUTH_VERIFIED_COOKIE = "mycertify-auth-verified";

const authCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function setAuthVerifiedCookie(response: NextResponse) {
  response.cookies.set(AUTH_VERIFIED_COOKIE, "true", {
    ...authCookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export function clearAuthVerifiedCookie(response: NextResponse) {
  response.cookies.set(AUTH_VERIFIED_COOKIE, "", {
    ...authCookieOptions,
    maxAge: 0,
  });

  return response;
}
