"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import { getProfile, updateProfile, type ProfileDto } from "@/lib/api/perfil";
import { type InterestArea } from "@/lib/api/areas-interes";
import { ApiError } from "@/lib/api/http";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/lib/ui/toast";
import { Eye, EyeOff } from "lucide-react";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { LucideIconByName } from "../_components/custom-interest-dialog";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

import "./page.css";

/* ─── Helper: icono del área (Material o Lucide) ───────────── */

function AreaIcon({ icon }: { icon: string }) {
  // Mapa de corrección para íconos que no cargan bien en Material Icons
  const iconFixMap: Record<string, string> = {
    "terminal": "Terminal", // usa lucide
    "code": "Code2", // usa lucide
    "design_services": "palette", // material icon más seguro
    "architecture": "domain", // material icon más seguro
    "cloud_sync": "cloud", // material icon más seguro
    "checklist": "list_alt" // material icon más seguro
  };

  const mappedIcon = iconFixMap[icon] || icon;

  const isLucide =
    mappedIcon.charAt(0) === mappedIcon.charAt(0).toUpperCase() &&
    mappedIcon.charAt(0) !== mappedIcon.charAt(0).toLowerCase() &&
    !mappedIcon.includes("_");

  if (isLucide) {
    return <LucideIconByName name={mappedIcon} size={16} />;
  }
  return <MaterialIcon style={{ fontSize: "1rem" }}>{mappedIcon}</MaterialIcon>;
}

/* ─── Página ─────────────────────────────────────────────────── */

export default function MiCuentaPage() {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [interests, setInterests] = useState<InterestArea[]>([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [showTitleModal, setShowTitleModal] = useState(false);
  const [isUpdatingTitle, setIsUpdatingTitle] = useState(false);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        setInterests(p.areas_interes || []);
      })
      .catch(() => setError("No se pudo cargar tu perfil."));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    try {
      const updatedProfile = await updateProfile({
        nombres: String(formData.get("nombres") ?? ""),
        apellidos: String(formData.get("apellidos") ?? ""),
        titulo_profesional: String(formData.get("titulo_profesional") ?? ""),
      });

      setProfile(updatedProfile);
      showSuccessToast("Perfil actualizado correctamente.");
    } catch (requestError) {
      showErrorToast(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo actualizar el perfil.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const repeatPassword = String(formData.get("repeatPassword") ?? "");

    if (!currentPassword) {
      showWarningToast("Debes ingresar tu contrasena actual.");
      return;
    }

    if (newPassword !== repeatPassword) {
      showWarningToast("Las contrasenas nuevas no coinciden.");
      return;
    }

    if (newPassword.length < 8) {
      showWarningToast("La contrasena debe tener al menos 8 caracteres.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data.error?.message ||
            data.message ||
            "No se pudo actualizar la contrasena",
        );
      }

      showSuccessToast("Contrasena actualizada exitosamente.");
      setShowPasswordModal(false);
      event.currentTarget.reset();
    } catch (err: unknown) {
      showErrorToast(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar la contrasena.",
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleUpdateTitle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdatingTitle(true);

    const formData = new FormData(event.currentTarget);
    const newTitle = String(formData.get("newTitle") ?? "").trim();

    if (!newTitle) {
      showWarningToast("El nuevo titulo no puede estar vacio.");
      setIsUpdatingTitle(false);
      return;
    }

    try {
      const updatedProfile = await updateProfile({
        nombres: profile?.nombres ?? "",
        apellidos: profile?.apellidos ?? "",
        titulo_profesional: newTitle,
      });

      setProfile(updatedProfile);
      showSuccessToast("Titulo actualizado exitosamente.");
      setShowTitleModal(false);
    } catch (err: unknown) {
      showErrorToast(
        err instanceof Error ? err.message : "No se pudo actualizar el titulo.",
      );
    } finally {
      setIsUpdatingTitle(false);
    }
  };

  const displayName = profile?.nombre_completo ?? "Usuario";

  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="settings"
        header={
          <>
            <div className="fp-sidebar__section fp-sidebar__section--plain">
              <div className="fp-headline-md" style={{ color: "var(--fp-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MaterialIcon>workspace_premium</MaterialIcon>
                MyCertify
              </div>
            </div>
            <div className="fp-sidebar__section">
              <div className="fp-sidebar__profile fp-sidebar__profile--centered">
                <div className="fp-sidebar__avatar-placeholder fp-sidebar__avatar-placeholder--large">
                  <MaterialIcon>person</MaterialIcon>
                </div>
                <div className="fp-stack-xs" style={{ marginTop: "0.5rem" }}>
                  <p className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                    {displayName}
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
            <Link className="fp-sidebar__link fp-label-md" href="/frontend">
              <MaterialIcon>help</MaterialIcon>
              <span>Centro de Ayuda</span>
            </Link>
          </div>
        }
      />

      <main className="fp-shell-main">
        <MobileBrandHeader>
          <MaterialIcon>menu</MaterialIcon>
        </MobileBrandHeader>

        <div className="fp-shell-content fp-stack-xl">
          <header className="fp-section-intro fp-stack-sm">
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Configuración de la Cuenta
            </h1>
            <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
              Gestiona tu perfil y preferencias de seguridad.
            </p>
          </header>

          {/* ── Layout: 3 secciones ── */}
          <div className="fp-settings-layout">

            {/* Fila superior: Información Personal + Seguridad */}
            <div className="fp-settings-top-row">

              {/* Tarjeta: Información Personal */}
              <article className="fp-card fp-card--panel fp-stack-lg fp-settings-personal">
                <div className="fp-stack-sm">
                  <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <MaterialIcon style={{ color: "var(--fp-primary)" }}>person</MaterialIcon>
                    Información Personal
                  </h2>
                  <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                    Actualiza tus datos básicos de perfil.
                  </p>
                </div>

                <div className="fp-divider" />

                <form key={profile?.id_usuario ?? "loading"} className="fp-stack-lg" onSubmit={handleSubmit}>
                  <div className="fp-grid-two">
                    <div className="fp-field">
                      <label className="fp-field__label fp-label-md" htmlFor="first-name">
                        Nombres
                      </label>
                      <input
                        id="first-name"
                        name="nombres"
                        className="fp-input"
                        defaultValue={profile?.nombres ?? ""}
                        type="text"
                        required
                      />
                    </div>
                    <div className="fp-field">
                      <label className="fp-field__label fp-label-md" htmlFor="last-name">
                        Apellidos
                      </label>
                      <input
                        id="last-name"
                        name="apellidos"
                        className="fp-input"
                        defaultValue={profile?.apellidos ?? ""}
                        type="text"
                        required
                      />
                    </div>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="account-email">
                      Dirección de Correo Electrónico
                    </label>
                    <input
                      id="account-email"
                      className="fp-input"
                      defaultValue={profile?.correo ?? ""}
                      type="email"
                      readOnly
                    />
                    <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                    </p>
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="title">
                      Título Profesional
                    </label>
                    <input
                      id="title"
                      name="titulo_profesional"
                      className="fp-input"
                      value={profile?.titulo_profesional ?? ""}
                      placeholder="Ej. Ingeniero de Software"
                      type="text"
                      readOnly
                    />
                    <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                      ¿Quieres actualizar tu título?{" "}
                      <button
                        type="button"
                        onClick={() => setShowTitleModal(true)}
                        className="fp-link"
                        style={{ background: "none", border: "none", padding: 0, font: "inherit", cursor: "pointer" }}
                      >
                        ¡Hazlo aquí!
                      </button>
                    </p>
                  </div>

                  {error && (
                    <div className="fp-alert fp-alert--error">
                      <MaterialIcon>error_outline</MaterialIcon>
                      <p className="fp-body-sm" style={{ margin: 0 }}>{error}</p>
                    </div>
                  )}

                  <div className="fp-divider" />

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <button type="button" className="fp-button fp-button--ghost" onClick={() => setShowPasswordModal(true)}>
                      <MaterialIcon>lock</MaterialIcon>
                      Actualizar contraseña
                    </button>
                    <button className="fp-button fp-button--primary" type="submit" disabled={isSaving}>
                      {isSaving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              </article>

              {/* Tarjeta: Áreas de Interés (ahora en la fila superior) */}
              <article className="fp-card fp-card--panel fp-stack-lg fp-settings-interests">
                <div className="fp-settings-interests__header">
                  <div className="fp-stack-sm">
                    <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <MaterialIcon style={{ color: "var(--fp-primary)" }}>interests</MaterialIcon>
                      Áreas de Interés
                    </h2>
                    <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                      Las áreas profesionales que definen tu perfil en MyCertify.
                    </p>
                  </div>
                  <Link href="/frontend/areas-interes" className="fp-button fp-button--ghost">
                    <MaterialIcon>edit</MaterialIcon>
                    Editar
                  </Link>
                </div>

                <div className="fp-divider" />

                {interests.length === 0 ? (
                  <div className="fp-settings-interests__empty">
                    <MaterialIcon style={{ fontSize: "2.5rem", color: "var(--fp-outline)" }}>interests</MaterialIcon>
                    <p className="fp-body-md fp-muted" style={{ margin: 0, textAlign: "center" }}>
                      Aún no has seleccionado áreas de interés.
                    </p>
                    <Link href="/frontend/areas-interes" className="fp-button fp-button--soft">
                      <MaterialIcon>add</MaterialIcon>
                      Completar perfil
                    </Link>
                  </div>
                ) : (
                  <div className="fp-interests-display">
                    {interests.map((area) => (
                      <div key={area.id} className="fp-interest-tag">
                        <span className="fp-interest-tag__icon">
                          <AreaIcon icon={area.icon} />
                        </span>
                        <span className="fp-interest-tag__label">{area.label}</span>
                        {area.custom && (
                          <span className="fp-interest-tag__badge">Personalizada</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </div>
          </div>
        </div>

        <FrontendFooter />
      </main>

      {/* Modal de Actualizar Contraseña */}
      {showPasswordModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          backdropFilter: "blur(4px)"
        }}>
          <article className="fp-card fp-card--panel fp-stack-md" style={{ width: "100%", maxWidth: "440px" }}>
            <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MaterialIcon style={{ color: "var(--fp-primary)" }}>lock</MaterialIcon>
              Actualizar Contraseña
            </h2>

            <div className="fp-divider" />

            <form className="fp-stack-md" onSubmit={handleUpdatePassword}>
              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="current-password">
                  Contraseña Actual
                </label>
                <div className="fp-input-wrap" style={{ position: "relative" }}>
                  <input
                    id="current-password"
                    name="currentPassword"
                    className="fp-input"
                    placeholder="••••••••"
                    type={showCurrentPassword ? "text" : "password"}
                    style={{ paddingRight: "3rem" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--fp-muted)",
                      display: "flex",
                      padding: 0
                    }}
                    aria-label={showCurrentPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="new-password">
                  Nueva Contraseña
                </label>
                <div className="fp-input-wrap" style={{ position: "relative" }}>
                  <input
                    id="new-password"
                    name="newPassword"
                    className="fp-input"
                    placeholder="Nueva contraseña segura"
                    type={showNewPassword ? "text" : "password"}
                    style={{ paddingRight: "3rem" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--fp-muted)",
                      display: "flex",
                      padding: 0
                    }}
                    aria-label={showNewPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="repeat-new-password">
                  Repetir Nueva Contraseña
                </label>
                <div className="fp-input-wrap" style={{ position: "relative" }}>
                  <input
                    id="repeat-new-password"
                    name="repeatPassword"
                    className="fp-input"
                    placeholder="Repetir nueva contraseña"
                    type={showRepeatPassword ? "text" : "password"}
                    style={{ paddingRight: "3rem" }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--fp-muted)",
                      display: "flex",
                      padding: 0
                    }}
                    aria-label={showRepeatPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="fp-button fp-button--ghost"
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="fp-button fp-button--primary"
                  type="submit"
                  disabled={isUpdatingPassword}
                >
                  {isUpdatingPassword ? "Actualizando..." : "Actualizar contraseña"}
                </button>
              </div>
            </form>
          </article>
        </div>
      )}
      {/* Modal de Actualizar Título */}
      {showTitleModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
          backdropFilter: "blur(4px)"
        }}>
          <article className="fp-card fp-card--panel fp-stack-md" style={{ width: "100%", maxWidth: "440px" }}>
            <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MaterialIcon style={{ color: "var(--fp-primary)" }}>badge</MaterialIcon>
              Actualizar título
            </h2>

            <div className="fp-divider" />

            <form className="fp-stack-md" onSubmit={handleUpdateTitle}>
              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="current-title">
                  Título actual
                </label>
                <input
                  id="current-title"
                  className="fp-input"
                  value={profile?.titulo_profesional ?? "Sin título"}
                  type="text"
                  readOnly
                  style={{ backgroundColor: "var(--fp-surface-variant)" }}
                />
              </div>

              <div className="fp-field">
                <label className="fp-field__label fp-label-md" htmlFor="new-title">
                  Título nuevo
                </label>
                <input
                  id="new-title"
                  name="newTitle"
                  className="fp-input"
                  placeholder="Ej. Ingeniero DevOps"
                  type="text"
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  className="fp-button fp-button--ghost"
                  onClick={() => setShowTitleModal(false)}
                >
                  Cancelar
                </button>
                <button
                  className="fp-button fp-button--primary"
                  type="submit"
                  disabled={isUpdatingTitle}
                >
                  {isUpdatingTitle ? "Actualizando..." : "Actualizar título"}
                </button>
              </div>
            </form>
          </article>
        </div>
      )}
    </section>
  );
}
