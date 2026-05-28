import type { CertificateDto } from "@/backend/certificates/service";

import { apiFetch } from "./http";

export type { CertificateDto };

export function listCertificates() {
  return apiFetch<CertificateDto[]>("/certificados");
}

export function createCertificate(formData: FormData) {
  return apiFetch<CertificateDto>("/certificados", {
    method: "POST",
    body: formData,
  });
}

export function getCertificate(id: string) {
  return apiFetch<CertificateDto>(`/certificados/${id}`);
}

export function deleteCertificate(id: string) {
  return apiFetch<{ success: boolean }>(`/certificados/${id}`, {
    method: "DELETE",
  });
}

