import Link from "next/link";

import { FlowForm } from "../_components/flow-form";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

import "./page.css";

export default function IniciarSesionPage() {
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

      {/* ── Right Panel: Login form ── */}
      <main className="fp-login-split__form-area">

        {/* Top nav bar with Home + ThemeToggle */}
        <nav className="fp-auth-topnav">
          <Link className="fp-auth-topnav__home" href="/frontend">
            <MaterialIcon>arrow_back</MaterialIcon>
            <span>Inicio</span>
          </Link>
          <ThemeToggle />
        </nav>

        <div className="fp-auth-form-center">
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
            nextHref="/frontend/codigo"
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

            <button className="fp-button fp-button--primary fp-button--full" type="submit">
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
        </div>
      </main>
    </section>
  );
}
