import Image from "next/image";
import Link from "next/link";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

export default function CodigoQrPage() {
  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="analytics"
        header={
          <div className="fp-sidebar__section fp-stack-md">
            <div className="fp-sidebar__profile">
              <Image
                alt="Organization Logo"
                className="fp-sidebar__avatar fp-sidebar__avatar--square"
                height={40}
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZvdH6cFBtS3Y26I4jPJkQ1zG3n6yuKp3cyQAPtkXpAPhEb0RcQmd-0uOGtuLvRe5zJWQFwz7cIaqC0pOxctpsGZcgcdaeYfvhx9f46JtsduQ2UyLwDUDViOKPJu77P2tI2cV-oCUbpAgDRJVcd766ziyVbMY4Zbv-x38NcDjGeu2_ogXTNzyuwR1nwmLOX7GBbsy1dyGnC16hMJB1qOFGtYBboiPJKsuQoy3H3QDFUANK5xv-CQT4lPTUvb8MsCbhG05T88PXi8eg"
                width={40}
              />
              <div className="fp-stack-xs">
                <h2 className="fp-headline-md" style={{ margin: 0, color: "var(--fp-primary)" }}>
                  Professional Tier
                </h2>
                <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                  Verified Member
                </p>
              </div>
            </div>
            <button className="fp-button fp-button--primary fp-button--full" type="button">
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
        <MobileBrandHeader>
          <MaterialIcon>menu</MaterialIcon>
        </MobileBrandHeader>

        <div className="fp-shell-content fp-stack-xl">
          <header className="fp-stack-sm" style={{ maxWidth: "34rem", margin: "0 auto", textAlign: "center" }}>
            <h1 className="fp-display-mobile" style={{ margin: 0 }}>
              Tu Perfil en un Escaneo
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: 0 }}>
              Comparte tu trayectoria profesional al instante. Personaliza y descarga tu código
              QR único asociado a tu perfil verificado en CertifyPro.
            </p>
          </header>

          <section className="fp-two-column" style={{ maxWidth: "72rem", margin: "0 auto", width: "100%" }}>
            <article className="fp-card fp-qr-preview fp-stack-md" style={{ alignItems: "center", justifyContent: "center" }}>
              <div className="fp-qr-image-frame fp-stack-sm" style={{ alignItems: "center" }}>
                <Image
                  alt="QR Code Preview"
                  height={256}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUGJkg0uVZofmR0Hu-i1MxgV6-dywgUwHaURFFB7pHJbOzJkC0oSy-UJt6dp00p3sxbuJOOWIQbd8Qm3-jgTJczW_PgwQLZ-lK9h6tIF065wj-JrNIB_dqdlLEG2-VG0yY2u0PYv6Z0166l1O-7v4s98WGprZNlv2Hsx5kT-9oAn5jlZybLgkKWr5e9fFkchacrFtPxjM79kwX3qhY5iuv8PSwFhPUmQkTaFt3sc2fUhX_drW8QH21lhl4gpfCXA5F-cii6N_smCOh"
                  width={256}
                />
                <div className="fp-label-md" style={{ color: "var(--fp-primary)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <MaterialIcon className="fp-label-sm">verified</MaterialIcon>
                  CertifyPro Verified
                </div>
              </div>
            </article>

            <div className="fp-stack-lg">
              <article className="fp-card fp-card--panel fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0 }}>
                  Personalizar Color
                </h2>
                <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                  Selecciona un color de acento para tu código QR que coincida con tu marca
                  personal.
                </p>
                <div className="fp-color-palette">
                  <button
                    aria-label="Color Primary"
                    className="fp-color-swatch is-selected"
                    style={{ background: "var(--fp-primary)", color: "var(--fp-primary)" }}
                    type="button"
                  />
                  <button
                    aria-label="Color Secondary"
                    className="fp-color-swatch"
                    style={{ background: "var(--fp-secondary)", color: "var(--fp-secondary)" }}
                    type="button"
                  />
                  <button
                    aria-label="Color Tertiary"
                    className="fp-color-swatch"
                    style={{ background: "var(--fp-tertiary)", color: "var(--fp-tertiary)" }}
                    type="button"
                  />
                  <button
                    aria-label="Color Dark"
                    className="fp-color-swatch"
                    style={{ background: "var(--fp-on-surface)", color: "var(--fp-on-surface)" }}
                    type="button"
                  />
                </div>
              </article>

              <article className="fp-card fp-card--panel fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0 }}>
                  Acciones
                </h2>
                <button className="fp-button fp-button--primary fp-button--full" type="button">
                  <MaterialIcon>download</MaterialIcon>
                  Descargar QR (PNG)
                </button>
                <button className="fp-button fp-button--secondary fp-button--full" type="button">
                  <MaterialIcon>content_copy</MaterialIcon>
                  Copiar Enlace del Perfil
                </button>
              </article>

              <article className="fp-alert">
                <MaterialIcon style={{ color: "var(--fp-primary)" }}>info</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  Este código QR es dinámico. Si actualizas tu perfil en CertifyPro, la información
                  escaneada se actualizará automáticamente sin necesidad de generar uno nuevo.
                </p>
              </article>
            </div>
          </section>
        </div>

        <FrontendFooter />
      </main>
    </section>
  );
}
