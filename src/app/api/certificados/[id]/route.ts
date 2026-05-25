import { getCurrentUserCertificate } from "@/backend/certificates/service";
import { handleRoute } from "@/backend/http/responses";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  return handleRoute(async () => {
    const { id } = await context.params;
    return getCurrentUserCertificate(id);
  });
}

