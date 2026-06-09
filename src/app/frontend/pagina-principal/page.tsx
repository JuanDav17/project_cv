"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { me, type AuthProfile } from "@/lib/api/auth";
import { listCertificates, type CertificateDto } from "@/lib/api/certificados";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

import "./page.css";
import "../mis-certificados/page.css";

export default function PaginaPrincipalPage() {
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [certificates, setCertificates] = useState<CertificateDto[]>([]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([me(), listCertificates()])
      .then(([profileData, certificateData]) => {
        if (!isMounted) return;
        setProfile(profileData);
        setCertificates(certificateData);
      })
      .catch(() => {
        if (isMounted) setProfile(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const firstName = useMemo(() => {
    return profile?.nombres?.split(" ")[0] ?? "Usuario";
  }, [profile]);

  const certificatesThisMonth = useMemo(() => {
    const now = new Date();
    return certificates.filter((certificate) => {
      if (!certificate.fecha_emision) return false;
      const date = new Date(certificate.fecha_emision);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;
  }, [certificates]);

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
                    {profile?.nombre_completo ?? "Usuario"}
                  </p>
                  {profile?.titulo_profesional && (
                    <p className="fp-body-sm fp-muted" style={{ margin: 0, fontSize: "0.75rem" }}>
                      {profile.titulo_profesional}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        }
        footer={
          <div className="fp-stack-md">
            <Link className="fp-sidebar__link fp-label-md" href="/frontend/ayuda">
              <MaterialIcon>help</MaterialIcon>
              <span>Centro de Ayuda</span>
            </Link>
          </div>
        }
      />

      <main className="fp-shell-main">
        <MobileBrandHeader>
          <MaterialIcon>notifications</MaterialIcon>
          <div className="fp-sidebar__avatar-placeholder" style={{ width: "32px", height: "32px" }}>
            <MaterialIcon className="fp-label-md">person</MaterialIcon>
          </div>
        </MobileBrandHeader>

        <div className="fp-shell-content fp-stack-xl">
          <header className="fp-section-intro">
            <h1 className="fp-display-mobile" style={{ margin: 0 }}>
              Bienvenido de nuevo, {firstName}
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: "0.5rem 0 0" }}>
              Aqui tienes un resumen de tu actividad. Desde este panel puedes navegar a carga de
              certificados, generacion de QR, analitica y configuracion de cuenta.
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
                <span className="fp-stat-card__value">{certificates.length}</span>
                <span className="fp-stat-card__delta fp-body-sm">
                  <MaterialIcon className="fp-label-sm">arrow_upward</MaterialIcon>
                  {certificatesThisMonth} este mes
                </span>
              </div>
            </article>

            <article className="fp-card fp-cta-card fp-stack-md">
              <div className="fp-stack-sm">
                <h2 className="fp-headline-md" style={{ margin: 0 }}>
                  Nuevo Certificado
                </h2>
                <p className="fp-body-sm" style={{ margin: 0, opacity: 0.9 }}>
                  Sube y valida tu ultima credencial para compartirla en tu red.
                </p>
              </div>
              <Link className="fp-button fp-button--ghost" href="/frontend/subir-certificado">
                <MaterialIcon>upload</MaterialIcon>
                Subir ahora
              </Link>
            </article>
          </section>

          <section className="fp-stack-md" style={{ marginTop: "1rem" }}>
            <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MaterialIcon>history</MaterialIcon>
              Últimos certificados
            </h2>
            
            {certificates.length === 0 ? (
              <div className="fp-alert">
                <MaterialIcon>info</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  Aún no tienes certificados subidos.
                </p>
              </div>
            ) : (
              <div className="fp-certificates-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                {certificates.slice(0, 3).map((cert) => (
                  <article key={cert.id_certificado} className="fp-cert-card" style={{ borderColor: cert.color ?? undefined }}>
                    <div className="fp-cert-card__image" style={{ backgroundColor: cert.color ? `${cert.color}22` : undefined }}>
                      <MaterialIcon className="fp-cert-card__image-icon" style={{ color: cert.color ?? undefined }}>workspace_premium</MaterialIcon>
                    </div>
                    <div className="fp-cert-card__content">
                      <h3 className="fp-headline-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                        {cert.titulo_certificado}
                      </h3>
                      <div className="fp-cert-card__meta fp-body-sm">
                        <MaterialIcon style={{ fontSize: "1.1rem" }}>account_balance</MaterialIcon>
                        <span>{cert.entidad}</span>
                      </div>
                      <div className="fp-cert-card__meta fp-body-sm">
                        <MaterialIcon style={{ fontSize: "1.1rem" }}>schedule</MaterialIcon>
                        <span>{cert.duracion_horas} Horas</span>
                      </div>
                      <div className="fp-cert-card__actions">
                        <Link href="/frontend/mis-certificados" className="fp-button fp-button--secondary fp-button--full">
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <FrontendFooter />
      </main>
    </section>
  );
}
