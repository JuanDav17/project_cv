import {
  createCurrentUserCertificate,
  listCurrentUserCertificates,
} from "@/backend/certificates/service";
import { handleRoute } from "@/backend/http/responses";
import { checkRateLimit } from "@/backend/http/rate-limit";

export async function GET(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "api");
    return listCurrentUserCertificates();
  });
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    await checkRateLimit(request, "api");
    const formData = await request.formData();
    return createCurrentUserCertificate(formData);
  });
}
