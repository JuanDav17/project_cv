import { updateCurrentPassword } from "@/backend/auth/service";
import { handleRoute } from "@/backend/http/responses";
import { checkRateLimit } from "@/backend/http/rate-limit";

export async function PUT(request: Request) {
  return handleRoute(async () => {
    checkRateLimit(request, "auth");
    const body = await request.json();
    return updateCurrentPassword({
      currentPassword: body.currentPassword,
      newPassword: body.newPassword ?? body.password,
    });
  });
}
