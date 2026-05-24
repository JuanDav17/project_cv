"use client";

import Image from "next/image";
import Link from "next/link";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

// Importación directa del archivo CSS exclusivo de la vista
import "./page.css";

type QRColor = "primary" | "secondary" | "tertiary" | "dark";

export default function CodigoQrPage() {
  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="analytics"
        header={
          <>
            <div className="fp-sidebar__section fp-sidebar__section--plain">
              <div className="fp-headline-md" style={{ color: "var(--fp-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MaterialIcon>workspace_premium</MaterialIcon>
                MyCertify
              </div>
            </div>
            <div className="fp-sidebar__section fp-stack-md">
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
          <Link className="fp-sidebar__link fp-label-md" href="/frontend">
            <MaterialIcon>help</MaterialIcon>
            <span>Centro de Ayuda</span>
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
              QR único asociado a tu perfil en MyCertify.
            </p>
          </header>

          <section className="fp-two-column-qr" style={{ maxWidth: "72rem", margin: "0 auto", width: "100%" }}>

            {/* Contenedor del QR */}
            <article className="fp-card fp-qr-preview fp-stack-md">
              <div className="fp-qr-image-frame fp-stack-sm theme-primary">
                <Image
                  alt="QR Code Preview"
                  height={256}
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUGJkg0uVZofmR0Hu-i1MxgV6-dywgUwHaURFFB7pHJbOzJkC0oSy-UJt6dp00p3sxbuJOOWIQbd8Qm3-jgTJczW_PgwQLZ-lK9h6tIF065wj-JrNIB_dqdlLEG2-VG0yY2u0PYv6Z0166l1O-7v4s98WGprZNlv2Hsx5kT-9oAn5jlZybLgkKWr5e9fFkchacrFtPxjM79kwX3qhY5iuv8PSwFhPUmQkTaFt3sc2fUhX_drW8QH21lhl4gpfCXA5F-cii6N_smCOh"
                  width={256}
                  priority
                />
                <div className="fp-qr-verified-badge">
                  <MaterialIcon className="fp-label-sm">verified</MaterialIcon>
                  MyCertify Verified
                </div>
              </div>
            </article>

            <div className="fp-stack-lg">
              <article className="fp-card fp-card--panel fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0 }}>
                  Acciones
                </h2>
                <button className="fp-button fp-button--primary fp-button--full" type="button">
                  <MaterialIcon>download</MaterialIcon>
                  Descargar QR (PNG)
                </button>
              </article>

              <article className="fp-alert-qr">
                <MaterialIcon>info</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  Este código QR es dinámico. Si actualizas tu perfil en MyCertify, la información
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