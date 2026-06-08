"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { register } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/lib/ui/toast";
import { Eye, EyeOff } from "lucide-react";

import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

import "./page.css";

export default function RegistroPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const acceptedTerms = formData.get("terms") === "on";

    if (!acceptedTerms) {
      showWarningToast("Debes aceptar los terminos para crear la cuenta.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await register({
        fullName: String(formData.get("fullName") ?? ""),
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      if (response.sessionReady && response.requiresVerification) {
        if (response.devCode) {
          sessionStorage.setItem("mycertify-dev-code", response.devCode);
        } else {
          sessionStorage.removeItem("mycertify-dev-code");
        }

        showSuccessToast("Cuenta creada. Verifica tu codigo.");
        router.push("/frontend/codigo");
        return;
      }

      showSuccessToast("Cuenta creada. Confirma tu correo para iniciar sesion.");
    } catch (requestError) {
      showErrorToast(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo crear la cuenta.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="fp-register-split">
      <aside className="fp-register-split__hero" aria-hidden="true">
        <Image
          className="fp-register-split__hero-img"
          src="/register-hero.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          draggable={false}
        />
        <div className="fp-register-split__hero-overlay" />

        <div className="fp-register-split__hero-content">
          <div className="fp-register-split__hero-brand">
            <div className="fp-register-split__hero-logo">
              <MaterialIcon filled>school</MaterialIcon>
            </div>
            <span className="fp-register-split__hero-brand-name">MyCertify</span>
          </div>

          <div className="fp-register-split__hero-copy">
            <h2 className="fp-register-split__hero-title">
              Crea tu perfil profesional
            </h2>
            <p className="fp-register-split__hero-subtitle">
              Unifica tus certificados, respalda tu hoja de vida y comparte tu
              trayectoria con empresas por medio de un perfil verificable.
            </p>
          </div>

          <p className="fp-register-split__hero-footer">
            Tu conocimiento, respaldado por evidencia.
          </p>
        </div>
      </aside>

      <main className="fp-register-split__form-area">
        <nav className="fp-auth-topnav">
          <Link className="fp-auth-topnav__home" href="/frontend">
            <MaterialIcon>arrow_back</MaterialIcon>
            <span>Inicio</span>
          </Link>
          <ThemeToggle />
        </nav>

        <div className="fp-auth-form-center">
          <div className="fp-register-split__form-container">
            <header className="fp-register-split__form-header">
              <h1 className="fp-register-split__form-title">Registrarse</h1>
              <p className="fp-register-split__form-desc">
                Empieza a gestionar y compartir tus certificaciones
                profesionales. Solo toma unos minutos.
              </p>
            </header>

            <form className="fp-register-split__form" onSubmit={handleSubmit}>
              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="full-name">
                  Nombre completo
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <MaterialIcon>badge</MaterialIcon>
                  </span>
                  <input
                    id="full-name"
                    name="fullName"
                    className="fp-input"
                    placeholder="Maria Garcia"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div className="fp-field">
                <label
                  className="fp-field__label fp-label-md"
                  htmlFor="register-email"
                >
                  Correo electronico
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <MaterialIcon>mail</MaterialIcon>
                  </span>
                  <input
                    id="register-email"
                    name="email"
                    className="fp-input"
                    placeholder="maria@example.com"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="fp-field">
                <label
                  className="fp-field__label fp-label-md"
                  htmlFor="register-password"
                >
                  Contrasena
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <MaterialIcon>lock</MaterialIcon>
                  </span>
                  <input
                    id="register-password"
                    name="password"
                    className="fp-input"
                    placeholder="********"
                    type={showPassword ? "text" : "password"}
                    minLength={8}
                    required
                    style={{ paddingRight: "3rem" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--fp-muted)",
                      display: "flex",
                      padding: 0
                    }}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <label className="fp-checkbox-row">
                <input className="fp-checkbox" name="terms" type="checkbox" />
                <span className="fp-body-sm fp-muted">
                  Acepto los{" "}
                  <Link className="fp-link fp-link--strong" href="/frontend">
                    Terminos de Servicio
                  </Link>{" "}
                  y la{" "}
                  <Link className="fp-link fp-link--strong" href="/frontend">
                    Politica de Privacidad
                  </Link>
                </span>
              </label>

              <button
                className="fp-button fp-button--primary fp-button--full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            <p
              className="fp-body-sm fp-muted"
              style={{ margin: "1.5rem 0 0", textAlign: "center" }}
            >
              Ya tienes una cuenta?{" "}
              <Link
                className="fp-link fp-link--strong"
                href="/frontend/iniciar-sesion"
              >
                Inicia sesion
              </Link>
            </p>
          </div>
        </div>
      </main>
    </section>
  );
}
