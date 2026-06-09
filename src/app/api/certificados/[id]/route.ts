import {
  deleteCurrentUserCertificate,
  getCurrentUserCertificate,
  updateCurrentUserCertificate,
} from "@/backend/certificates/service";
import { handleRoute } from "@/backend/http/responses";
import { checkRateLimit } from "@/backend/http/rate-limit";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  return handleRoute(async () => {
    await checkRateLimit(request, "api");
    const { id } = await context.params;
    return getCurrentUserCertificate(id);
  });
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleRoute(async () => {
    await checkRateLimit(request, "api");
    const { id } = await context.params;
    await deleteCurrentUserCertificate(id);
    return { success: true };
  });
}

export async function PUT(request: Request, context: RouteContext) {
  return handleRoute(async () => {
    await checkRateLimit(request, "api");
    const { id } = await context.params;
    const body = await request.json();
    return updateCurrentUserCertificate(id, body);
  });
}
