import { handleRoute } from "@/backend/http/responses";
import { getPublicProfileBySlug } from "@/backend/public/service";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  return handleRoute(async () => {
    const { slug } = await context.params;
    return getPublicProfileBySlug(slug);
  });
}

