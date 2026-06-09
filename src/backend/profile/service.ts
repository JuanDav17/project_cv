import { BackendError, assertRequired } from "@/backend/http/errors";
import { createAdminSupabaseClient } from "@/backend/supabase/admin";
import { getAuthenticatedUser, ensureUserRecords } from "@/backend/auth/service";
import { publicNameFromProfile, slugify } from "@/backend/utils/slug";
import { sanitizeHtml } from "@/backend/utils/sanitize";

export type ProfileDto = {
  id_usuario: string;
  correo: string;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  slug_publico: string;
  descripcion_perfil: string | null;
  pais: string | null;
  ciudad: string | null;
  titulo_profesional: string | null;
  url_linkedin: string | null;
  url_github: string | null;
  url_portafolio: string | null;
  avatar_url: string | null;
  areas_interes: Array<{ id: string; label: string; icon: string; custom?: boolean }> | null;
};

type ProfileRecord = Omit<ProfileDto, "correo" | "nombre_completo">;

function toProfileDto(profile: ProfileRecord, email: string): ProfileDto {
  return {
    ...profile,
    correo: email,
    nombre_completo: publicNameFromProfile(profile),
  };
}

export async function getCurrentProfile(): Promise<ProfileDto> {
  const { user } = await getAuthenticatedUser();
  const synced = await ensureUserRecords(user);
  const admin = createAdminSupabaseClient();

  const { data, error } = await admin
    .from("perfiles_usuario")
    .select(
      [
        "id_usuario",
        "nombres",
        "apellidos",
        "slug_publico",
        "descripcion_perfil",
        "pais",
        "ciudad",
        "titulo_profesional",
        "url_linkedin",
        "url_github",
        "url_portafolio",
        "avatar_url",
        "areas_interes",
      ].join(","),
    )
    .eq("id_usuario", user.id)
    .single();

  if (error || !data) {
    throw new BackendError(
      "No se pudo cargar el perfil.",
      500,
      "PROFILE_READ_FAILED",
      error?.message,
    );
  }

  return toProfileDto(data as unknown as ProfileRecord, synced.correo);
}

export async function updateCurrentProfile(input: Record<string, unknown>) {
  const { user } = await getAuthenticatedUser();
  const admin = createAdminSupabaseClient();
  const nombres = assertRequired(
    input.nombres,
    "Los nombres son obligatorios.",
    "FIRST_NAME_REQUIRED",
  );
  const apellidos = assertRequired(
    input.apellidos,
    "Los apellidos son obligatorios.",
    "LAST_NAME_REQUIRED",
  );

  if ((nombres as string).length > 100) {
    throw new BackendError("Los nombres son demasiado largos.", 400, "FIRST_NAME_TOO_LONG");
  }

  if ((apellidos as string).length > 100) {
    throw new BackendError("Los apellidos son demasiado largos.", 400, "LAST_NAME_TOO_LONG");
  }

  const updatePayload = {
    nombres: sanitizeHtml(nombres as string),
    apellidos: sanitizeHtml(apellidos as string),
    slug_publico:
      input.slug_publico !== undefined
        ? typeof input.slug_publico === "string" && input.slug_publico.trim()
          ? slugify(input.slug_publico)
          : null
        : undefined,
    descripcion_perfil:
      input.descripcion_perfil !== undefined
        ? typeof input.descripcion_perfil === "string" ? sanitizeHtml(input.descripcion_perfil) : null
        : undefined,
    pais: input.pais !== undefined ? (typeof input.pais === "string" ? sanitizeHtml(input.pais) : null) : undefined,
    ciudad: input.ciudad !== undefined ? (typeof input.ciudad === "string" ? sanitizeHtml(input.ciudad) : null) : undefined,
    titulo_profesional:
      input.titulo_profesional !== undefined
        ? typeof input.titulo_profesional === "string" ? sanitizeHtml(input.titulo_profesional) : null
        : undefined,
    url_linkedin: input.url_linkedin !== undefined ? (typeof input.url_linkedin === "string" ? input.url_linkedin : null) : undefined,
    url_github: input.url_github !== undefined ? (typeof input.url_github === "string" ? input.url_github : null) : undefined,
    url_portafolio:
      input.url_portafolio !== undefined ? (typeof input.url_portafolio === "string" ? input.url_portafolio : null) : undefined,
    avatar_url: input.avatar_url !== undefined ? (typeof input.avatar_url === "string" ? input.avatar_url : null) : undefined,
    areas_interes: input.areas_interes !== undefined ? (Array.isArray(input.areas_interes) ? input.areas_interes : null) : undefined,
    fecha_actualizacion: new Date().toISOString(),
  };

  const { error } = await admin
    .from("perfiles_usuario")
    .update(updatePayload)
    .eq("id_usuario", user.id);

  if (error) {
    throw new BackendError(
      "No se pudo actualizar el perfil.",
      500,
      "PROFILE_UPDATE_FAILED",
      error.message,
    );
  }

  return getCurrentProfile();
}
