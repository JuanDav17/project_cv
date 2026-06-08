import { requestPasswordReset } from "@/backend/auth/service";
import { handleRoute } from "@/backend/http/responses";

import { checkRateLimit } from "@/backend/http/rate-limit";

export async function POST(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "auth");
    const body = await request.json();
    return requestPasswordReset(body.email);
  });
}

