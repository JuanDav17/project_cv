import { getCurrentSessionProfile } from "@/backend/auth/service";
import { handleRoute } from "@/backend/http/responses";

export async function GET() {
  return handleRoute(async () => getCurrentSessionProfile());
}

