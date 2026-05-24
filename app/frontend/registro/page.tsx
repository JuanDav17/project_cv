import Link from "next/link";

import { FlowForm } from "../_components/flow-form";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";
import { MdEmail } from "react-icons/md";

import "./page.css";

export default function RegistroPage() {
  return (
    <section className="fp-register-split">

      {/* ── Left Panel: Hero image + overlay text ── */}
      <aside className="fp-register-split__hero" aria-hidden="true">
        <img
          className="fp-register-split__hero-img"
          src="/register-hero.png"
          alt=""
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
              Únete a miles de profesionales que ya suben, organizan y
              comparten sus certificaciones en sus hpjas de vida con diferentes empresas.
            </p>
          </div>

          <p className="fp-register-split__hero-footer">
            Tu conocimiento, respaldado por evidencia.
          </p>
        </div>
      </aside>

      {/* ── Right Panel: Registration form ── */}
      <main className="fp-register-split__form-area">

        {/* Top nav bar with Home + ThemeToggle */}
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
              Empieza a gestionar y enseñar tus certificaciones profesionales
              hoy mismo. Solo toma unos minutos.
            </p>
          </header>

          <FlowForm className="fp-register-split__form" nextHref="/frontend/informacion-academica">
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
                  className="fp-input"
                  placeholder="María García"
                  type="text"
                />
              </div>
            </div>

            <div className="fp-field">
              <label className="fp-field__label fp-label-md" htmlFor="register-email">
                Correo electrónico
              </label>
              <div className="fp-input-wrap">
                <span className="fp-input-icon">
                  <MaterialIcon>mail</MaterialIcon>
                </span>
                <input
                  id="register-email"
                  className="fp-input"
                  placeholder="maria@example.com"
                  type="email"
                />
              </div>
            </div>

            <div className="fp-field">
              <label className="fp-field__label fp-label-md" htmlFor="register-password">
                Contraseña
              </label>
              <div className="fp-input-wrap">
                <span className="fp-input-icon">
                  <MaterialIcon>lock</MaterialIcon>
                </span>
                <input
                  id="register-password"
                  className="fp-input"
                  placeholder="••••••••"
                  type="password"
                />
              </div>
            </div>

            <label className="fp-checkbox-row">
              <input className="fp-checkbox" type="checkbox" />
              <span className="fp-body-sm fp-muted">
                Acepto los{" "}
                <Link className="fp-link fp-link--strong" href="/frontend">
                  Términos de Servicio
                </Link>{" "}
                y la{" "}
                <Link className="fp-link fp-link--strong" href="/frontend">
                  Política de Privacidad
                </Link>
              </span>
            </label>

            <button className="fp-button fp-button--primary fp-button--full" type="submit">
              Crear cuenta
            </button>
          </FlowForm>

          <p className="fp-body-sm fp-muted" style={{ margin: "1.5rem 0 0", textAlign: "center" }}>
            ¿Ya tienes una cuenta?{" "}
            <Link className="fp-link fp-link--strong" href="/frontend/iniciar-sesion">
              Inicia sesión
            </Link>
          </p>
        </div>
        </div>
      </main>
    </section>
  );
}
