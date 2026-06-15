"use client";

import { useState, useMemo } from "react";
import { MaterialIcon } from "@/app/frontend/_components/material-icon";
import { PublicCertificateCard } from "./public-certificate-card";
import { Award, Clock, X, ChevronDown } from "lucide-react";

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

const RELATION_MAP = [
  { type: "Masterclass", hours: "1-3 horas", min: 1, max: 3 },
  { type: "Jornadas", hours: "4-10 horas", min: 4, max: 10 },
  { type: "Curso Introductorio", hours: "10-48 horas", min: 10, max: 48 },
  { type: "Curso especializado", hours: "48-120 horas", min: 48, max: 120 },
  { type: "Diplomado", hours: "120-240 horas.", min: 120, max: 240 },
  { type: "Bootcamp", hours: "240-480+ horas.", min: 240, max: Infinity },
];

export function PublicCertificatesGrid({ certificados }: { certificados: CertificateProp[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<string>("");
  const itemsPerPage = 3;

  // Connected filters options
  const hoursOptions = useMemo(() => {
    if (selectedType) {
      const match = RELATION_MAP.find(r => r.type.toLowerCase() === selectedType.toLowerCase());
      return match ? [match.hours] : [];
    }
    return RELATION_MAP.map(r => r.hours);
  }, [selectedType]);

  const typeOptions = useMemo(() => {
    if (selectedHours) {
      const match = RELATION_MAP.find(r => r.hours === selectedHours);
      return match ? [match.type] : [];
    }
    return RELATION_MAP.map(r => r.type);
  }, [selectedHours]);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedType(value);

    if (value) {
      const match = RELATION_MAP.find(r => r.type.toLowerCase() === value.toLowerCase());
      if (match) {
        setSelectedHours(match.hours);
      }
    } else {
      setSelectedHours("");
    }
    setCurrentPage(1);
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedHours(value);

    if (value) {
      const match = RELATION_MAP.find(r => r.hours === value);
      if (match) {
        setSelectedType(match.type);
      }
    } else {
      setSelectedType("");
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedType("");
    setSelectedHours("");
    setCurrentPage(1);
  };

  // Filter certificados
  const filteredCertificados = useMemo(() => {
    return certificados.filter((cert) => {
      // 1. Filter by Type (case-insensitive)
      if (selectedType) {
        const certTypeNormalized = cert.tipo_certificado?.trim().toLowerCase();
        const selectedTypeNormalized = selectedType.trim().toLowerCase();
        if (certTypeNormalized !== selectedTypeNormalized) {
          return false;
        }
      }

      // 2. Filter by Hours range
      if (selectedHours) {
        const relation = RELATION_MAP.find(r => r.hours === selectedHours);
        if (relation) {
          const hoursVal = cert.duracion_horas;
          if (hoursVal < relation.min || hoursVal > relation.max) {
            return false;
          }
        }
      }

      return true;
    });
  }, [certificados, selectedType, selectedHours]);

  // Handle empty state at first load (before filtering)
  if (certificados.length === 0) {
    return (
      <div className="fp-stack-lg">
        <h2 className="fp-headline-md" style={{ margin: 0 }}>
          Certificados Públicos
        </h2>
        <div className="fp-alert">
          <MaterialIcon>info</MaterialIcon>
          <p className="fp-body-sm" style={{ margin: 0 }}>
            Este perfil aún no tiene certificados públicos.
          </p>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(filteredCertificados.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCertificates = filteredCertificados.slice(startIndex, startIndex + itemsPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="fp-stack-lg">
      {/* Header card area with title on left and connected filters on right */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
        width: "100%"
      }}>
        <h2 className="fp-headline-md" style={{ margin: 0 }}>
          Certificados Públicos
        </h2>

        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}>
          {/* Select Tipo de certificado */}
          <div className="fp-input-wrap" style={{ position: "relative", flex: "1 1 auto", minWidth: "280px" }}>
            <span className="fp-input-icon" style={{ display: "flex", alignItems: "center", top: "50%", transform: "translateY(-50%)" }}>
              <Award size={18} strokeWidth={1.8} style={{ color: "var(--fp-outline)" }} />
            </span>
            <select
              value={selectedType}
              onChange={handleTypeChange}
              className="fp-input"
              style={{
                appearance: "none",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                paddingLeft: "3.75rem",
                paddingRight: "3rem",
                height: "3.25rem",
                borderRadius: "999px",
                fontSize: "0.875rem",
                width: "100%",
                cursor: "pointer",
                backgroundColor: "color-mix(in srgb, var(--fp-surface-bright) 90%, transparent)",
                border: "1px solid color-mix(in srgb, var(--fp-outline-variant) 78%, transparent)",
                color: "var(--fp-on-surface)",
                fontWeight: 500,
              }}
            >
              <option value="">Tipo de certificado</option>
              {typeOptions.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center" }}>
              <ChevronDown size={18} strokeWidth={1.8} style={{ color: "var(--fp-outline)" }} />
            </span>
          </div>

          {/* Select Horas */}
          <div className="fp-input-wrap" style={{ position: "relative", flex: "1 1 auto", minWidth: "220px" }}>
            <span className="fp-input-icon" style={{ display: "flex", alignItems: "center", top: "50%", transform: "translateY(-50%)" }}>
              <Clock size={18} strokeWidth={1.8} style={{ color: "var(--fp-outline)" }} />
            </span>
            <select
              value={selectedHours}
              onChange={handleHoursChange}
              className="fp-input"
              style={{
                appearance: "none",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                paddingLeft: "2.75rem",
                paddingRight: "3rem",
                height: "3.25rem",
                borderRadius: "999px",
                fontSize: "0.875rem",
                width: "100%",
                cursor: "pointer",
                backgroundColor: "color-mix(in srgb, var(--fp-surface-bright) 90%, transparent)",
                border: "1px solid color-mix(in srgb, var(--fp-outline-variant) 78%, transparent)",
                color: "var(--fp-on-surface)",
                fontWeight: 500,
              }}
            >
              <option value="">Cantidad de horas</option>
              {hoursOptions.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
            <span style={{ position: "absolute", right: "1.25rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", display: "flex", alignItems: "center" }}>
              <ChevronDown size={18} strokeWidth={1.8} style={{ color: "var(--fp-outline)" }} />
            </span>
          </div>

          {/* Botón de limpiar filtros */}
          {(selectedType || selectedHours) && (
            <button
              onClick={clearFilters}
              className="fp-button fp-button--ghost"
              style={{
                padding: "0 1.25rem",
                height: "2.75rem",
                minHeight: "2.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.875rem",
                borderRadius: "999px",
                border: "1px solid color-mix(in srgb, var(--fp-outline-variant) 76%, transparent)",
                backgroundColor: "transparent",
                color: "var(--fp-on-surface)",
                cursor: "pointer",
                fontWeight: 600,
                transition: "background-color 160ms ease, transform 160ms ease"
              }}
              title="Limpiar filtros"
            >
              <X size={16} />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid displaying certificates */}
      {filteredCertificados.length > 0 ? (
        <div className="fp-certificates-grid">
          {currentCertificates.map((certificado) => (
            <PublicCertificateCard key={certificado.id_certificado} certificado={certificado} />
          ))}
        </div>
      ) : (
        <div style={{
          padding: "3rem 2rem",
          textAlign: "center",
          border: "1px dashed color-mix(in srgb, var(--fp-outline-variant) 50%, transparent)",
          borderRadius: "var(--fp-radius-xl)",
          background: "color-mix(in srgb, var(--fp-surface-container-low) 30%, transparent)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem"
        }}>
          <MaterialIcon style={{ fontSize: "3rem", color: "var(--fp-outline)" }}>filter_list_off</MaterialIcon>
          <div className="fp-stack-xs">
            <p className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
              Sin coincidencias
            </p>
            <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
              No se encontraron certificados públicos que coincidan con los filtros seleccionados.
            </p>
          </div>
          <button
            onClick={clearFilters}
            className="fp-button fp-button--secondary"
            style={{ padding: "0.5rem 1.25rem", height: "2.5rem", minHeight: "2.5rem" }}
          >
            <X size={16} />
            <span>Limpiar filtros</span>
          </button>
        </div>
      )}

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
            Página {currentPage} de {totalPages}
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
