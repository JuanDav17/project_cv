import { handleRoute } from "@/backend/http/responses";
import {
  getCurrentProfile,
  updateCurrentProfile,
} from "@/backend/profile/service";

export async function GET() {
  return handleRoute(async () => getCurrentProfile());
}

export async function PUT(request: Request) {
  return handleRoute(async () => {
    const body = await request.json();
    return updateCurrentProfile(body);
  });
}

