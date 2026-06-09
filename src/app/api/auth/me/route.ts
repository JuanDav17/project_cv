import { getCurrentSessionProfile } from "@/backend/auth/service";
import { handleRoute } from "@/backend/http/responses";
import { checkRateLimit } from "@/backend/http/rate-limit";

export async function GET(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "auth");
    return getCurrentSessionProfile();
  });
}

