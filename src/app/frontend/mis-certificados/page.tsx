"use client";

import { useEffect, useState } from "react";

import { me } from "@/lib/api/auth";
import {
  listCertificates,
  type CertificateDto,
} from "@/lib/api/certificados";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";
import "./page.css";

export default function MisCertificadosPage() {
  const [certificates, setCertificates] = useState<CertificateDto[]>([]);
  const [userName, setUserName] = useState("Usuario");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([listCertificates(), me()])
      .then(([certificateData, profile]) => {
        if (!isMounted) return;
        setCertificates(certificateData);
        setUserName(profile.nombre_completo || "Usuario");
      })
      .catch(() => {
        if (isMounted) {
          setError("No se pudieron cargar tus certificados.");
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="my-credentials"
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
                    {userName}
                  </p>
                </div>
              </div>
            </div>
          </>
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
          <header className="fp-section-intro fp-stack-sm">
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Mis Certificados
            </h1>
            <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
              Visualiza y gestiona todos los certificados que has subido a la plataforma.
            </p>
          </header>

          {isLoading && (
            <div className="fp-alert">
              <MaterialIcon>hourglass_empty</MaterialIcon>
              <p className="fp-body-sm" style={{ margin: 0 }}>
                Cargando certificados...
              </p>
            </div>
          )}

          {error && (
            <div className="fp-alert fp-alert--error">
              <MaterialIcon>error_outline</MaterialIcon>
              <p className="fp-body-sm" style={{ margin: 0 }}>
                {error}
              </p>
            </div>
          )}

          {!isLoading && !error && certificates.length === 0 && (
            <div className="fp-alert">
              <MaterialIcon>info</MaterialIcon>
              <p className="fp-body-sm" style={{ margin: 0 }}>
                Aun no has subido certificados.
              </p>
            </div>
          )}

          <div className="fp-certificates-grid">
            {certificates.map((cert) => (
              <article key={cert.id_certificado} className="fp-cert-card">
                <div className="fp-cert-card__image">
                  <MaterialIcon className="fp-cert-card__image-icon">workspace_premium</MaterialIcon>
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
                  <div className="fp-cert-card__meta fp-body-sm">
                    <MaterialIcon style={{ fontSize: "1.1rem" }}>event</MaterialIcon>
                    <span>{cert.fecha_display}</span>
                  </div>

                  <div className="fp-cert-card__actions">
                    <button className="fp-button fp-button--secondary fp-button--full" type="button">
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
    </section>
  );
}
