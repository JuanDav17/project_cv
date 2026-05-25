import nodemailer from "nodemailer";

import { getEmailEnv, hasEmailEnv } from "@/backend/config/env";
import { BackendError } from "@/backend/http/errors";

type VerificationEmailInput = {
  to: string;
  code: string;
  actionUrl: string;
  expiresAt: string;
  purpose: "login" | "password_reset";
};

function createTransporter() {
  const env = getEmailEnv();

  return nodemailer.createTransport({
    host: env.host,
    port: env.port,
    secure: env.secure,
    auth: env.googleRefreshToken
      ? {
          type: "OAuth2",
          user: env.user,
          clientId: env.googleClientId,
          clientSecret: env.googleClientSecret,
          refreshToken: env.googleRefreshToken,
        }
      : {
          user: env.user,
          pass: env.password,
        },
  });
}

function formatPurpose(purpose: VerificationEmailInput["purpose"]) {
  return purpose === "password_reset"
    ? "recuperar tu contrasena"
    : "iniciar sesion";
}

function createVerificationEmail(input: VerificationEmailInput) {
  const title =
    input.purpose === "password_reset"
      ? "Recuperacion de cuenta MyCertify"
      : "Codigo de acceso MyCertify";
  const action = formatPurpose(input.purpose);
  const expiresAt = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(input.expiresAt));

  const text = [
    title,
    "",
    `Usa este codigo para ${action}: ${input.code}`,
    `Tambien puedes abrir este enlace de un solo uso: ${input.actionUrl}`,
    `Este acceso vence el ${expiresAt}.`,
    "Si no solicitaste este correo, puedes ignorarlo.",
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#111827">
      <h1 style="font-size:20px;margin:0 0 12px">${title}</h1>
      <p>Usa este codigo para ${action}:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:4px;margin:16px 0">${input.code}</p>
      <p>
        <a href="${input.actionUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none">
          Abrir enlace seguro
        </a>
      </p>
      <p>Este acceso vence el <strong>${expiresAt}</strong>.</p>
      <p style="color:#6b7280;font-size:13px">Si no solicitaste este correo, puedes ignorarlo.</p>
    </div>
  `;

  return { subject: title, text, html };
}

export async function sendVerificationEmail(input: VerificationEmailInput) {
  if (!hasEmailEnv()) {
    if (process.env.NODE_ENV !== "production") {
      return { skipped: true };
    }

    throw new BackendError(
      "No esta configurado el envio de correos.",
      500,
      "EMAIL_NOT_CONFIGURED",
    );
  }

  const env = getEmailEnv();
  const transporter = createTransporter();
  const email = createVerificationEmail(input);

  await transporter.sendMail({
    from: env.from,
    to: input.to,
    ...email,
  });

  return { skipped: false };
}
