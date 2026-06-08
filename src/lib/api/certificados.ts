import type { CertificateDto } from "@/backend/certificates/service";

import { apiFetch } from "./http";

export type { CertificateDto };

export type CertificateUpdatePayload = {
  titulo_certificado: string;
  entidad: string;
  descripcion?: string;
  tema?: string;
  tipo_certificado?: string;
  duracion_horas: number;
  fecha_emision?: string;
  visibilidad: "publico" | "privado";
  color?: string;
};

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

export function updateCertificate(id: string, payload: CertificateUpdatePayload) {
  return apiFetch<CertificateDto>(`/certificados/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCertificate(id: string) {
  return apiFetch<{ success: boolean }>(`/certificados/${id}`, {
    method: "DELETE",
  });
}

