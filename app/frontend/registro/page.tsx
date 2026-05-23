import Link from "next/link";

import { FlowForm } from "../_components/flow-form";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

export default function RegistroPage() {
  return (
    <section className="fp-page fp-page--centered">
      <ThemeToggle floating />

      <main className="fp-card fp-card--auth fp-stack-lg">
        <header className="fp-stack-sm" style={{ textAlign: "center", alignItems: "center" }}>
          <div className="fp-brand" style={{ fontSize: "1.5rem" }}>
            <span className="fp-brand__icon fp-brand__icon--round">
              <MaterialIcon filled>verified_user</MaterialIcon>
            </span>
            <span>CertifyPro</span>
          </div>
          <h1 className="fp-headline-lg" style={{ margin: 0 }}>
            Registrarse
          </h1>
          <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
            Empieza a gestionar y verificar tus certificaciones profesionales hoy mismo
          </p>
        </header>

        <FlowForm className="fp-auth-form" nextHref="/frontend/iniciar-sesion">
          <div className="fp-field">
            <label className="fp-field__label fp-label-md" htmlFor="full-name">
              Nombre completo
            </label>
            <input
              id="full-name"
              className="fp-input"
              placeholder="María García"
              type="text"
            />
          </div>

          <div className="fp-field">
            <label className="fp-field__label fp-label-md" htmlFor="register-email">
              Correo electrónico
            </label>
            <input
              id="register-email"
              className="fp-input"
              placeholder="maria@empresa.com"
              type="email"
            />
          </div>

          <div className="fp-field">
            <label className="fp-field__label fp-label-md" htmlFor="register-password">
              Contraseña
            </label>
            <input
              id="register-password"
              className="fp-input"
              placeholder="••••••••"
              type="password"
            />
            <div className="fp-password-meter">
              <div className="fp-password-meter__track">
                <div className="fp-password-meter__fill" style={{ width: "33%" }} />
              </div>
              <span className="fp-body-sm fp-muted">Debe tener al menos 8 caracteres</span>
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

        <div className="fp-divider" />

        <p className="fp-body-sm fp-muted" style={{ margin: 0, textAlign: "center" }}>
          ¿Ya tienes una cuenta?{" "}
          <Link className="fp-link fp-link--strong" href="/frontend/iniciar-sesion">
            Inicia sesión
          </Link>
        </p>
      </main>
    </section>
  );
}
