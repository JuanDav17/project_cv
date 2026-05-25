"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

import { getProfile, updateProfile, type ProfileDto } from "@/lib/api/perfil";
import { ApiError } from "@/lib/api/http";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

import "./page.css";

export default function MiCuentaPage() {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setProfile)
      .catch(() => setError("No se pudo cargar tu perfil."));
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);

    try {
      const updatedProfile = await updateProfile({
        nombres: String(formData.get("nombres") ?? ""),
        apellidos: String(formData.get("apellidos") ?? ""),
        titulo_profesional: String(formData.get("titulo_profesional") ?? ""),
      });

      setProfile(updatedProfile);
      setSuccess("Perfil actualizado correctamente.");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "No se pudo actualizar el perfil.",
      );
    } finally {
      setIsSaving(false);
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
              Configuracion de la Cuenta
            </h1>
            <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
              Gestiona tu perfil y preferencias de seguridad.
            </p>
          </header>

          <section className="fp-settings-grid">
            <article className="fp-card fp-card--panel fp-stack-lg">
              <div className="fp-stack-sm">
                <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MaterialIcon style={{ color: "var(--fp-primary)" }}>person</MaterialIcon>
                  Informacion Personal
                </h2>
                <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                  Actualiza tus datos basicos de perfil.
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
                    Direccion de Correo Electronico
                  </label>
                  <input
                    id="account-email"
                    className="fp-input"
                    defaultValue={profile?.correo ?? ""}
                    type="email"
                    readOnly
                  />
                  <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                    Este correo viene de Supabase Auth.
                  </p>
                </div>

                <div className="fp-field">
                  <label className="fp-field__label fp-label-md" htmlFor="title">
                    Titulo Profesional
                  </label>
                  <input
                    id="title"
                    name="titulo_profesional"
                    className="fp-input"
                    defaultValue={profile?.titulo_profesional ?? ""}
                    placeholder="Ej. Ingeniero de Software"
                    type="text"
                  />
                </div>

                {error && (
                  <div className="fp-alert fp-alert--error">
                    <MaterialIcon>error_outline</MaterialIcon>
                    <p className="fp-body-sm" style={{ margin: 0 }}>
                      {error}
                    </p>
                  </div>
                )}

                {success && (
                  <div className="fp-alert fp-alert--success">
                    <MaterialIcon>check_circle_outline</MaterialIcon>
                    <p className="fp-body-sm" style={{ margin: 0 }}>
                      {success}
                    </p>
                  </div>
                )}

                <div className="fp-divider" />

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button className="fp-button fp-button--primary" type="submit" disabled={isSaving}>
                    {isSaving ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </article>

            <div className="fp-settings-column">
              <article className="fp-card fp-card--panel fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MaterialIcon style={{ color: "var(--fp-primary)" }}>lock</MaterialIcon>
                  Seguridad
                </h2>

                <div className="fp-divider" />

                <div className="fp-stack-md">
                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="current-password">
                      Contrasena Actual
                    </label>
                    <input id="current-password" className="fp-input" placeholder="********" type="password" />
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="new-password">
                      Nueva Contrasena
                    </label>
                    <input
                      id="new-password"
                      className="fp-input"
                      placeholder="Nueva contrasena segura"
                      type="password"
                    />
                  </div>

                  <div className="fp-field">
                    <label className="fp-field__label fp-label-md" htmlFor="repeat-new-password">
                      Repetir Nueva Contrasena
                    </label>
                    <input
                      id="repeat-new-password"
                      className="fp-input"
                      placeholder="Repetir nueva contrasena segura"
                      type="password"
                    />
                  </div>

                  <button className="fp-button fp-button--secondary fp-button--full" type="button">
                    Actualizar Contrasena
                  </button>
                </div>
              </article>
            </div>
          </section>
        </div>

        <FrontendFooter />
      </main>
    </section>
  );
}
