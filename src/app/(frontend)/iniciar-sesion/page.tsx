"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";
import { showErrorToast, showSuccessToast } from "@/lib/ui/toast";
import { Eye, EyeOff } from "lucide-react";

import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

import "../page.css";

export default function IniciarSesionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await login({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
      });

      if (response.devCode) {
        sessionStorage.setItem("mycertify-dev-code", response.devCode);
      } else {
        sessionStorage.removeItem("mycertify-dev-code");
      }

      showSuccessToast("Sesion iniciada. Verifica tu codigo.");
      router.push("/codigo");
    } catch (requestError) {
      showErrorToast(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo iniciar sesion.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="fp-login-split">
      <aside className="fp-login-split__hero" aria-hidden="true">
        <Image
          className="fp-login-split__hero-img"
          src="/login-hero.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
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
              Bienvenido a&hellip;
            </h2>
            <p className="fp-login-split__hero-subtitle">
              Tu plataforma integral para subir, validar y compartir tus
              certificaciones profesionales de manera rapida y ordenada.
            </p>
          </div>

          <p className="fp-login-split__hero-footer">
            Certificaciones al instante.
          </p>
        </div>
      </aside>

      <main className="fp-login-split__form-area">
        <nav className="fp-auth-topnav">
          <Link className="fp-auth-topnav__home" href="/">
            <MaterialIcon>arrow_back</MaterialIcon>
            <span>Inicio</span>
          </Link>
          <ThemeToggle />
        </nav>

        <div className="fp-auth-form-center">
          <div className="fp-login-split__form-container">
            <header className="fp-login-split__form-header">
              <h1 className="fp-login-split__form-title">Iniciar Sesion</h1>
              <p className="fp-login-split__form-desc">
                Ingresa tus credenciales para acceder a tu panel de
                certificaciones.
              </p>
            </header>
            <form className="fp-login-split__form" onSubmit={handleSubmit}>
              <div className="fp-field">
                <label
                  className="fp-field__label fp-label-md"
                  htmlFor="login-email"
                >
                  Correo electronico
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <MaterialIcon>mail</MaterialIcon>
                  </span>
                  <input
                    id="login-email"
                    name="email"
                    className="fp-input"
                    placeholder="nombre@empresa.com"
                    type="email"
                    required
                  />
                </div>
              </div>

              <div className="fp-field">
                <div className="fp-field__row">
                  <label
                    className="fp-field__label fp-label-md"
                    htmlFor="login-password"
                  >
                    Contraseña
                  </label>
                  <Link
                    className="fp-link fp-link--strong fp-label-md"
                    href="/recuperar-contrasena"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <MaterialIcon>lock</MaterialIcon>
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    className="fp-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
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

              <button
                className="fp-button fp-button--primary fp-button--full"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Validando..." : "Acceder"}
              </button>
            </form>

            <p
              className="fp-body-sm fp-muted"
              style={{ margin: "1.5rem 0 0", textAlign: "center" }}
            >
              No tienes una cuenta?{" "}
              <Link
                className="fp-link fp-link--strong"
                href="/registro"
              >
                Registrate
              </Link>
            </p>
          </div>
        </div>
      </main>
    </section>
  );
}
