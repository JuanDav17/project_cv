import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export interface TwoFactorEmailProps {
  code: string;
  actionUrl: string;
  expiresAt: string;
  purpose: "login" | "password_reset";
}

export const TwoFactorEmail = ({
  code,
  actionUrl,
  expiresAt,
  purpose,
}: TwoFactorEmailProps) => {
  const isPasswordReset = purpose === "password_reset";
  const title = isPasswordReset
    ? "Recuperacion de cuenta MyCertify"
    : "Codigo de acceso MyCertify";
  const actionText = isPasswordReset ? "recuperar tu contrasena" : "iniciar sesion";

  return (
    <Html>
      <Head />
      <Preview>{title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>{title}</Heading>
          <Text style={text}>Usa este codigo para {actionText}:</Text>
          
          <Section style={codeContainer}>
            <Text style={codeStyle}>{code}</Text>
          </Section>

          <Text style={text}>
            Tambien puedes{" "}
            <Link href={actionUrl} style={link}>
              abrir este enlace seguro
            </Link>{" "}
            para acceder directamente.
          </Text>

          <Text style={text}>
            Este acceso vence el <strong>{expiresAt}</strong>.
          </Text>

          <Text style={footer}>
            Si no solicitaste este correo, puedes ignorarlo de forma segura.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  marginBottom: "40px",
  marginTop: "40px",
  borderRadius: "8px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  maxWidth: "600px",
};

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  margin: "0 0 20px",
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px",
};

const codeContainer = {
  background: "#f3f4f6",
  borderRadius: "6px",
  margin: "24px 0",
  padding: "16px",
  textAlign: "center" as const,
};

const codeStyle = {
  color: "#111827",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "6px",
  margin: "0",
};

const link = {
  color: "#4f46e5",
  textDecoration: "underline",
};

const footer = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "32px 0 0",
};

export default TwoFactorEmail;
