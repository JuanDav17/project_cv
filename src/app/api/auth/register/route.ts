import { setAuthVerifiedCookie } from "@/backend/auth/cookies";
import { registerWithPassword } from "@/backend/auth/service";
import { handleRoute, ok } from "@/backend/http/responses";

import { checkRateLimit } from "@/backend/http/rate-limit";

export async function POST(request: Request) {
  return handleRoute(async () => {
    checkRateLimit(request);
    const body = await request.json();

    const result = await registerWithPassword({
      fullName: body.fullName,
      email: body.email,
      password: body.password,
    });

    const response = ok(result);
    return result.sessionReady ? setAuthVerifiedCookie(response) : response;
  });
}
