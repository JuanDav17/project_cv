import { CERTIFICADOS_BUCKET } from "@/backend/config/env";
import { BackendError } from "@/backend/http/errors";
import { createAdminSupabaseClient } from "@/backend/supabase/admin";
import { publicNameFromProfile } from "@/backend/utils/slug";

type PublicProfileRecord = {
  id_usuario: string;
  nombres: string;
  apellidos: string;
  slug_publico: string;
  descripcion_perfil: string | null;
  titulo_profesional: string | null;
  ciudad: string | null;
  pais: string | null;
  avatar_url: string | null;
};

type PublicCertificateRecord = {
  id_certificado: string;
  titulo_certificado: string;
  descripcion: string | null;
  duracion_horas: number;
  fecha_emision: string | null;
  verificado_plataforma: boolean;
  destacado: boolean;
  fecha_creacion: string;
  instituciones: { nombre_institucion: string | null } | null;
  archivos_certificado?: Array<{
    id_archivo: string;
    nombre_archivo: string;
    ruta_archivo: string;
    tamano_bytes: number;
    es_actual: boolean;
  }> | null;
};

async function signedUrl(path: string) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.storage
    .from(CERTIFICADOS_BUCKET)
    .createSignedUrl(path, 60 * 10);

  return error ? undefined : data.signedUrl;
}

function displayDate(value: string | null, fallback: string) {
  const date = new Date(value ?? fallback);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function getPublicProfileBySlug(slug: string) {
  const admin = createAdminSupabaseClient();
  const { data: profile, error: profileError } = await admin
    .from("perfiles_usuario")
    .select(
      [
        "id_usuario",
        "nombres",
        "apellidos",
        "slug_publico",
        "descripcion_perfil",
        "titulo_profesional",
        "ciudad",
        "pais",
        "avatar_url",
      ].join(","),
    )
    .eq("slug_publico", slug)
    .single();

  if (profileError || !profile) {
    throw new BackendError(
      "Perfil publico no encontrado.",
      404,
      "PUBLIC_PROFILE_NOT_FOUND",
      profileError?.message,
    );
  }

  const typedProfile = profile as unknown as PublicProfileRecord;
  const { data: certificates, error: certificateError } = await admin
    .from("certificados")
    .select(
      [
        "id_certificado",
        "titulo_certificado",
        "descripcion",
        "duracion_horas",
        "fecha_emision",
        "verificado_plataforma",
        "destacado",
        "fecha_creacion",
        "instituciones(nombre_institucion)",
        "archivos_certificado(id_archivo,nombre_archivo,ruta_archivo,tamano_bytes,es_actual)",
      ].join(","),
    )
    .eq("id_usuario", typedProfile.id_usuario)
    .eq("visibilidad", "publico")
    .order("destacado", { ascending: false })
    .order("fecha_creacion", { ascending: false });

  if (certificateError) {
    throw new BackendError(
      "No se pudieron cargar los certificados publicos.",
      500,
      "PUBLIC_CERTIFICATES_FAILED",
      certificateError.message,
    );
  }

  const publicCertificates = await Promise.all(
    ((certificates ?? []) as unknown as PublicCertificateRecord[]).map(async (certificate) => {
      const currentFile =
        certificate.archivos_certificado?.find((file) => file.es_actual) ?? null;

      return {
        id_certificado: certificate.id_certificado,
        titulo_certificado: certificate.titulo_certificado,
        descripcion: certificate.descripcion,
        entidad:
          certificate.instituciones?.nombre_institucion ??
          "Institucion no registrada",
        duracion_horas: certificate.duracion_horas,
        fecha_display: displayDate(
          certificate.fecha_emision,
          certificate.fecha_creacion,
        ),
        verificado_plataforma: certificate.verificado_plataforma,
        destacado: certificate.destacado,
        archivo: currentFile
          ? {
              nombre_archivo: currentFile.nombre_archivo,
              tamano_bytes: currentFile.tamano_bytes,
              url_firmada: await signedUrl(currentFile.ruta_archivo),
            }
          : null,
      };
    }),
  );

  return {
    perfil: {
      ...typedProfile,
      nombre_completo: publicNameFromProfile(typedProfile),
    },
    certificados: publicCertificates,
  };
}
