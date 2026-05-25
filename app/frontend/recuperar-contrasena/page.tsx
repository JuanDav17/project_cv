"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  confirmPasswordReset,
  requestPasswordReset,
  verifyPasswordReset,
} from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";

import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

import "../iniciar-sesion/page.css";

type RecoveryStep = "request" | "verify" | "reset" | "done";

export default function RecuperarContrasenaPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<RecoveryStep>("request");
  const [resetToken, setResetToken] = useState("");
  const [devCode, setDevCode] = useState("");
  const [devLink, setDevLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tokenFromUrl] = useState(() =>
    typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("token") ?? "",
  );

  const verifyToken = useCallback(async (token: string) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyPasswordReset({ token });
      setResetToken(response.resetToken);
      setStep("reset");
      setSuccess("Codigo verificado. Ahora puedes crear una nueva contrasena.");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Este enlace ya no se puede usar.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tokenFromUrl) {
      const timeout = window.setTimeout(() => {
        void verifyToken(tokenFromUrl);
      }, 0);

      return () => window.clearTimeout(timeout);
    }
  }, [tokenFromUrl, verifyToken]);

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const nextEmail = String(formData.get("email") ?? "").trim();

    try {
      const response = await requestPasswordReset(nextEmail);
      setEmail(nextEmail);
      setDevCode(response.devCode ?? "");
      setDevLink(response.devLink ?? "");
      setStep("verify");
      setSuccess(
        "Si el correo existe en MyCertify, te enviamos un codigo de recuperacion.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo enviar el codigo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await verifyPasswordReset({ email, code });
      setResetToken(response.resetToken);
      setStep("reset");
      setSuccess("Codigo verificado. Ahora puedes crear una nueva contrasena.");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Este codigo ya no se puede usar.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") ?? "");
    const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

    if (password !== passwordConfirm) {
      setLoading(false);
      setError("Las contrasenas no coinciden.");
      return;
    }

    try {
      await confirmPasswordReset({ resetToken, password });
      setStep("done");
      setSuccess("Contrasena actualizada. Ya puedes iniciar sesion.");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo actualizar la contrasena.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="fp-login-split">
      <aside className="fp-login-split__hero" aria-hidden="true">
        <img
          className="fp-login-split__hero-img"
          src="/login-hero.png"
          alt=""
          draggable={false}
        />
        <div className="fp-login-split__hero-overlay" />

        <div className="fp-login-split__hero-content">
          <div className="fp-login-split__hero-brand">
            <div className="fp-login-split__hero-logo">
              <MaterialIcon filled>school</MaterialIcon>
            </div>
            <span className="fp-login-split__hero-brand-name">MyCertify</span>
          </div>

          <div className="fp-login-split__hero-copy">
            <h2 className="fp-login-split__hero-title">
              Recupera tu acceso
            </h2>
            <p className="fp-login-split__hero-subtitle">
              Te enviaremos un codigo seguro de un solo uso para que puedas
              crear una nueva contrasena.
            </p>
          </div>

          <p className="fp-login-split__hero-footer">
            Seguridad en cada paso.
          </p>
        </div>
      </aside>

      <main className="fp-login-split__form-area">
        <nav className="fp-auth-topnav">
          <Link className="fp-auth-topnav__home" href="/frontend/iniciar-sesion">
            <MaterialIcon>arrow_back</MaterialIcon>
            <span>Volver</span>
          </Link>
          <ThemeToggle />
        </nav>

        <div className="fp-auth-form-center">
          <div className="fp-login-split__form-container">
            <header className="fp-login-split__form-header">
              <h1 className="fp-login-split__form-title">
                Recuperar Contrasena
              </h1>
              <p className="fp-login-split__form-desc">
                {step === "request" &&
                  "Ingresa el correo de tu cuenta para recibir el codigo."}
                {step === "verify" &&
                  "Escribe el codigo que enviamos a tu correo."}
                {step === "reset" &&
                  "Crea una nueva contrasena para tu cuenta."}
                {step === "done" &&
                  "Tu cuenta ya quedo lista para volver a entrar."}
              </p>
            </header>

            {step === "request" && (
              <form className="fp-login-split__form" onSubmit={handleRequest}>
                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="recovery-email">
                    Correo electronico
                  </label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon">
                      <MaterialIcon>mail</MaterialIcon>
                    </span>
                    <input
                      id="recovery-email"
                      name="email"
                      className="fp-input"
                      placeholder="nombre@empresa.com"
                      type="email"
                      defaultValue={email}
                      required
                    />
                  </div>
                </div>

                <button
                  className="fp-button fp-button--primary fp-button--full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar codigo"}
                </button>
              </form>
            )}

            {step === "verify" && (
              <form className="fp-login-split__form" onSubmit={handleVerify}>
                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="recovery-code">
                    Codigo de recuperacion
                  </label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon">
                      <MaterialIcon>lock</MaterialIcon>
                    </span>
                    <input
                      id="recovery-code"
                      className="fp-input"
                      placeholder="A1B2C3D"
                      type="text"
                      value={code}
                      onChange={(event) => {
                        setCode(
                          event.target.value
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .toUpperCase(),
                        );
                        if (error) setError("");
                      }}
                      maxLength={10}
                      autoCapitalize="characters"
                      required
                    />
                  </div>
                </div>

                {devCode && (
                  <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                    En desarrollo usa: {devCode}
                  </p>
                )}

                {devLink && (
                  <Link className="fp-link fp-link--strong fp-label-md" href={devLink}>
                    Abrir enlace de desarrollo
                  </Link>
                )}

                <button
                  className="fp-button fp-button--primary fp-button--full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Validando..." : "Validar codigo"}
                </button>
              </form>
            )}

            {step === "reset" && (
              <form className="fp-login-split__form" onSubmit={handleConfirm}>
                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="new-password">
                    Nueva contrasena
                  </label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon">
                      <MaterialIcon>lock</MaterialIcon>
                    </span>
                    <input
                      id="new-password"
                      name="password"
                      className="fp-input"
                      placeholder="********"
                      type="password"
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="repeat-password">
                    Repetir contrasena
                  </label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon">
                      <MaterialIcon>lock</MaterialIcon>
                    </span>
                    <input
                      id="repeat-password"
                      name="passwordConfirm"
                      className="fp-input"
                      placeholder="********"
                      type="password"
                      minLength={8}
                      required
                    />
                  </div>
                </div>

                <button
                  className="fp-button fp-button--primary fp-button--full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Cambiar contrasena"}
                </button>
              </form>
            )}

            {step === "done" && (
              <button
                className="fp-button fp-button--primary fp-button--full"
                type="button"
                onClick={() => router.push("/frontend/iniciar-sesion")}
              >
                Ir a iniciar sesion
              </button>
            )}

            {error && (
              <div className="fp-alert fp-alert--error" style={{ marginTop: "1rem" }}>
                <MaterialIcon>error_outline</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="fp-alert fp-alert--success" style={{ marginTop: "1rem" }}>
                <MaterialIcon>check_circle_outline</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  {success}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </section>
  );
}
