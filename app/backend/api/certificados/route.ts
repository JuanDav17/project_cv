import {
  createCurrentUserCertificate,
  listCurrentUserCertificates,
} from "@/backend/certificates/service";
import { handleRoute } from "@/backend/http/responses";

export async function GET() {
  return handleRoute(async () => listCurrentUserCertificates());
}

export async function POST(request: Request) {
  return handleRoute(async () => {
    const formData = await request.formData();
    return createCurrentUserCertificate(formData);
  });
}

