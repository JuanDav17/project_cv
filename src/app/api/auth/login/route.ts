import { clearAuthVerifiedCookie } from "@/backend/auth/cookies";
import { loginWithPassword } from "@/backend/auth/service";
import { handleRoute, ok } from "@/backend/http/responses";

import { checkRateLimit } from "@/backend/http/rate-limit";

export async function POST(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "auth");
    const body = await request.json();

    const result = await loginWithPassword({
      email: body.email,
      password: body.password,
    });

    return clearAuthVerifiedCookie(ok(result));
  });
}
