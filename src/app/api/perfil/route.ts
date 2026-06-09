import { handleRoute } from "@/backend/http/responses";
import { checkRateLimit } from "@/backend/http/rate-limit";
import {
  getCurrentProfile,
  updateCurrentProfile,
} from "@/backend/profile/service";

export async function GET(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "api");
    return getCurrentProfile();
  });
}

export async function PUT(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "api");
    const body = await request.json();
    return updateCurrentProfile(body);
  });
}

