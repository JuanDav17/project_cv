import { clearAuthVerifiedCookie } from "@/backend/auth/cookies";
import { logout } from "@/backend/auth/service";
import { empty, handleRoute } from "@/backend/http/responses";
import { checkRateLimit } from "@/backend/http/rate-limit";

export async function POST(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "auth");
    await logout();
    return clearAuthVerifiedCookie(empty());
  });
}
