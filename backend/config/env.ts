import { BackendError } from "@/backend/http/errors";

type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

type SupabaseAdminEnv = SupabasePublicEnv & {
  secretKey: string;
};

export const CERTIFICADOS_BUCKET =
  process.env.SUPABASE_CERTIFICADOS_BUCKET ?? "certificados";

export function hasSupabasePublicEnv() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
}

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new BackendError(
      "Faltan variables publicas de Supabase.",
      500,
      "SUPABASE_PUBLIC_ENV_MISSING",
    );
  }

  return { url, publishableKey };
}

export function getSupabaseAdminEnv(): SupabaseAdminEnv {
  const publicEnv = getSupabasePublicEnv();
  const secretKey =
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey) {
    throw new BackendError(
      "Falta la llave privada de Supabase para el backend.",
      500,
      "SUPABASE_SECRET_ENV_MISSING",
    );
  }

  return { ...publicEnv, secretKey };
}

export function getAppUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/^/, "https://") ??
    "http://localhost:3000"
  );
}

export function getVerificationCodeTtlMinutes() {
  const value = Number(process.env.AUTH_CODE_TTL_MINUTES ?? 10);
  return Number.isFinite(value) && value > 0 ? value : 10;
}

export function getVerificationCodeLength() {
  const value = Number(process.env.AUTH_CODE_LENGTH ?? 7);
  return Number.isInteger(value) && value >= 6 && value <= 10 ? value : 7;
}

export function getPasswordResetSessionTtlMinutes() {
  const value = Number(process.env.PASSWORD_RESET_SESSION_TTL_MINUTES ?? 10);
  return Number.isFinite(value) && value > 0 ? value : 10;
}

export function hasEmailEnv() {
  return Boolean(
    process.env.SMTP_USER &&
      (process.env.SMTP_PASSWORD ||
        (process.env.GOOGLE_CLIENT_ID &&
          process.env.GOOGLE_CLIENT_SECRET &&
          process.env.GOOGLE_REFRESH_TOKEN)),
  );
}

export function getEmailEnv() {
  const user = process.env.SMTP_USER;

  if (!user) {
    throw new BackendError(
      "Falta SMTP_USER para enviar correos.",
      500,
      "EMAIL_ENV_MISSING",
    );
  }

  return {
    from: process.env.EMAIL_FROM ?? `MyCertify <${user}>`,
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    secure: (process.env.SMTP_SECURE ?? "true") === "true",
    user,
    password: process.env.SMTP_PASSWORD,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
  };
}
