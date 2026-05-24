import Link from "next/link";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

import "./page.css";

export default function PaginaPrincipalPage() {
  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="overview"
        header={
          <>
            <div className="fp-sidebar__section fp-sidebar__section--plain">
              <div className="fp-headline-md" style={{ color: "var(--fp-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MaterialIcon>workspace_premium</MaterialIcon>
                MyCertify
              </div>
            </div>
            <div className="fp-sidebar__section">
              <div className="fp-sidebar__profile">
              <div className="fp-sidebar__avatar-placeholder">
                <MaterialIcon>person</MaterialIcon>
              </div>
              <div className="fp-stack-xs">
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
          <MaterialIcon>notifications</MaterialIcon>
          <div className="fp-sidebar__avatar-placeholder" style={{ width: '32px', height: '32px' }}>
            <MaterialIcon className="fp-label-md">person</MaterialIcon>
          </div>
        </MobileBrandHeader>

        <div className="fp-shell-content fp-stack-xl">
          <header className="fp-section-intro">
            <h1 className="fp-display-mobile" style={{ margin: 0 }}>
              Bienvenido de nuevo, Alex
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: "0.5rem 0 0" }}>
              Aquí tienes un resumen de tu actividad. Desde este panel puedes navegar a carga de
              certificados, generación de QR, analítica y configuración de cuenta.
            </p>
          </header>

          <section className="fp-bento">
            <article className="fp-card fp-stat-card">
              <div className="fp-stat-card__header">
                <div
                  className="fp-stat-card__icon"
                  style={{
                    background: "var(--fp-secondary-container)",
                    color: "var(--fp-on-secondary-container)",
                  }}
                >
                  <MaterialIcon filled>military_tech</MaterialIcon>
                </div>
                <h2 className="fp-label-md fp-muted" style={{ margin: 0 }}>
                  Certificaciones Totales
                </h2>
              </div>

              <div className="fp-stat-card__value-row">
                <span className="fp-stat-card__value">12</span>
                <span className="fp-stat-card__delta fp-body-sm">
                  <MaterialIcon className="fp-label-sm">arrow_upward</MaterialIcon>2 este mes
                </span>
              </div>
            </article>


            <article className="fp-card fp-cta-card fp-stack-md">
              <div className="fp-stack-sm">
                <h2 className="fp-headline-md" style={{ margin: 0 }}>
                  Nuevo Certificado
                </h2>
                <p className="fp-body-sm" style={{ margin: 0, opacity: 0.9 }}>
                  Sube y valida tu última credencial para compartirla en tu red.
                </p>
              </div>
              <Link className="fp-button fp-button--ghost" href="/frontend/subir-certificado">
                <MaterialIcon>upload</MaterialIcon>
                Subir ahora
              </Link>
            </article>
          </section>


        </div>

        <FrontendFooter />
      </main>
    </section>
  );
}
