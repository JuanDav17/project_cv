import Image from "next/image";
import Link from "next/link";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

export default function PaginaPrincipalPage() {
  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="overview"
        header={
          <>
            <div className="fp-sidebar__section fp-sidebar__section--plain">
              <div className="fp-headline-md" style={{ color: "var(--fp-primary)" }}>
                CertifyPro
              </div>
            </div>
            <div className="fp-sidebar__section">
              <div className="fp-sidebar__profile">
                <Image
                  alt="User profile avatar"
                  className="fp-sidebar__avatar"
                  height={40}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu9x2S_1laV9uLm4P13x3w-Tdq55YMDjm4jSV3AATiySTM1JUz6qQAfY734c16PXZyq7Z5d13gqjp_3g0XNhmbSy23Av_FgMSGgaCR2xQl1HUqOVwsfe6u3MApqILe_1VlQMMHnwRiWnkwJYIRZwjKNNwT88OhVV7XXQrLEe0PEiieIMBGvC62iHuARfQOd3cVmSSksv0m2Yui0lIN2-O2MfCkqqg4L1dYa6WiQYMVIN7PWvhYAqb-NN40wJVhHpLcg17hPuaNJN-_"
                  width={40}
                />
                <div className="fp-stack-xs">
                  <p className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                    Professional Tier
                  </p>
                  <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                    Verified Member
                  </p>
                </div>
              </div>
            </div>
          </>
        }
        footer={
          <div className="fp-stack-md">
            <button className="fp-button fp-button--primary fp-button--full" type="button">
              Upgrade Plan
            </button>
            <Link className="fp-sidebar__link fp-label-md" href="/frontend">
              <MaterialIcon>help</MaterialIcon>
              <span>Help Center</span>
            </Link>
          </div>
        }
      />

      <main className="fp-shell-main">
        <MobileBrandHeader>
          <MaterialIcon>notifications</MaterialIcon>
          <Image
            alt="User profile avatar"
            className="fp-sidebar__avatar"
            height={32}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbb1djFBSAPcmu5qiEfZYPmOH1cGZjnMmfBu6HMfUusU8k6Emqr8-JXFWJ40JnElEgpgrhSZK4F3NaJ-eQpraL9N2ewtjx5lP0zHIDkQjKCrmnbl9doQvB_H_dNyInuHor-t1qcXSj25QvYUpPg8u85NvMIU88-aqmaLS-noe7RoSnWj9PLE1EtwYXYc7cJ0WU7hScKU6p-oT1I2BNsXIFMF01sTDFsy24VGQm4s7LO3510UdFisKZ9VFVktmH5iOcCLJbMu3EoTJw"
            width={32}
          />
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

            <article className="fp-card fp-stat-card">
              <div className="fp-stat-card__header">
                <div
                  className="fp-stat-card__icon"
                  style={{
                    background: "var(--fp-surface-container-high)",
                    color: "var(--fp-primary)",
                  }}
                >
                  <MaterialIcon>visibility</MaterialIcon>
                </div>
                <h2 className="fp-label-md fp-muted" style={{ margin: 0 }}>
                  Vistas del Perfil
                </h2>
              </div>

              <div className="fp-stat-card__value-row">
                <span className="fp-stat-card__value">348</span>
                <span className="fp-stat-card__delta fp-body-sm">
                  <MaterialIcon className="fp-label-sm">arrow_upward</MaterialIcon>15%
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

          <section className="fp-split-grid">
            <div className="fp-stack-md">
              <h2 className="fp-headline-lg" style={{ margin: 0 }}>
                Certificados Recientes
              </h2>

              <article className="fp-card fp-cert-list">
                <div className="fp-cert-list__items">
                  {[
                    {
                      title: "Advanced Data Science",
                      meta: "Emitido por Tech Institute · Oct 2024",
                    },
                    {
                      title: "UX/UI Masterclass",
                      meta: "Emitido por Design Academy · Sep 2024",
                    },
                    {
                      title: "Agile Project Management",
                      meta: "Emitido por Agile Co · Ago 2024",
                    },
                  ].map((certificate) => (
                    <div className="fp-cert-item" key={certificate.title}>
                      <div className="fp-cert-item__icon">
                        <MaterialIcon>description</MaterialIcon>
                      </div>
                      <div className="fp-stack-xs" style={{ flex: 1 }}>
                        <h3 className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                          {certificate.title}
                        </h3>
                        <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                          {certificate.meta}
                        </p>
                      </div>
                      <div className="fp-icon-actions">
                        <button className="fp-icon-button" type="button">
                          <MaterialIcon>share</MaterialIcon>
                        </button>
                        <button className="fp-icon-button" type="button">
                          <MaterialIcon>download</MaterialIcon>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="fp-divider" />
                <div style={{ padding: "1rem", textAlign: "center" }}>
                  <Link className="fp-link fp-link--strong fp-label-md" href="/frontend/subir-certificado">
                    Ver todos los certificados
                  </Link>
                </div>
              </article>
            </div>

            <div className="fp-stack-md">
              <h2 className="fp-headline-lg" style={{ margin: 0 }}>
                Actividad Reciente
              </h2>

              <article className="fp-card fp-card--panel">
                <div className="fp-timeline">
                  <div className="fp-timeline__item">
                    <span className="fp-timeline__dot fp-timeline__dot--filled" />
                    <h3 className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                      Certificado Verificado
                    </h3>
                    <p className="fp-body-sm fp-muted" style={{ margin: "0.25rem 0 0" }}>
                      Tu certificado &quot;Advanced Data Science&quot; ha sido verificado con
                      éxito.
                    </p>
                    <span className="fp-label-sm fp-muted" style={{ display: "block", marginTop: "0.5rem" }}>
                      Hace 2 horas
                    </span>
                  </div>

                  <div className="fp-timeline__item">
                    <span className="fp-timeline__dot" />
                    <h3 className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                      Perfil Visto
                    </h3>
                    <p className="fp-body-sm fp-muted" style={{ margin: "0.25rem 0 0" }}>
                      Un reclutador de TechCorp ha visto tu perfil público.
                    </p>
                    <span className="fp-label-sm fp-muted" style={{ display: "block", marginTop: "0.5rem" }}>
                      Ayer
                    </span>
                  </div>

                  <div className="fp-timeline__item">
                    <span className="fp-timeline__dot" />
                    <h3 className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                      Insignia Obtenida
                    </h3>
                    <p className="fp-body-sm fp-muted" style={{ margin: "0.25rem 0 0" }}>
                      Has desbloqueado la insignia &quot;Top Learner 2024&quot;.
                    </p>
                    <span className="fp-label-sm fp-muted" style={{ display: "block", marginTop: "0.5rem" }}>
                      Hace 3 días
                    </span>
                  </div>
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
