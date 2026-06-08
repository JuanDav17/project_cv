import { setAuthVerifiedCookie } from "@/backend/auth/cookies";
import { verifyLoginCode } from "@/backend/auth/service";
import { handleRoute, ok } from "@/backend/http/responses";

import { checkRateLimit } from "@/backend/http/rate-limit";

export async function POST(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "auth");
    const body = await request.json();

    const result = await verifyLoginCode({
      code: body.code,
      token: body.token,
    });

    return setAuthVerifiedCookie(ok(result));
  });
}
