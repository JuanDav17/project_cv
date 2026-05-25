import { CERTIFICADOS_BUCKET } from "@/backend/config/env";
import { getAuthenticatedUser } from "@/backend/auth/service";
import { BackendError, assertRequired } from "@/backend/http/errors";
import { createAdminSupabaseClient } from "@/backend/supabase/admin";
import { sha256Hex } from "@/backend/utils/hash";

import {
  getHoursRange,
  parseModality,
  parsePositiveInteger,
  parseVisibility,
  sanitizeFileName,
  validatePdfFile,
} from "./validation";

export type CertificateDto = {
  id_certificado: string;
  titulo_certificado: string;
  descripcion: string | null;
  entidad: string;
  duracion_horas: number;
  fecha_emision: string | null;
  fecha_display: string;
  visibilidad: "publico" | "privado";
  verificado_plataforma: boolean;
  destacado: boolean;
  archivo?: {
    id_archivo: string;
    nombre_archivo: string;
    ruta_archivo: string;
    tamano_bytes: number;
    url_firmada?: string;
  } | null;
};

type InstitutionRecord = {
  nombre_institucion: string | null;
};

type FileRecord = {
  id_archivo: string;
  nombre_archivo: string;
  ruta_archivo: string;
  tamano_bytes: number;
  es_actual: boolean;
};

type CertificateRecord = {
  id_certificado: string;
  titulo_certificado: string;
  descripcion: string | null;
  duracion_horas: number;
  fecha_emision: string | null;
  visibilidad: "publico" | "privado";
  verificado_plataforma: boolean;
  destacado: boolean;
  fecha_creacion: string;
  instituciones: InstitutionRecord | InstitutionRecord[] | null;
  archivos_certificado?: FileRecord[] | null;
};

function getInstitutionName(record: CertificateRecord) {
  const institution = Array.isArray(record.instituciones)
    ? record.instituciones[0]
    : record.instituciones;

  return institution?.nombre_institucion ?? "Institucion no registrada";
}

function toDisplayDate(value: string | null, fallback: string) {
  const date = new Date(value ?? fallback);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function currentFile(record: CertificateRecord) {
  return record.archivos_certificado?.find((file) => file.es_actual) ?? null;
}

function mapCertificate(record: CertificateRecord): CertificateDto {
  const file = currentFile(record);

  return {
    id_certificado: record.id_certificado,
    titulo_certificado: record.titulo_certificado,
    descripcion: record.descripcion,
    entidad: getInstitutionName(record),
    duracion_horas: record.duracion_horas,
    fecha_emision: record.fecha_emision,
    fecha_display: toDisplayDate(record.fecha_emision, record.fecha_creacion),
    visibilidad: record.visibilidad,
    verificado_plataforma: record.verificado_plataforma,
    destacado: record.destacado,
    archivo: file
      ? {
          id_archivo: file.id_archivo,
          nombre_archivo: file.nombre_archivo,
          ruta_archivo: file.ruta_archivo,
          tamano_bytes: file.tamano_bytes,
        }
      : null,
  };
}

async function getOrCreateInstitutionId(name: string) {
  const admin = createAdminSupabaseClient();
  const { data: existing, error: lookupError } = await admin
    .from("instituciones")
    .select("id_institucion")
    .eq("nombre_institucion", name)
    .maybeSingle();

  if (lookupError) {
    throw new BackendError(
      "No se pudo consultar la institucion.",
      500,
      "INSTITUTION_LOOKUP_FAILED",
      lookupError.message,
    );
  }

  if (existing) {
    return existing.id_institucion as string;
  }

  const { data, error } = await admin
    .from("instituciones")
    .insert({
      nombre_institucion: name,
      tipo_institucion: "otro",
    })
    .select("id_institucion")
    .single();

  if (error || !data) {
    throw new BackendError(
      "No se pudo crear la institucion.",
      500,
      "INSTITUTION_CREATE_FAILED",
      error?.message,
    );
  }

  return data.id_institucion as string;
}

async function createSignedUrl(path: string) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.storage
    .from(CERTIFICADOS_BUCKET)
    .createSignedUrl(path, 60 * 10);

  if (error) {
    return undefined;
  }

  return data.signedUrl;
}

export async function listCurrentUserCertificates() {
  const { user } = await getAuthenticatedUser();
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("certificados")
    .select(
      [
        "id_certificado",
        "titulo_certificado",
        "descripcion",
        "duracion_horas",
        "fecha_emision",
        "visibilidad",
        "verificado_plataforma",
        "destacado",
        "fecha_creacion",
        "instituciones(nombre_institucion)",
        "archivos_certificado(id_archivo,nombre_archivo,ruta_archivo,tamano_bytes,es_actual)",
      ].join(","),
    )
    .eq("id_usuario", user.id)
    .order("fecha_creacion", { ascending: false });

  if (error) {
    throw new BackendError(
      "No se pudieron cargar los certificados.",
      500,
      "CERTIFICATE_LIST_FAILED",
      error.message,
    );
  }

  return ((data ?? []) as unknown as CertificateRecord[]).map(mapCertificate);
}

export async function getCurrentUserCertificate(id: string) {
  const { user } = await getAuthenticatedUser();
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("certificados")
    .select(
      [
        "id_certificado",
        "titulo_certificado",
        "descripcion",
        "duracion_horas",
        "fecha_emision",
        "visibilidad",
        "verificado_plataforma",
        "destacado",
        "fecha_creacion",
        "instituciones(nombre_institucion)",
        "archivos_certificado(id_archivo,nombre_archivo,ruta_archivo,tamano_bytes,es_actual)",
      ].join(","),
    )
    .eq("id_usuario", user.id)
    .eq("id_certificado", id)
    .single();

  if (error || !data) {
    throw new BackendError(
      "Certificado no encontrado.",
      404,
      "CERTIFICATE_NOT_FOUND",
      error?.message,
    );
  }

  const certificate = mapCertificate(data as unknown as CertificateRecord);

  if (certificate.archivo) {
    certificate.archivo.url_firmada = await createSignedUrl(
      certificate.archivo.ruta_archivo,
    );
  }

  return certificate;
}

export async function createCurrentUserCertificate(formData: FormData) {
  const { user } = await getAuthenticatedUser();
  const admin = createAdminSupabaseClient();
  const institutionName = assertRequired(
    formData.get("entidad") ?? formData.get("institucion"),
    "La institucion es obligatoria.",
    "INSTITUTION_REQUIRED",
  );
  const hours = parsePositiveInteger(
    formData.get("horas") ?? formData.get("duracion_horas"),
    "La cantidad de horas",
  );
  const title =
    typeof formData.get("titulo_certificado") === "string" &&
    String(formData.get("titulo_certificado")).trim()
      ? String(formData.get("titulo_certificado")).trim()
      : institutionName;
  const description =
    typeof formData.get("descripcion") === "string"
      ? String(formData.get("descripcion")).trim()
      : null;
  const fileEntry = formData.get("archivo");
  const file = validatePdfFile(fileEntry instanceof File ? fileEntry : null);
  const fileBuffer = await file.arrayBuffer();
  const institutionId = await getOrCreateInstitutionId(institutionName);

  const { data: certificate, error: certificateError } = await admin
    .from("certificados")
    .insert({
      id_usuario: user.id,
      id_institucion: institutionId,
      titulo_certificado: title,
      descripcion: description,
      codigo_credencial:
        typeof formData.get("codigo_credencial") === "string"
          ? String(formData.get("codigo_credencial")).trim() || null
          : null,
      url_credencial:
        typeof formData.get("url_credencial") === "string"
          ? String(formData.get("url_credencial")).trim() || null
          : null,
      duracion_horas: hours,
      rango_horas: getHoursRange(hours),
      modalidad: parseModality(formData.get("modalidad")),
      fecha_emision:
        typeof formData.get("fecha_emision") === "string" &&
        String(formData.get("fecha_emision")).trim()
          ? String(formData.get("fecha_emision")).trim()
          : null,
      visibilidad: parseVisibility(formData.get("visibilidad")),
    })
    .select("id_certificado")
    .single();

  if (certificateError || !certificate) {
    throw new BackendError(
      "No se pudo registrar el certificado.",
      500,
      "CERTIFICATE_CREATE_FAILED",
      certificateError?.message,
    );
  }

  const safeFileName = sanitizeFileName(file.name) || "certificado.pdf";
  const storagePath = `${user.id}/${certificate.id_certificado}/${Date.now()}-${safeFileName}`;
  const { error: uploadError } = await admin.storage
    .from(CERTIFICADOS_BUCKET)
    .upload(storagePath, file, {
      contentType: "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    await admin
      .from("certificados")
      .delete()
      .eq("id_certificado", certificate.id_certificado);

    throw new BackendError(
      "No se pudo subir el PDF a Supabase Storage.",
      500,
      "CERTIFICATE_FILE_UPLOAD_FAILED",
      uploadError.message,
    );
  }

  const { error: fileError } = await admin.from("archivos_certificado").insert({
    id_certificado: certificate.id_certificado,
    nombre_archivo: file.name,
    ruta_archivo: storagePath,
    tipo_mime: "application/pdf",
    tamano_bytes: file.size,
    hash_archivo: sha256Hex(fileBuffer),
    es_actual: true,
  });

  if (fileError) {
    throw new BackendError(
      "No se pudo guardar la referencia del PDF.",
      500,
      "CERTIFICATE_FILE_CREATE_FAILED",
      fileError.message,
    );
  }

  return getCurrentUserCertificate(certificate.id_certificado as string);
}
