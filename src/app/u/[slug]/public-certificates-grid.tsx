"use client";

import { useState } from "react";
import { MaterialIcon } from "@/app/frontend/_components/material-icon";
import { PublicCertificateCard } from "./public-certificate-card";

type CertificateProp = {
  id_certificado: string;
  titulo_certificado: string;
  descripcion?: string | null;
  tema?: string | null;
  tipo_certificado?: string | null;
  entidad: string;
  duracion_horas: number;
  fecha_display: string;
  archivo?: { url_firmada?: string } | null;
};

export function PublicCertificatesGrid({ certificados }: { certificados: CertificateProp[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const totalPages = Math.max(1, Math.ceil(certificados.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCertificates = certificados.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="fp-stack-lg">
      <div className="fp-certificates-grid">
        {currentCertificates.map((certificado) => (
          <PublicCertificateCard key={certificado.id_certificado} certificado={certificado} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="fp-button fp-button--ghost fp-button--icon"
            style={{ 
              opacity: currentPage === 1 ? 0.5 : 1, 
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              padding: "0.5rem"
            }}
            aria-label="Página anterior"
          >
            <MaterialIcon>arrow_back</MaterialIcon>
          </button>
          
          <span className="fp-label-md" style={{ color: "var(--fp-muted)", userSelect: "none" }}>
            Página {currentPage}
          </span>
          
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="fp-button fp-button--ghost fp-button--icon"
            style={{ 
              opacity: currentPage === totalPages ? 0.5 : 1, 
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              padding: "0.5rem"
            }}
            aria-label="Página siguiente"
          >
            <MaterialIcon>arrow_forward</MaterialIcon>
          </button>
        </div>
      )}
    </div>
  );
}
