"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

import { me, type AuthProfile } from "@/lib/api/auth";
import {
  listCertificates,
  deleteCertificate,
  getCertificate,
  updateCertificate,
  type CertificateDto,
} from "@/lib/api/certificados";
import { showErrorToast, showSuccessToast } from "@/lib/ui/toast";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";
import { FrontendFooter } from "../_components/footer";
import "../page.css";

interface CertificateExtended extends CertificateDto {
  tema?: string;
  tipo_certificado?: string;
  color?: string;
}

export default function MisCertificadosPage() {
  const [certificates, setCertificates] = useState<CertificateExtended[]>([]);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    entidad: "",
    tema: "",
    tipo_certificado: "",
    horas: "",
  });
  
  const [selectedCert, setSelectedCert] = useState<CertificateExtended | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  useEffect(() => {
    let isMounted = true;

    Promise.all([listCertificates(), me()])
      .then(([certificateData, profileData]) => {
        if (!isMounted) return;
        setCertificates(certificateData as CertificateExtended[]);
        setProfile(profileData);
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

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchEntidad = cert.entidad.toLowerCase().includes(filters.entidad.toLowerCase());
    const matchTema = (cert.tema || "").toLowerCase().includes(filters.tema.toLowerCase());
    const matchTipo = (cert.tipo_certificado || "").toLowerCase().includes(filters.tipo_certificado.toLowerCase());
    const matchHoras = filters.horas ? cert.duracion_horas.toString() === filters.horas : true;
    return matchEntidad && matchTema && matchTipo && matchHoras;
  });

  const handleSelectCertificate = async (cert: CertificateExtended) => {
    setSelectedCert(cert);
    setShowDeleteConfirm(false);
    setDetailsError("");
    setIsEditing(false);

    try {
      const fullCertificate = await getCertificate(cert.id_certificado);
      setSelectedCert(fullCertificate as CertificateExtended);
    } catch {
      setDetailsError("No se pudo cargar el PDF firmado del certificado.");
    }
  };

  const closeDetailsModal = () => {
    setSelectedCert(null);
    setShowDeleteConfirm(false);
    setDetailsError("");
    setIsEditing(false);
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedCert) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSavingEdit(true);
    setDetailsError("");

    try {
      const updatedCertificate = await updateCertificate(selectedCert.id_certificado, {
        titulo_certificado: String(formData.get("titulo_certificado") ?? ""),
        entidad: String(formData.get("entidad") ?? ""),
        descripcion: String(formData.get("descripcion") ?? ""),
        tema: String(formData.get("tema") ?? ""),
        tipo_certificado: String(formData.get("tipo_certificado") ?? ""),
        duracion_horas: Number(formData.get("duracion_horas") ?? selectedCert.duracion_horas),
        fecha_emision: String(formData.get("fecha_emision") ?? ""),
        visibilidad:
          formData.get("visibilidad") === "privado" ? "privado" : "publico",
        color: String(formData.get("color") ?? ""),
      });

      setCertificates((prev) =>
        prev.map((cert) =>
          cert.id_certificado === updatedCertificate.id_certificado
            ? (updatedCertificate as CertificateExtended)
            : cert,
        ),
      );
      setSelectedCert(updatedCertificate as CertificateExtended);
      setIsEditing(false);
      showSuccessToast("Certificado actualizado correctamente.");
    } catch {
      showErrorToast("No se pudo actualizar el certificado.");
    } finally {
      setIsSavingEdit(false);
    }
  };

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
            <Link className="fp-sidebar__link fp-label-md" href="/ayuda?from=/mis-certificados">
              <MaterialIcon>support_agent</MaterialIcon>
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

          <div className="fp-certificates-layout">
            <div className="fp-certificates-grid-container">
              <div className="fp-certificates-grid">
                {filteredCertificates.map((cert) => (
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
                      <div className="fp-cert-card__meta fp-body-sm">
                        <MaterialIcon style={{ fontSize: "1.1rem" }}>event</MaterialIcon>
                        <span>{cert.fecha_display}</span>
                      </div>

                      <div className="fp-cert-card__actions">
                        <button 
                          className="fp-button fp-button--secondary fp-button--full" 
                          type="button"
                          onClick={() => handleSelectCertificate(cert)}
                        >
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {filteredCertificates.length === 0 && certificates.length > 0 && (
                 <p className="fp-body-md fp-muted" style={{ textAlign: "center", padding: "2rem" }}>
                   No se encontraron certificados con los filtros seleccionados.
                 </p>
              )}
            </div>

            <aside className="fp-filters-sidebar fp-card fp-card--panel fp-stack-md">
              <button 
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                className="fp-button fp-button--ghost"
                style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0.5rem" }}
              >
                <h2 className="fp-headline-sm" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MaterialIcon>filter_list</MaterialIcon>
                  Filtros
                </h2>
                <MaterialIcon>{isFiltersOpen ? "expand_less" : "expand_more"}</MaterialIcon>
              </button>
              
              {isFiltersOpen && (
                <div className="fp-stack-md" style={{ marginTop: "1rem", animation: "fp-fade-in 200ms ease-out" }}>
                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="filter-entidad">
                      Entidad / Plataforma
                    </label>
                    <div className="fp-input-wrap">
                      <input
                        type="text"
                        id="filter-entidad"
                        name="entidad"
                        value={filters.entidad}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por entidad..."
                        className="fp-input"
                      />
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="filter-tema">
                      Tema
                    </label>
                    <div className="fp-input-wrap">
                      <input
                        type="text"
                        id="filter-tema"
                        name="tema"
                        value={filters.tema}
                        onChange={handleFilterChange}
                        placeholder="Filtrar por tema..."
                        className="fp-input"
                      />
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="filter-tipo">
                      Tipo de certificado
                    </label>
                    <div className="fp-input-wrap">
                      <select
                        id="filter-tipo"
                        name="tipo_certificado"
                        value={filters.tipo_certificado}
                        onChange={handleFilterChange}
                        className="fp-input"
                      >
                        <option value="">Todos los tipos</option>
                        <option value="Masterclass">Masterclass</option>
                        <option value="Jornadas">Jornadas</option>
                        <option value="Curso introductorio">Curso introductorio</option>
                        <option value="Curso especializado">Curso especializado</option>
                        <option value="Diplomado">Diplomado</option>
                      </select>
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="filter-horas">
                      Cantidad de Horas
                    </label>
                    <div className="fp-input-wrap">
                      <input
                        type="number"
                        id="filter-horas"
                        name="horas"
                        value={filters.horas}
                        onChange={handleFilterChange}
                        placeholder="Horas exactas..."
                        className="fp-input"
                        min="1"
                      />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    className="fp-button fp-button--secondary"
                    onClick={() => setFilters({ entidad: "", tema: "", tipo_certificado: "", horas: "" })}
                    style={{ marginTop: "1rem", width: "100%" }}
                  >
                    Limpiar Filtros
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>

        <FrontendFooter />
      </main>

      {/* Modal Detalles del Certificado */}
      {selectedCert && (
        <div className="fp-modal-overlay" onClick={closeDetailsModal}>
          <div 
            className="fp-modal-content fp-stack-md" 
            onClick={(e) => e.stopPropagation()}
            style={{ borderTop: `6px solid ${selectedCert.color || 'var(--fp-primary)'}` }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h2 className="fp-headline-md" style={{ margin: 0 }}>
                {showDeleteConfirm
                  ? "Eliminar Certificado"
                  : isEditing
                    ? "Editar Certificado"
                    : "Detalles del Certificado"}
              </h2>
              <button 
                className="fp-modal-close" 
                onClick={closeDetailsModal}
                style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--fp-on-surface-variant)" }}
              >
                <MaterialIcon>close</MaterialIcon>
              </button>
            </div>
            
            {showDeleteConfirm ? (
              <div className="fp-stack-md" style={{ marginTop: "1rem" }}>
                <div className="fp-alert fp-alert--error" style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                  <MaterialIcon style={{ color: "var(--fp-error)" }}>warning</MaterialIcon>
                  <p className="fp-body-md" style={{ margin: 0 }}>
                    ¿Desea eliminar este certificado? Al hacerlo tendra que volver a subirlo si lo desea ver en este panel
                  </p>
                </div>
                {detailsError && (
                  <div className="fp-alert fp-alert--warning">
                    <MaterialIcon>warning</MaterialIcon>
                    <p className="fp-body-sm" style={{ margin: 0 }}>{detailsError}</p>
                  </div>
                )}
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", justifyContent: "flex-end" }}>
                  <button 
                    className="fp-button fp-button--secondary" 
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="fp-button" 
                    style={{ background: "var(--fp-error)", color: "white" }}
                    onClick={async () => {
                      try {
                        await deleteCertificate(selectedCert.id_certificado);
                        setCertificates(prev => prev.filter(c => c.id_certificado !== selectedCert.id_certificado));
                        setSelectedCert(null);
                        setShowDeleteConfirm(false);
                        setIsEditing(false);
                        showSuccessToast("Certificado eliminado correctamente.");
                      } catch (err) {
                        console.error("Error deleting certificate", err);
                        showErrorToast("No se pudo eliminar el certificado.");
                      }
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ) : isEditing ? (
              <form className="fp-stack-md" onSubmit={handleEditSubmit} style={{ marginTop: "1rem" }}>
                <div className="fp-edit-form__grid">
                  <div className="fp-field fp-edit-form__full">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-titulo">
                      Titulo del certificado
                    </label>
                    <div className="fp-input-wrap">
                      <input
                        id="edit-titulo"
                        name="titulo_certificado"
                        className="fp-input"
                        defaultValue={selectedCert.titulo_certificado}
                        maxLength={300}
                        required
                      />
                    </div>
                  </div>

                  <div className="fp-field fp-edit-form__full">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-entidad">
                      Entidad / Plataforma
                    </label>
                    <div className="fp-input-wrap">
                      <input
                        id="edit-entidad"
                        name="entidad"
                        className="fp-input"
                        defaultValue={selectedCert.entidad}
                        maxLength={200}
                        required
                      />
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-tema">
                      Tema
                    </label>
                    <div className="fp-input-wrap">
                      <input
                        id="edit-tema"
                        name="tema"
                        className="fp-input"
                        defaultValue={selectedCert.tema ?? ""}
                        maxLength={100}
                      />
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-tipo">
                      Tipo de certificado
                    </label>
                    <div className="fp-input-wrap">
                      <select
                        id="edit-tipo"
                        name="tipo_certificado"
                        className="fp-input"
                        defaultValue={selectedCert.tipo_certificado ?? ""}
                      >
                        <option value="">Sin especificar</option>
                        <option value="Masterclass">Masterclass</option>
                        <option value="Jornadas">Jornadas</option>
                        <option value="Curso introductorio">Curso introductorio</option>
                        <option value="Curso especializado">Curso especializado</option>
                        <option value="Diplomado">Diplomado</option>
                      </select>
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-horas">
                      Cantidad de horas
                    </label>
                    <div className="fp-input-wrap">
                      <input
                        id="edit-horas"
                        name="duracion_horas"
                        type="number"
                        className="fp-input"
                        defaultValue={selectedCert.duracion_horas}
                        min={1}
                        required
                      />
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-fecha">
                      Fecha de emision
                    </label>
                    <div className="fp-input-wrap">
                      <input
                        id="edit-fecha"
                        name="fecha_emision"
                        type="date"
                        className="fp-input"
                        defaultValue={selectedCert.fecha_emision ?? ""}
                        max={new Date().toISOString().slice(0, 10)}
                      />
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-visibilidad">
                      Visibilidad
                    </label>
                    <div className="fp-input-wrap">
                      <select
                        id="edit-visibilidad"
                        name="visibilidad"
                        className="fp-input"
                        defaultValue={selectedCert.visibilidad}
                      >
                        <option value="publico">Publico</option>
                        <option value="privado">Privado</option>
                      </select>
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-color">
                      Color
                    </label>
                    <div className="fp-input-wrap fp-color-input-wrap">
                      <input
                        id="edit-color"
                        name="color"
                        type="color"
                        className="fp-input fp-color-input"
                        defaultValue={selectedCert.color ?? "#6366F1"}
                      />
                    </div>
                  </div>

                  <div className="fp-field fp-edit-form__full">
                    <label className="fp-field__label fp-label-sm" htmlFor="edit-descripcion">
                      Descripcion
                    </label>
                    <div className="fp-input-wrap">
                      <textarea
                        id="edit-descripcion"
                        name="descripcion"
                        className="fp-input"
                        defaultValue={selectedCert.descripcion ?? ""}
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                {detailsError && (
                  <div className="fp-alert fp-alert--warning">
                    <MaterialIcon>warning</MaterialIcon>
                    <p className="fp-body-sm" style={{ margin: 0 }}>{detailsError}</p>
                  </div>
                )}

                <div className="fp-modal-actions">
                  <button
                    className="fp-button fp-button--secondary"
                    type="button"
                    disabled={isSavingEdit}
                    onClick={() => {
                      setIsEditing(false);
                      setDetailsError("");
                    }}
                  >
                    Cancelar
                  </button>
                  <button className="fp-button fp-button--primary" type="submit" disabled={isSavingEdit}>
                    {isSavingEdit ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="fp-stack-sm" style={{ marginTop: "1rem" }}>
                  <div>
                    <span className="fp-label-sm fp-muted">Entidad / Plataforma de Expedición</span>
                    <p className="fp-body-md" style={{ margin: 0 }}>{selectedCert.entidad}</p>
                  </div>
                  <div>
                    <span className="fp-label-sm fp-muted">Tema</span>
                    <p className="fp-body-md" style={{ margin: 0 }}>{selectedCert.tema || "No especificado"}</p>
                  </div>
                  <div>
                    <span className="fp-label-sm fp-muted">Descripción</span>
                    <p className="fp-body-md" style={{ margin: 0 }}>{selectedCert.descripcion || "Sin descripción"}</p>
                  </div>
                  <div>
                    <span className="fp-label-sm fp-muted">Tipo de certificado</span>
                    <p className="fp-body-md" style={{ margin: 0 }}>{selectedCert.tipo_certificado || "No especificado"}</p>
                  </div>
                  <div>
                    <span className="fp-label-sm fp-muted">Cantidad de Horas</span>
                    <p className="fp-body-md" style={{ margin: 0 }}>{selectedCert.duracion_horas} Horas</p>
                  </div>
                  <div>
                    <span className="fp-label-sm fp-muted">Fecha de emision</span>
                    <p className="fp-body-md" style={{ margin: 0 }}>{selectedCert.fecha_display}</p>
                  </div>
                  <div>
                    <span className="fp-label-sm fp-muted">Visibilidad</span>
                    <p className="fp-body-md" style={{ margin: 0 }}>
                      {selectedCert.visibilidad === "publico" ? "Publico" : "Privado"}
                    </p>
                  </div>
                  <div>
                    <span className="fp-label-sm fp-muted">Color Seleccionado</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                      <div style={{ 
                        width: "24px", 
                        height: "24px", 
                        borderRadius: "50%", 
                        backgroundColor: selectedCert.color || "var(--fp-primary)",
                        border: "1px solid var(--fp-outline-variant)"
                      }}></div>
                      <span className="fp-body-sm">{selectedCert.color || "Por defecto"}</span>
                    </div>
                  </div>
                </div>

                {detailsError && (
                  <div className="fp-alert fp-alert--warning" style={{ marginTop: "1rem" }}>
                    <MaterialIcon>warning</MaterialIcon>
                    <p className="fp-body-sm" style={{ margin: 0 }}>{detailsError}</p>
                  </div>
                )}
                
                <div className="fp-modal-actions">
                  {selectedCert.archivo?.url_firmada && (
                    <a
                      className="fp-button fp-button--secondary"
                      href={selectedCert.archivo.url_firmada}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MaterialIcon>picture_as_pdf</MaterialIcon>
                      Ver PDF
                    </a>
                  )}
                  <button
                    className="fp-button fp-button--secondary"
                    type="button"
                    onClick={() => {
                      setIsEditing(true);
                      setDetailsError("");
                    }}
                  >
                    <MaterialIcon>edit</MaterialIcon>
                    Editar
                  </button>
                  <button
                    className="fp-button fp-button--ghost"
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    style={{ color: "var(--fp-error)" }}
                  >
                    <MaterialIcon>delete</MaterialIcon>
                    Borrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

