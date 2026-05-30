import { BackendError, assertRequired } from "@/backend/http/errors";
import { createAdminSupabaseClient } from "@/backend/supabase/admin";
import { getAuthenticatedUser, ensureUserRecords } from "@/backend/auth/service";
import { publicNameFromProfile, slugify } from "@/backend/utils/slug";

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

  const updatePayload = {
    nombres,
    apellidos,
    slug_publico:
      typeof input.slug_publico === "string" && input.slug_publico.trim()
        ? slugify(input.slug_publico)
        : undefined,
    descripcion_perfil:
      typeof input.descripcion_perfil === "string" ? input.descripcion_perfil : null,
    pais: typeof input.pais === "string" ? input.pais : null,
    ciudad: typeof input.ciudad === "string" ? input.ciudad : null,
    titulo_profesional:
      typeof input.titulo_profesional === "string" ? input.titulo_profesional : null,
    url_linkedin: typeof input.url_linkedin === "string" ? input.url_linkedin : null,
    url_github: typeof input.url_github === "string" ? input.url_github : null,
    url_portafolio:
      typeof input.url_portafolio === "string" ? input.url_portafolio : null,
    avatar_url: typeof input.avatar_url === "string" ? input.avatar_url : null,
    areas_interes: Array.isArray(input.areas_interes) ? input.areas_interes : undefined,
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
