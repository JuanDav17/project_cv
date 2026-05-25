import { confirmPasswordReset } from "@/backend/auth/service";
import { handleRoute } from "@/backend/http/responses";

import { checkRateLimit } from "@/backend/http/rate-limit";

export async function POST(request: Request) {
  return handleRoute(async () => {
    checkRateLimit(request);
    const body = await request.json();

    return confirmPasswordReset({
      resetToken: body.resetToken,
      password: body.password,
    });
  });
}
