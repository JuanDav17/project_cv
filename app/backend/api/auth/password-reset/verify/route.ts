import { verifyPasswordResetCredential } from "@/backend/auth/service";
import { handleRoute } from "@/backend/http/responses";

export async function POST(request: Request) {
  return handleRoute(async () => {
    const body = await request.json();

    return verifyPasswordResetCredential({
      email: body.email,
      code: body.code,
      token: body.token,
    });
  });
}

