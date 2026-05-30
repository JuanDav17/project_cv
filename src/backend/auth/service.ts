import type { User } from "@supabase/supabase-js";

import {
  getAppUrl,
  getPasswordResetSessionTtlMinutes,
  getVerificationCodeLength,
  getVerificationCodeTtlMinutes,
  hasEmailEnv,
} from "@/backend/config/env";
import { sendVerificationEmail } from "@/backend/email/service";
import { BackendError, assertRequired } from "@/backend/http/errors";
import { createAdminSupabaseClient } from "@/backend/supabase/admin";
import { createServerSupabaseClient } from "@/backend/supabase/server";
import {
  createAlphaNumericCode,
  createUrlToken,
  hashUrlToken,
  hashVerificationCode,
} from "@/backend/utils/hash";
import { slugify, splitFullName } from "@/backend/utils/slug";

export type AuthProfile = {
  id_usuario: string;
  correo: string;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  slug_publico: string;
  titulo_profesional: string | null;
  avatar_url: string | null;
};

type RegisterInput = {
  fullName: string;
  email: string;
  password: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type VerificationPurpose = "login" | "password_reset";

type VerificationInput = {
  code?: string;
  token?: string;
};

function normalizeEmail(value: unknown) {
  const email = assertRequired(value, "El correo es obligatorio.", "EMAIL_REQUIRED")
    .toLowerCase()
    .trim();

  if (!email.includes("@")) {
    throw new BackendError("El correo no tiene un formato valido.", 400, "EMAIL_INVALID");
  }

  return email;
}

function validatePassword(value: unknown) {
  const password = assertRequired(
    value,
    "La contrasena es obligatoria.",
    "PASSWORD_REQUIRED",
  );

  if (password.length < 8) {
    throw new BackendError(
      "La contrasena debe tener al menos 8 caracteres.",
      400,
      "PASSWORD_TOO_SHORT",
    );
  }

  return password;
}

async function createUniqueSlug(fullName: string, email: string, userId: string) {
  const admin = createAdminSupabaseClient();
  const base = slugify(fullName || email.split("@")[0]);

  for (let index = 0; index < 20; index += 1) {
    const candidate = index === 0 ? base : `${base}-${index + 1}`;
    const { data, error } = await admin
      .from("perfiles_usuario")
      .select("id_usuario")
      .eq("slug_publico", candidate)
      .maybeSingle();

    if (error) {
      throw new BackendError(
        "No se pudo validar el slug publico.",
        500,
        "PROFILE_SLUG_LOOKUP_FAILED",
        error.message,
      );
    }

    if (!data || data.id_usuario === userId) {
      return candidate;
    }
  }

  return `${base}-${Date.now()}`;
}

export async function ensureUserRecords(
  user: Pick<User, "id" | "email" | "user_metadata">,
  options?: { fullName?: string },
): Promise<AuthProfile> {
  const admin = createAdminSupabaseClient();
  const email = normalizeEmail(user.email);
  const fullName =
    options?.fullName ??
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : email.split("@")[0]);

  const { error: userError } = await admin.from("usuarios").upsert(
    {
      id_usuario: user.id,
      correo: email,
      estado: "activo",
      fecha_actualizacion: new Date().toISOString(),
    },
    { onConflict: "id_usuario" },
  );

  if (userError) {
    throw new BackendError(
      "No se pudo sincronizar el usuario.",
      500,
      "USER_SYNC_FAILED",
      userError.message,
    );
  }

  const { data: currentProfile, error: profileLookupError } = await admin
    .from("perfiles_usuario")
    .select(
      "id_usuario,nombres,apellidos,slug_publico,titulo_profesional,avatar_url",
    )
    .eq("id_usuario", user.id)
    .maybeSingle();

  if (profileLookupError) {
    throw new BackendError(
      "No se pudo consultar el perfil.",
      500,
      "PROFILE_LOOKUP_FAILED",
      profileLookupError.message,
    );
  }

  if (currentProfile) {
    return {
      id_usuario: user.id,
      correo: email,
      nombres: currentProfile.nombres,
      apellidos: currentProfile.apellidos,
      nombre_completo: `${currentProfile.nombres} ${currentProfile.apellidos}`.trim(),
      slug_publico: currentProfile.slug_publico,
      titulo_profesional: currentProfile.titulo_profesional,
      avatar_url: currentProfile.avatar_url,
    };
  }

  const { nombres, apellidos } = splitFullName(fullName);
  const slug = await createUniqueSlug(`${nombres} ${apellidos}`, email, user.id);

  const { data: createdProfile, error: createProfileError } = await admin
    .from("perfiles_usuario")
    .insert({
      id_usuario: user.id,
      nombres,
      apellidos,
      slug_publico: slug,
      titulo_profesional: null,
    })
    .select(
      "id_usuario,nombres,apellidos,slug_publico,titulo_profesional,avatar_url",
    )
    .single();

  if (createProfileError) {
    throw new BackendError(
      "No se pudo crear el perfil.",
      500,
      "PROFILE_CREATE_FAILED",
      createProfileError.message,
    );
  }

  return {
    id_usuario: user.id,
    correo: email,
    nombres: createdProfile.nombres,
    apellidos: createdProfile.apellidos,
    nombre_completo: `${createdProfile.nombres} ${createdProfile.apellidos}`.trim(),
    slug_publico: createdProfile.slug_publico,
    titulo_profesional: createdProfile.titulo_profesional,
    avatar_url: createdProfile.avatar_url,
  };
}

export async function getAuthenticatedUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new BackendError("Debes iniciar sesion.", 401, "UNAUTHENTICATED");
  }

  return { supabase, user };
}

async function findKnownUserByEmail(email: string) {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("usuarios")
    .select("id_usuario,correo")
    .eq("correo", email)
    .maybeSingle();

  if (error) {
    throw new BackendError(
      "No se pudo consultar el usuario.",
      500,
      "USER_LOOKUP_FAILED",
      error.message,
    );
  }

  return data as unknown as { id_usuario: string; correo: string } | null;
}

async function createVerificationChallenge(input: {
  userId: string;
  email: string;
  purpose: VerificationPurpose;
  redirectPath: string;
}) {
  const admin = createAdminSupabaseClient();
  const fixedCode =
    process.env.NODE_ENV !== "production" && process.env.AUTH_DEV_FIXED_CODE
      ? process.env.AUTH_DEV_FIXED_CODE.trim().toUpperCase()
      : undefined;
  const code =
    fixedCode ?? createAlphaNumericCode(getVerificationCodeLength()).toUpperCase();
  const token = createUrlToken();
  const ttlMinutes = getVerificationCodeTtlMinutes();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();
  const actionUrl = `${getAppUrl()}${input.redirectPath}?token=${encodeURIComponent(token)}`;

  await admin
    .from("codigos_verificacion")
    .delete()
    .eq("id_usuario", input.userId)
    .eq("proposito", input.purpose);

  const { error } = await admin.from("codigos_verificacion").insert({
    id_usuario: input.userId,
    correo_destino: input.email,
    codigo_hash: hashVerificationCode(input.userId, code),
    token_hash: hashUrlToken(token),
    proposito: input.purpose,
    expira_en: expiresAt,
  });

  if (error) {
    throw new BackendError(
      "No se pudo generar el codigo de verificacion.",
      500,
      "VERIFICATION_CODE_CREATE_FAILED",
      error.message,
    );
  }

  const emailResult = await sendVerificationEmail({
    to: input.email,
    code,
    actionUrl,
    expiresAt,
    purpose: input.purpose,
  });

  return {
    expiresAt,
    emailSent: !emailResult.skipped,
    devCode: process.env.NODE_ENV === "production" ? undefined : code,
    devLink: process.env.NODE_ENV === "production" ? undefined : actionUrl,
  };
}

async function consumeVerificationChallenge(input: {
  purpose: VerificationPurpose;
  userId?: string;
  code?: string;
  token?: string;
}) {
  const admin = createAdminSupabaseClient();
  const code = input.code?.trim().toUpperCase();
  const token = input.token?.trim();

  if (!code && !token) {
    throw new BackendError(
      "Debes enviar el codigo o el enlace de verificacion.",
      400,
      "VERIFICATION_CREDENTIAL_REQUIRED",
    );
  }

  let query = admin
    .from("codigos_verificacion")
    .select("id_codigo,id_usuario,expira_en")
    .eq("proposito", input.purpose)
    .gte("expira_en", new Date().toISOString())
    .limit(1);

  if (input.userId) {
    query = query.eq("id_usuario", input.userId);
  }

  if (token) {
    query = query.eq("token_hash", hashUrlToken(token));
  } else if (code && input.userId) {
    query = query.eq("codigo_hash", hashVerificationCode(input.userId, code));
  } else {
    throw new BackendError(
      "Para validar un codigo debes enviar el correo asociado.",
      400,
      "VERIFICATION_EMAIL_REQUIRED",
    );
  }

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw new BackendError(
      "No se pudo validar el codigo.",
      500,
      "VERIFICATION_CODE_LOOKUP_FAILED",
      error.message,
    );
  }

  if (!data) {
    throw new BackendError(
      "Este codigo o enlace ya no se puede usar.",
      410,
      "VERIFICATION_CODE_NOT_USABLE",
    );
  }

  const { error: deleteError } = await admin
    .from("codigos_verificacion")
    .delete()
    .eq("id_codigo", data.id_codigo);

  if (deleteError) {
    throw new BackendError(
      "No se pudo cerrar el codigo de verificacion.",
      500,
      "VERIFICATION_CODE_DELETE_FAILED",
      deleteError.message,
    );
  }

  return data as unknown as { id_codigo: string; id_usuario: string; expira_en: string };
}

async function createPasswordResetSession(userId: string) {
  const admin = createAdminSupabaseClient();
  const resetToken = createUrlToken();
  const ttlMinutes = getPasswordResetSessionTtlMinutes();
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000).toISOString();

  await admin
    .from("sesiones_recuperacion_contrasena")
    .delete()
    .eq("id_usuario", userId);

  const { error } = await admin.from("sesiones_recuperacion_contrasena").insert({
    id_usuario: userId,
    token_hash: hashUrlToken(resetToken),
    expira_en: expiresAt,
  });

  if (error) {
    throw new BackendError(
      "No se pudo crear la sesion de recuperacion.",
      500,
      "PASSWORD_RESET_SESSION_CREATE_FAILED",
      error.message,
    );
  }

  return { resetToken, expiresAt };
}

export async function registerWithPassword(input: RegisterInput) {
  const fullName = assertRequired(
    input.fullName,
    "El nombre completo es obligatorio.",
    "FULL_NAME_REQUIRED",
  );
  const email = normalizeEmail(input.email);
  const password = validatePassword(input.password);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${getAppUrl()}/frontend/iniciar-sesion`,
    },
  });

  if (error || !data.user) {
    throw new BackendError(
      error?.message ?? "No se pudo crear la cuenta.",
      400,
      "REGISTER_FAILED",
    );
  }

  const profile = await ensureUserRecords(data.user, { fullName });

  return {
    profile,
    sessionReady: Boolean(data.session),
    emailConfirmationRequired: !data.session,
  };
}

export async function loginWithPassword(input: LoginInput) {
  const email = normalizeEmail(input.email);
  const password = validatePassword(input.password);
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new BackendError(
      "Correo o contrasena incorrectos.",
      401,
      "LOGIN_FAILED",
      error?.message,
    );
  }

  const profile = await ensureUserRecords(data.user);
  const verification = await createVerificationChallenge({
    userId: data.user.id,
    email,
    purpose: "login",
    redirectPath: "/frontend/codigo",
  });

  return {
    profile,
    requiresVerification: true,
    ...verification,
  };
}

export async function verifyLoginCode(input: VerificationInput) {
  const { user } = await getAuthenticatedUser();
  await consumeVerificationChallenge({
    purpose: "login",
    userId: user.id,
    code: input.code,
    token: input.token,
  });

  const profile = await ensureUserRecords(user);

  return { profile };
}

export async function requestPasswordReset(emailInput: unknown) {
  const email = normalizeEmail(emailInput);
  const user = await findKnownUserByEmail(email);

  if (!user) {
    return {
      emailSent: hasEmailEnv(),
      expiresAt: null,
    };
  }

  return createVerificationChallenge({
    userId: user.id_usuario,
    email,
    purpose: "password_reset",
    redirectPath: "/frontend/recuperar-contrasena",
  });
}

export async function verifyPasswordResetCredential(input: {
  email?: unknown;
  code?: string;
  token?: string;
}) {
  let userId: string | undefined;

  if (!input.token) {
    const email = normalizeEmail(input.email);
    const user = await findKnownUserByEmail(email);
    userId = user?.id_usuario;
  }

  if (!input.token && !userId) {
    throw new BackendError(
      "Este codigo o enlace ya no se puede usar.",
      410,
      "VERIFICATION_CODE_NOT_USABLE",
    );
  }

  const challenge = await consumeVerificationChallenge({
    purpose: "password_reset",
    userId,
    code: input.code,
    token: input.token,
  });

  return createPasswordResetSession(challenge.id_usuario);
}

export async function confirmPasswordReset(input: {
  resetToken?: string;
  password?: string;
}) {
  const resetToken = assertRequired(
    input.resetToken,
    "La sesion de recuperacion es obligatoria.",
    "PASSWORD_RESET_TOKEN_REQUIRED",
  );
  const password = validatePassword(input.password);
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("sesiones_recuperacion_contrasena")
    .select("id_sesion,id_usuario")
    .eq("token_hash", hashUrlToken(resetToken))
    .gte("expira_en", new Date().toISOString())
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new BackendError(
      "No se pudo validar la sesion de recuperacion.",
      500,
      "PASSWORD_RESET_SESSION_LOOKUP_FAILED",
      error.message,
    );
  }

  if (!data) {
    throw new BackendError(
      "Este enlace de recuperacion ya no se puede usar.",
      410,
      "PASSWORD_RESET_SESSION_NOT_USABLE",
    );
  }

  const resetSession = data as unknown as { id_sesion: string; id_usuario: string };
  const { error: updateError } = await admin.auth.admin.updateUserById(
    resetSession.id_usuario,
    { password },
  );

  if (updateError) {
    throw new BackendError(
      "No se pudo actualizar la contrasena.",
      500,
      "PASSWORD_UPDATE_FAILED",
      updateError.message,
    );
  }

  await admin
    .from("sesiones_recuperacion_contrasena")
    .delete()
    .eq("id_sesion", resetSession.id_sesion);

  return { passwordUpdated: true };
}

export async function logout() {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new BackendError(
      "No se pudo cerrar la sesion.",
      500,
      "LOGOUT_FAILED",
      error.message,
    );
  }
}

export async function getCurrentSessionProfile() {
  const { user } = await getAuthenticatedUser();
  return ensureUserRecords(user);
}

export async function updateCurrentPassword(passwordInput: string) {
  const password = validatePassword(passwordInput);
  const { user } = await getAuthenticatedUser();
  const admin = createAdminSupabaseClient();
  
  const { error: updateError } = await admin.auth.admin.updateUserById(
    user.id,
    { password },
  );

  if (updateError) {
    throw new BackendError(
      "No se pudo actualizar la contrasena.",
      500,
      "PASSWORD_UPDATE_FAILED",
      updateError.message,
    );
  }

  return { passwordUpdated: true };
}
