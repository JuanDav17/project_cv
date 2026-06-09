import { handleRoute } from "@/backend/http/responses";
import { getPublicProfileBySlug } from "@/backend/public/service";
import { checkRateLimit } from "@/backend/http/rate-limit";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  return handleRoute(async () => {
    await checkRateLimit(request, "api");
    const { slug } = await context.params;
    return getPublicProfileBySlug(slug);
  });
}

