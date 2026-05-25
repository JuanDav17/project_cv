import { clearAuthVerifiedCookie } from "@/backend/auth/cookies";
import { loginWithPassword } from "@/backend/auth/service";
import { handleRoute, ok } from "@/backend/http/responses";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const body = await request.json();

    const result = await loginWithPassword({
      email: body.email,
      password: body.password,
    });

    return clearAuthVerifiedCookie(ok(result));
  });
}
