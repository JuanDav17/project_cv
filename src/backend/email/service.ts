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

function getResendErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }
  }

  return "Resend no pudo enviar el correo.";
}

function isResendTestingRecipientError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const resendError = error as { statusCode?: unknown; message?: unknown };
  const statusCode = Number(resendError.statusCode);
  const message =
    typeof resendError.message === "string"
      ? resendError.message.toLowerCase()
      : "";

  return (
    statusCode === 403 &&
    (message.includes("testing emails") || message.includes("verify a domain"))
  );
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
    if (isResendTestingRecipientError(error)) {
      const message =
        "Resend esta en modo de prueba. Verifica un dominio en Resend y usa EMAIL_FROM con ese dominio para enviar codigos a otros destinatarios.";

      if (process.env.NODE_ENV !== "production") {
        console.warn(`${message} Correo omitido para ${input.to}.`);
        return { skipped: true, reason: "resend_testing_recipient" };
      }

      throw new BackendError(
        message,
        500,
        "RESEND_DOMAIN_NOT_VERIFIED",
        getResendErrorMessage(error),
      );
    }

    console.error("Resend Error:", error);
    throw new BackendError(
      "Fallo el envio del correo mediante Resend.",
      500,
      "EMAIL_SEND_FAILED",
      getResendErrorMessage(error)
    );
  }

  return { skipped: false };
}
