import { Resend } from "resend";
import { BackendError } from "@/backend/http/errors";
import { getResendEnv, hasEmailEnv } from "@/backend/config/env";
import { TwoFactorEmail } from "@/emails/TwoFactorEmail";
import * as React from "react";

type VerificationEmailInput = {
  to: string;
  code: string;
  actionUrl: string;
  expiresAt: string;
  purpose: "login" | "password_reset";
};

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

  const env = getResendEnv();
  const resend = new Resend(env.apiKey);
  const isPasswordReset = input.purpose === "password_reset";
  const title = isPasswordReset
    ? "Recuperacion de cuenta MyCertify"
    : "Codigo de acceso MyCertify";
    
  const expiresAt = new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(input.expiresAt));

  const { render } = await import("@react-email/components");
  const htmlContent = await render(
    React.createElement(TwoFactorEmail, {
      code: input.code,
      actionUrl: input.actionUrl,
      expiresAt: expiresAt,
      purpose: input.purpose,
    })
  );

  const { error } = await resend.emails.send({
    from: env.from,
    to: input.to,
    subject: title,
    html: htmlContent,
  });

  if (error) {
    console.error("Resend Error:", error);
    throw new BackendError(
      "Fallo el envio del correo mediante Resend.",
      500,
      "EMAIL_SEND_FAILED",
      error.message
    );
  }

  return { skipped: false };
}
