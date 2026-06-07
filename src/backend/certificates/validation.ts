import { BackendError } from "@/backend/http/errors";

export const MAX_CERTIFICATE_FILE_BYTES = 1024 * 1024;
export const CERTIFICATE_PDF_MIME = "application/pdf";

export type CertificateVisibility = "publico" | "privado";
export type CertificateModality =
  | "online"
  | "presencial"
  | "hibrido"
  | "autoestudio";

export function getHoursRange(hours: number) {
  if (hours >= 90) return "+90";
  if (hours >= 40) return "40-90";
  return "3-39";
}

export function parsePositiveInteger(value: FormDataEntryValue | null, field: string) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new BackendError(`${field} debe ser un numero entero positivo.`, 400, "INVALID_NUMBER");
  }

  return parsed;
}

export function parseVisibility(value: FormDataEntryValue | null): CertificateVisibility {
  return value === "privado" ? "privado" : "publico";
}

export function parseModality(value: FormDataEntryValue | null): CertificateModality {
  const modality = typeof value === "string" ? value : "online";
  const validModalities: CertificateModality[] = [
    "online",
    "presencial",
    "hibrido",
    "autoestudio",
  ];

  return validModalities.includes(modality as CertificateModality)
    ? (modality as CertificateModality)
    : "online";
}

export async function validatePdfFile(file: File | null) {
  if (!file) {
    throw new BackendError("Debes adjuntar el PDF del certificado.", 400, "FILE_REQUIRED");
  }

  if (file.type !== CERTIFICATE_PDF_MIME || !file.name.toLowerCase().endsWith(".pdf")) {
    throw new BackendError("El archivo debe ser un PDF y tener extension .pdf.", 400, "INVALID_FILE_TYPE");
  }

  if (file.size <= 0 || file.size > MAX_CERTIFICATE_FILE_BYTES) {
    throw new BackendError(
      "El PDF debe pesar mas de 0 bytes y maximo 1 MB.",
      400,
      "INVALID_FILE_SIZE",
    );
  }

  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer.slice(0, 4));
  
  if (bytes.length < 4 || bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) {
    throw new BackendError("El archivo no es un PDF valido.", 400, "INVALID_FILE_CONTENT");
  }

  return { file, buffer };
}

export function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

