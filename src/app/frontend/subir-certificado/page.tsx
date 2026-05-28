"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";

import { me } from "@/lib/api/auth";
import { createCertificate } from "@/lib/api/certificados";
import { ApiError } from "@/lib/api/http";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

// Importación directa del estilo de la vista, siguiendo el patrón del proyecto
import "./page.css";

export default function SubirCertificadoPage() {
  const [userName, setUserName] = useState("Usuario");
  const [formData, setFormData] = useState({
    entidad: "",
    tema: "",
    descripcion: "",
    tipo_certificado: "",
    horas: "",
    color: "#4f46e5", // Default color
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    me()
      .then((profile) => setUserName(profile.nombre_completo || "Usuario"))
      .catch(() => setUserName("Usuario"));
  }, []);

  // Manejador para los campos de texto obligatorios
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manejador y validador del archivo adjunto (Reglas de Negocio)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccess(false);
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    // 1. Validar que sea un formato PDF obligatoriamente
    if (selectedFile.type !== "application/pdf") {
      setError("El archivo seleccionado debe ser un documento en formato PDF.");
      setFile(null);
      return;
    }

    // 2. Validar tamaño máximo (<= 1 MB)
    const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1,048,576 bytes
    if (selectedFile.size > MAX_SIZE_BYTES) {
      setError("El archivo supera el límite permitido de 1 MB. Por favor, optimízalo.");
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // 3. Verificación manual estricta de todos los campos obligatorios
    if (!formData.entidad || !formData.horas || !file) {
      setError("Todos los campos marcados con asterisco (*) son completamente obligatorios.");
      return;
    }

    setIsUploading(true);

    try {
      const payload = new FormData();
      payload.append("entidad", formData.entidad);
      payload.append("tema", formData.tema);
      payload.append("descripcion", formData.descripcion);
      payload.append("tipo_certificado", formData.tipo_certificado);
      payload.append("horas", formData.horas);
      payload.append("color", formData.color);
      payload.append("archivo", file);
      payload.append("visibilidad", "publico");

      await createCertificate(payload);

      setSuccess(true);
      // Limpieza del formulario tras éxito
      setFormData({ entidad: "", tema: "", descripcion: "", tipo_certificado: "", horas: "", color: "#4f46e5" });
      setFile(null);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Ocurrió un error inesperado al procesar el certificado. Inténtalo de nuevo.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="credentials"
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
              Emitir Certificado
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: 0 }}>
              Carga y registra un nuevo respaldo académico en la plataforma para habilitar su posterior consulta por QR.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="fp-two-column" style={{ maxWidth: "72rem", margin: "0 auto", width: "100%" }}>

            {/* Columna Izquierda: Campos del Formulario */}
            <article className="fp-card fp-card--panel fp-stack-lg">
              <h2 className="fp-headline-md" style={{ margin: 0 }}>Datos de la Certificación</h2>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="entidad">
                  Entidad / Plataforma de Expedición *
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon"><MaterialIcon>account_balance</MaterialIcon></span>
                  <input
                    type="text"
                    id="entidad"
                    name="entidad"
                    value={formData.entidad}
                    onChange={handleInputChange}
                    placeholder="Ej. Coursera, Udemy, Universidad XYZ"
                    className="fp-input"
                    required
                  />
                </div>
              </div>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="tema">
                  Tema
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon"><MaterialIcon>category</MaterialIcon></span>
                  <input
                    type="text"
                    id="tema"
                    name="tema"
                    value={formData.tema}
                    onChange={handleInputChange}
                    placeholder="Ej. Desarrollo Web, Marketing"
                    className="fp-input"
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="descripcion">
                  Descripción
                </label>
                <div className="fp-input-wrap" style={{ alignItems: "flex-start" }}>
                  <span className="fp-input-icon" style={{ marginTop: "0.5rem" }}><MaterialIcon>description</MaterialIcon></span>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={(e: any) => handleInputChange(e)}
                    placeholder="Breve descripción del curso..."
                    className="fp-input"
                    style={{ minHeight: "80px", resize: "vertical" }}
                    maxLength={300}
                  />
                </div>
              </div>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="tipo_certificado">
                  Tipo de certificado
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon"><MaterialIcon>school</MaterialIcon></span>
                  <select
                    id="tipo_certificado"
                    name="tipo_certificado"
                    value={formData.tipo_certificado}
                    onChange={(e: any) => handleInputChange(e)}
                    className="fp-input"
                  >
                    <option value="" disabled>Selecciona un tipo</option>
                    <option value="Masterclass">Masterclass</option>
                    <option value="Jornadas">Jornadas</option>
                    <option value="Curso introductorio">Curso introductorio</option>
                    <option value="Curso especializado">Curso especializado</option>
                    <option value="Diplomado">Diplomado</option>
                  </select>
                </div>
              </div>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="horas">
                  Cantidad de Horas *
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon"><MaterialIcon>schedule</MaterialIcon></span>
                  <input
                    type="number"
                    id="horas"
                    name="horas"
                    value={formData.horas}
                    onChange={handleInputChange}
                    placeholder="Ej. 40"
                    className="fp-input"
                    required
                    min="1"
                  />
                </div>
              </div>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="color">
                  Color (Personalizable)
                </label>
                <div className="fp-input-wrap" style={{ padding: "0.25rem 0.5rem" }}>
                  <input
                    type="color"
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="fp-input"
                    style={{ height: "40px", padding: "0", cursor: "pointer", border: "none" }}
                  />
                </div>
              </div>
            </article>

            {/* Columna Derecha: Dropzone y Alertas */}
            <div className="fp-stack-lg">
              <article className="fp-card fp-card--panel fp-upload-box fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0 }}>Documento Digital</h2>

                <div className={`fp-dropzone ${file ? "is-filled" : ""}`}>
                  <input
                    type="file"
                    id="archivo"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="fp-dropzone__input"
                    required={!file}
                  />
                  <div className="fp-dropzone__content fp-stack-sm">
                    <MaterialIcon className="fp-dropzone__icon">
                      {file ? "picture_as_pdf" : "upload_file"}
                    </MaterialIcon>
                    <span className="fp-label-md">
                      {file ? file.name : "Haz clic o arrastra tu PDF aquí"}
                    </span>
                    <span className="fp-body-sm fp-muted">
                      {file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : "Límite máximo por archivo: 1 MB"}
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="fp-alert fp-alert--error">
                    <MaterialIcon>error_outline</MaterialIcon>
                    <p className="fp-body-sm" style={{ margin: 0 }}>{error}</p>
                  </div>
                )}

                {success && (
                  <div className="fp-alert fp-alert--success">
                    <MaterialIcon>check_circle_outline</MaterialIcon>
                    <p className="fp-body-sm" style={{ margin: 0 }}>
                      ¡Certificado registrado exitosamente en la plataforma!
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isUploading}
                  className="fp-button fp-button--primary fp-button--full"
                  style={{ marginTop: "0.5rem" }}
                >
                  <MaterialIcon>{isUploading ? "hourglass_empty" : "cloud_done"}</MaterialIcon>
                  {isUploading ? "Procesando..." : "Emitir y Publicar"}
                </button>
              </article>

              <article className="fp-alert">
                <MaterialIcon style={{ color: "var(--fp-primary)" }}>info</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  Al registrar este certificado, se generarán automáticamente metadatos encriptados accesibles por el código QR de perfil.
                </p>
              </article>
            </div>

          </form>
        </div>

        <FrontendFooter />
      </main>
    </section>
  );
}
