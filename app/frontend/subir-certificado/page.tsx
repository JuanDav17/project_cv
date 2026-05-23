import Link from "next/link";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { MaterialIcon } from "../_components/material-icon";
import { UploadDropzone } from "../_components/upload-dropzone";

const MAX_PDF_SIZE = 1_048_576;

export default function SubirCertificadoPage() {
  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="credentials"
        header={
          <div className="fp-sidebar__section fp-stack-md">
            <div className="fp-sidebar__profile">
              <span className="fp-sidebar__icon-box">
                <MaterialIcon filled>domain</MaterialIcon>
              </span>
              <div className="fp-stack-xs">
                <h2 className="fp-headline-md" style={{ margin: 0, color: "var(--fp-primary)" }}>
                  Professional Tier
                </h2>
                <p className="fp-label-sm fp-muted" style={{ margin: 0 }}>
                  Verified Member
                </p>
              </div>
            </div>
            <button className="fp-button fp-button--soft fp-button--full" type="button">
              Upgrade Plan
            </button>
          </div>
        }
        footer={
          <Link className="fp-sidebar__link fp-label-md" href="/frontend">
            <MaterialIcon>help</MaterialIcon>
            <span>Help Center</span>
          </Link>
        }
      />

      <main className="fp-shell-main">
        <div className="fp-shell-content fp-stack-xl" style={{ maxWidth: "72rem" }}>
          <header className="fp-stack-sm" style={{ maxWidth: "56rem", margin: "1rem auto 0", width: "100%" }}>
            <div className="fp-breadcrumbs fp-label-sm">
              <Link href="/frontend/pagina-principal">Mis Credenciales</Link>
              <MaterialIcon className="fp-label-sm">chevron_right</MaterialIcon>
              <span style={{ color: "var(--fp-primary)" }}>Subir Nuevo</span>
            </div>
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Subir Nuevo Certificado
            </h1>
            <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
              Añade una nueva credencial a tu perfil verificado para aumentar tu autoridad.
            </p>
          </header>

          <article className="fp-card fp-card--panel fp-stack-xl" style={{ maxWidth: "56rem", margin: "0 auto", width: "100%" }}>
            <form className="fp-stack-xl">
              <UploadDropzone maxSizeBytes={MAX_PDF_SIZE} />

              <div className="fp-divider" />

              <div className="fp-grid-two">
                <div className="fp-field fp-grid-two__full">
                  <label className="fp-field__label fp-label-md" htmlFor="cert-name">
                    Nombre del Certificado / Título
                  </label>
                  <input
                    id="cert-name"
                    className="fp-input"
                    placeholder="Ej. Certificación Avanzada en Gestión de Proyectos"
                    type="text"
                  />
                </div>

                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="institution">
                    Institución Emisora
                  </label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon">
                      <MaterialIcon>account_balance</MaterialIcon>
                    </span>
                    <input
                      id="institution"
                      className="fp-input"
                      placeholder="Ej. Universidad Tecnológica"
                      type="text"
                    />
                  </div>
                </div>

                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="issue-date">
                    Fecha de Expedición
                  </label>
                  <div className="fp-input-wrap">
                    <span className="fp-input-icon">
                      <MaterialIcon>calendar_month</MaterialIcon>
                    </span>
                    <input id="issue-date" className="fp-input" type="date" />
                  </div>
                </div>

                <div className="fp-field fp-grid-two__full">
                  <div className="fp-field__row">
                    <label className="fp-field__label fp-label-md" htmlFor="credential-id">
                      ID de Credencial
                    </label>
                    <span className="fp-label-sm fp-muted">Opcional</span>
                  </div>
                  <input
                    id="credential-id"
                    className="fp-input"
                    placeholder="Ej. CERT-2024-98765"
                    type="text"
                  />
                </div>
              </div>

              <div className="fp-divider" />

              <div className="fp-row-between" style={{ justifyContent: "flex-end" }}>
                <button className="fp-button fp-button--ghost" type="button">
                  Cancelar
                </button>
                <button className="fp-button fp-button--primary" type="button">
                  <MaterialIcon className="fp-label-sm">verified_user</MaterialIcon>
                  Validar y Guardar
                </button>
              </div>
            </form>
          </article>
        </div>
      </main>
    </section>
  );
}
