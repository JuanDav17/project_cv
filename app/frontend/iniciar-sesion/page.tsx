import Link from "next/link";

import { FlowForm } from "../_components/flow-form";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

import "./page.css";

export default function IniciarSesionPage() {
  return (
    <section className="fp-login-split">
      <ThemeToggle floating />

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
            <span className="fp-login-split__hero-brand-name">CertifyPro</span>
          </div>

          <div className="fp-login-split__hero-copy">
            <h2 className="fp-login-split__hero-title">
              Bienvenido a&hellip;
            </h2>
            <p className="fp-login-split__hero-subtitle">
              Tu plataforma integral para gestionar, validar y compartir tus
              certificaciones profesionales de manera segura y eficiente.
            </p>
          </div>

          <p className="fp-login-split__hero-footer">
            Certificaciones verificadas al instante
          </p>
        </div>
      </aside>

      {/* ── Right Panel: Login form ── */}
      <main className="fp-login-split__form-area">
        <div className="fp-login-split__form-container">
          <header className="fp-login-split__form-header">
            <h1 className="fp-login-split__form-title">Iniciar Sesión</h1>
            <p className="fp-login-split__form-desc">
              ¡Bienvenido de nuevo! Ingresa tus credenciales para acceder a tu
              panel de certificaciones.
            </p>
          </header>

          <FlowForm
            className="fp-login-split__form"
            nextHref="/frontend/informacion-academica"
          >
            <div className="fp-field">
              <label
                className="fp-field__label fp-label-md"
                htmlFor="login-email"
              >
                Correo electrónico
              </label>
              <div className="fp-input-wrap">
                <span className="fp-input-icon">
                  <MaterialIcon>mail</MaterialIcon>
                </span>
                <input
                  id="login-email"
                  className="fp-input"
                  placeholder="nombre@empresa.com"
                  type="email"
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
                  href="/frontend"
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
                  className="fp-input"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <label className="fp-checkbox-row">
              <input
                type="checkbox"
                className="fp-checkbox"
                id="login-remember"
                defaultChecked
              />
              <span className="fp-body-sm">Recuérdame</span>
            </label>

            <button
              className="fp-button fp-button--primary fp-button--full"
              type="submit"
            >
              Acceder
            </button>
          </FlowForm>

          <p
            className="fp-body-sm fp-muted"
            style={{ margin: "1.5rem 0 0", textAlign: "center" }}
          >
            ¿No tienes una cuenta?{" "}
            <Link
              className="fp-link fp-link--strong"
              href="/frontend/registro"
            >
              Regístrate
            </Link>
          </p>
        </div>
      </main>
    </section>
  );
}
