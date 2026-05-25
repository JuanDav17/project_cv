import { clearAuthVerifiedCookie } from "@/backend/auth/cookies";
import { logout } from "@/backend/auth/service";
import { empty, handleRoute } from "@/backend/http/responses";

export async function POST() {
  return handleRoute(async () => {
    await logout();
    return clearAuthVerifiedCookie(empty());
  });
}
