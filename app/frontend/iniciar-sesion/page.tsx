import Link from "next/link";

import { FlowForm } from "../_components/flow-form";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

export default function IniciarSesionPage() {
  return (
    <section className="fp-page fp-page--centered">
      <ThemeToggle floating />

      <main className="fp-auth-shell">
        <div className="fp-auth-brand">
          <div className="fp-auth-brand__mark">
            <MaterialIcon filled>school</MaterialIcon>
          </div>
          <h1 className="fp-headline-lg" style={{ margin: 0 }}>
            CertifyPro
          </h1>
        </div>

        <article className="fp-card fp-card--auth fp-stack-lg">
          <header className="fp-stack-sm">
            <h2 className="fp-headline-md" style={{ margin: 0 }}>
              Bienvenido de nuevo
            </h2>
            <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
              Ingresa tus credenciales para acceder a tu panel de certificaciones.
            </p>
          </header>

          <FlowForm className="fp-auth-form" nextHref="/frontend/informacion-academica">
            <div className="fp-field">
              <label className="fp-field__label fp-label-md" htmlFor="login-email">
                Correo electrónico
              </label>
              <input
                id="login-email"
                className="fp-input"
                placeholder="nombre@empresa.com"
                type="email"
              />
            </div>

            <div className="fp-field">
              <div className="fp-field__row">
                <label className="fp-field__label fp-label-md" htmlFor="login-password">
                  Contraseña
                </label>
                <Link className="fp-link fp-link--strong fp-label-md" href="/frontend">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input id="login-password" className="fp-input" type="password" />
            </div>

            <button className="fp-button fp-button--primary fp-button--full" type="submit">
              Acceder
            </button>
          </FlowForm>
        </article>

        <p className="fp-body-sm fp-muted" style={{ margin: "1.5rem 0 0", textAlign: "center" }}>
          ¿No tienes una cuenta?{" "}
          <Link className="fp-link fp-link--strong" href="/frontend/registro">
            Regístrate
          </Link>
        </p>
      </main>
    </section>
  );
}
