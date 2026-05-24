import Link from "next/link";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

import "./page.css";

export default function MiCuentaPage() {
  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="settings"
        header={
          <>
            <div className="fp-sidebar__section fp-sidebar__section--plain">
              <div className="fp-headline-md" style={{ color: "var(--fp-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MaterialIcon>workspace_premium</MaterialIcon>
                MyCertify
              </div>
            </div>
            <div className="fp-sidebar__section">
              <div className="fp-sidebar__profile fp-sidebar__profile--centered">
                <div className="fp-sidebar__avatar-placeholder fp-sidebar__avatar-placeholder--large">
                  <MaterialIcon>person</MaterialIcon>
                </div>
                <div className="fp-stack-xs" style={{ marginTop: "0.5rem" }}>
                  <p className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                    Alex Morgan
                  </p>
                </div>
              </div>
            </div>
          </>
        }
        footer={
          <div className="fp-stack-md">
            <Link className="fp-sidebar__link fp-label-md" href="/frontend">
              <MaterialIcon>help</MaterialIcon>
              <span>Centro de Ayuda</span>
            </Link>
          </div>
        }
      />

      <main className="fp-shell-main">
        <MobileBrandHeader>
          <MaterialIcon>menu</MaterialIcon>
        </MobileBrandHeader>

        <div className="fp-shell-content fp-stack-xl">
          <header className="fp-section-intro fp-stack-sm">
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Configuración de la Cuenta
            </h1>
            <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
              Gestiona tu perfil y preferencias de seguridad.
            </p>
          </header>

          <section className="fp-settings-grid">
            <article className="fp-card fp-card--panel fp-stack-lg">
              <div className="fp-stack-sm">
                <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MaterialIcon style={{ color: "var(--fp-primary)" }}>person</MaterialIcon>
                  Información Personal
                </h2>
                <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                  Actualiza tus datos básicos de perfil.
                </p>
              </div>

              <div className="fp-divider" />

              <form className="fp-stack-lg">
                <div className="fp-grid-two">
                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="first-name">
                      Nombres
                    </label>
                    <input id="first-name" className="fp-input" defaultValue="Alex" type="text" />
                  </div>
                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="last-name">
                      Apellidos
                    </label>
                    <input id="last-name" className="fp-input" defaultValue="Morgan" type="text" />
                  </div>
                </div>

                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="account-email">
                    Dirección de Correo Electrónico
                  </label>
                  <input
                    id="account-email"
                    className="fp-input"
                    defaultValue="alex.morgan@example.com"
                    type="email"
                  />
                  <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                    Este correo será usado para el envío de certificaciones.
                  </p>
                </div>

                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="title">
                    Título Profesional
                  </label>
                  <input
                    id="title"
                    className="fp-input"
                    defaultValue="Senior Systems Engineer"
                    type="text"
                  />
                </div>

                <div className="fp-divider" />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="fp-button fp-button--primary" type="button">
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </article>

            <div className="fp-settings-column">
              <article className="fp-card fp-card--panel fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MaterialIcon style={{ color: "var(--fp-primary)" }}>lock</MaterialIcon>
                  Seguridad
                </h2>

                <div className="fp-divider" />

                <div className="fp-stack-md">
                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="current-password">
                      Contraseña Actual
                    </label>
                    <input id="current-password" className="fp-input" placeholder="••••••••" type="password" />
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="new-password">
                      Nueva Contraseña
                    </label>
                    <input
                      id="new-password"
                      className="fp-input"
                      placeholder="Nueva contraseña segura"
                      type="password"
                    />
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="repeat-new-password">
                      Repetir Nueva Contraseña
                    </label>
                    <input
                      id="repeat-new-password"
                      className="fp-input"
                      placeholder="Repetir nueva contraseña segura"
                      type="password"
                    />
                  </div>

                  <button className="fp-button fp-button--secondary fp-button--full" type="button">
                    Actualizar Contraseña
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>

        <FrontendFooter />
      </main>
    </section>
  );
}
