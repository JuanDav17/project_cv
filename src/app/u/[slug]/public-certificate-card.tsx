"use client";

import { useState } from "react";
import { MaterialIcon } from "@/app/frontend/_components/material-icon";

type CertificateProp = {
  id_certificado: string;
  titulo_certificado: string;
  descripcion?: string | null;
  tema?: string | null;
  tipo_certificado?: string | null;
  entidad: string;
  duracion_horas: number;
  fecha_display: string;
  archivo?: { url_firmada: string } | null;
};

export function PublicCertificateCard({ certificado }: { certificado: CertificateProp }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <article className="fp-cert-card">
        <div className="fp-cert-card__image">
          <MaterialIcon className="fp-cert-card__image-icon">workspace_premium</MaterialIcon>
        </div>
        <div className="fp-cert-card__content">
          <h3 className="fp-headline-md" style={{ margin: 0 }}>
            {certificado.titulo_certificado}
          </h3>
          <div className="fp-cert-card__meta fp-body-sm">
            <MaterialIcon>account_balance</MaterialIcon>
            <span>{certificado.entidad}</span>
          </div>
          <div className="fp-cert-card__meta fp-body-sm">
            <MaterialIcon>schedule</MaterialIcon>
            <span>{certificado.duracion_horas} Horas</span>
          </div>
          <div className="fp-cert-card__meta fp-body-sm">
            <MaterialIcon>event</MaterialIcon>
            <span>{certificado.fecha_display}</span>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button
              className="fp-button fp-button--primary"
              style={{ flex: 1, padding: "0.5rem", display: "flex", justifyContent: "center" }}
              onClick={() => setShowInfo(true)}
            >
              <MaterialIcon>info</MaterialIcon>
              Información
            </button>
            {certificado.archivo?.url_firmada && (
              <a
                className="fp-button fp-button--secondary"
                style={{ flex: 1, padding: "0.5rem", display: "flex", justifyContent: "center" }}
                href={certificado.archivo.url_firmada}
                rel="noreferrer"
                target="_blank"
              >
                <MaterialIcon>picture_as_pdf</MaterialIcon>
                Ver PDF
              </a>
            )}
          </div>
        </div>
      </article>

      {/* Modal for Información */}
      {showInfo && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "transparent",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}>
          <article 
            className="fp-card fp-card--panel fp-stack-md" 
            style={{ 
              width: "100%", 
              maxWidth: "500px", 
              maxHeight: "90vh", 
              overflowY: "auto",
              backgroundColor: "var(--fp-surface)",
              color: "var(--fp-on-surface)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              border: "1px solid var(--fp-border)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MaterialIcon style={{ color: "var(--fp-primary)" }}>info</MaterialIcon>
                Detalles del Certificado
              </h2>
              <button 
                onClick={() => setShowInfo(false)} 
                style={{ 
                  background: "none", 
                  border: "none", 
                  cursor: "pointer", 
                  color: "var(--fp-muted)", 
                  padding: "0.25rem", 
                  display: "flex",
                  borderRadius: "50%",
                  transition: "background-color 0.2s"
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "var(--fp-surface-hover)"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <MaterialIcon>close</MaterialIcon>
              </button>
            </div>
            
            <div className="fp-divider" />

            <div className="fp-stack-sm">
              <h3 className="fp-label-md" style={{ color: "var(--fp-muted)", margin: 0 }}>Entidad / Plataforma de Expedición</h3>
              <p className="fp-body-md" style={{ margin: 0 }}>{certificado.entidad}</p>
            </div>
            
            <div className="fp-stack-sm">
              <h3 className="fp-label-md" style={{ color: "var(--fp-muted)", margin: 0 }}>Tema</h3>
              <p className="fp-body-md" style={{ margin: 0 }}>{certificado.tema || "No especificado"}</p>
            </div>

            <div className="fp-stack-sm">
              <h3 className="fp-label-md" style={{ color: "var(--fp-muted)", margin: 0 }}>Tipo de certificado</h3>
              <p className="fp-body-md" style={{ margin: 0 }}>{certificado.tipo_certificado || "No especificado"}</p>
            </div>

            <div className="fp-stack-sm">
              <h3 className="fp-label-md" style={{ color: "var(--fp-muted)", margin: 0 }}>Cantidad de Horas</h3>
              <p className="fp-body-md" style={{ margin: 0 }}>{certificado.duracion_horas} Horas</p>
            </div>

            <div className="fp-stack-sm">
              <h3 className="fp-label-md" style={{ color: "var(--fp-muted)", margin: 0 }}>Descripción</h3>
              <p className="fp-body-md" style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: "1.5" }}>
                {certificado.descripcion || "Sin descripción adicional"}
              </p>
            </div>

          </article>
        </div>
      )}
    </>
  );
}
