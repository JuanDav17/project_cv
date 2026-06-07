import { registerWithPassword } from "@/backend/auth/service";
import { handleRoute } from "@/backend/http/responses";

import { checkRateLimit } from "@/backend/http/rate-limit";

export async function POST(request: Request) {
  return handleRoute(async () => {
    checkRateLimit(request, "auth");
    const body = await request.json();

    const result = await registerWithPassword({
      fullName: body.fullName,
      email: body.email,
      password: body.password,
    });

    return result;
  });
}
