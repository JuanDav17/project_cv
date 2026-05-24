"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

import "../iniciar-sesion/page.css";
import "./page.css";

export default function CodigoPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.trim() === "") {
      setError("Por favor ingresa un código.");
      return;
    }

    setLoading(true);
    setError("");

    // Simulate validation
    setTimeout(() => {
      setLoading(false);
      // Valid code is '123456' for the sake of demonstrating success vs error
      if (code === "123456") {
        setSuccess(true);
        setTimeout(() => {
          router.push("/frontend/pagina-principal");
        }, 1000);
      } else {
        setError("Código inválido. Por favor intenta con '123456'.");
      }
    }, 1500);
  };

  return (
    <section className="fp-login-split">

      {/* ── Left Panel: Hero image + overlay text ── */}
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
              Verifica tu identidad
            </h2>
            <p className="fp-login-split__hero-subtitle">
              Ingresa el código que hemos enviado a tu correo electrónico para
              continuar con el acceso a tu cuenta.
            </p>
          </div>

          <p className="fp-login-split__hero-footer">
            Seguridad en cada paso.
          </p>
        </div>
      </aside>

      {/* ── Right Panel: Code form ── */}
      <main className="fp-login-split__form-area">
        {/* Top nav bar with Home + ThemeToggle */}
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
              <h1 className="fp-login-split__form-title">Ingresar Código</h1>
              <p className="fp-login-split__form-desc">
                Revisa tu bandeja de entrada y escribe el código de 6 dígitos que te enviamos. (Usa: 123456)
              </p>
            </header>

            <form className="fp-login-split__form fp-stack-md" onSubmit={handleSubmit}>
              <div className="fp-field">
                <label
                  className="fp-field__label fp-label-md"
                  htmlFor="verification-code"
                >
                  Código de verificación
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <MaterialIcon>lock</MaterialIcon>
                  </span>
                  <input
                    id="verification-code"
                    className={`fp-input ${error ? 'fp-input--error' : ''} ${success ? 'fp-input--success' : ''}`}
                    placeholder="123456"
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (error) setError("");
                    }}
                    disabled={loading || success}
                    maxLength={6}
                  />
                </div>
                {error && (
                  <p className="fp-body-sm fp-error-message" style={{ color: "var(--fp-error)", marginTop: "0.5rem" }}>
                    {error}
                  </p>
                )}
                {success && (
                  <p className="fp-body-sm fp-success-message" style={{ color: "var(--fp-primary)", marginTop: "0.5rem" }}>
                    ¡Código verificado con éxito! Redirigiendo...
                  </p>
                )}
              </div>

              <button
                className="fp-button fp-button--primary fp-button--full"
                type="submit"
                disabled={loading || success}
              >
                {loading ? "Validando..." : "Validar y Acceder"}
              </button>
            </form>

            <p
              className="fp-body-sm fp-muted"
              style={{ margin: "1.5rem 0 0", textAlign: "center" }}
            >
              ¿No recibiste el código?{" "}
              <button
                className="fp-link fp-link--strong fp-button-reset"
                type="button"
                onClick={() => alert("Código reenviado.")}
              >
                Reenviar
              </button>
            </p>
          </div>
        </div>
      </main>
    </section>
  );
}
