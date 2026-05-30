"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";

import { getProfile, type ProfileDto } from "@/lib/api/perfil";

import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

import "./page.css";

export default function CodigoQrPage() {
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [userName, setUserName] = useState("Usuario");
  const [publicUrl, setPublicUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    getProfile()
      .then((profileData) => {
        if (!isMounted) return;
        setProfile(profileData);
        const nextPublicUrl = `${window.location.origin}/u/${profileData.slug_publico}`;
        setUserName(profileData.nombre_completo || "Usuario");
        setPublicUrl(nextPublicUrl);
        return QRCode.toDataURL(nextPublicUrl, {
          width: 256,
          margin: 2,
          errorCorrectionLevel: "M",
          color: {
            dark: "#111827",
            light: "#ffffff",
          },
        });
      })
      .then((dataUrl) => {
        if (isMounted && dataUrl) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (isMounted) setPublicUrl("");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = "mycertify-qr.png";
    link.click();
  };

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
                    {userName}
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
              Comparte tu trayectoria profesional al instante. Personaliza y descarga tu codigo
              QR unico asociado a tu perfil en MyCertify.
            </p>
          </header>

          <section className="fp-two-column-qr" style={{ maxWidth: "72rem", margin: "0 auto", width: "100%" }}>
            <article className="fp-card fp-qr-preview fp-stack-md">
              <div className="fp-qr-image-frame fp-stack-sm theme-primary">
                {qrDataUrl ? (
                  <img
                    alt="QR Code Preview"
                    height={256}
                    src={qrDataUrl}
                    width={256}
                  />
                ) : (
                  <div className="fp-stack-sm" style={{ minHeight: 256, display: "grid", placeItems: "center" }}>
                    <MaterialIcon>hourglass_empty</MaterialIcon>
                  </div>
                )}
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
                <button
                  className="fp-button fp-button--primary fp-button--full"
                  type="button"
                  onClick={handleDownload}
                  disabled={!qrDataUrl}
                >
                  <MaterialIcon>download</MaterialIcon>
                  Descargar QR (PNG)
                </button>
                {publicUrl && (
                  <Link className="fp-button fp-button--secondary fp-button--full" href={publicUrl}>
                    <MaterialIcon>visibility</MaterialIcon>
                    Ver perfil publico
                  </Link>
                )}
              </article>

              <article className="fp-alert-qr">
                <MaterialIcon>info</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  Este codigo QR apunta a tu URL publica. Si actualizas tu perfil o certificados
                  publicos, la informacion escaneada se actualizara automaticamente.
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
