import { updateCurrentPassword } from "@/backend/auth/service";
import { handleRoute } from "@/backend/http/responses";

export async function PUT(request: Request) {
  return handleRoute(async () => {
    const body = await request.json();
    return updateCurrentPassword(body.password);
  });
}
