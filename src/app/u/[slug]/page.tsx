import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { getPublicProfileBySlug } from "@/backend/public/service";
import { MaterialIcon } from "@/app/frontend/_components/material-icon";
import { ThemeToggle } from "@/app/frontend/_components/theme-toggle";
import { LucideIconByName } from "@/app/frontend/_components/custom-interest-dialog";
import { PublicCertificatesGrid } from "./public-certificates-grid";

import "@/app/frontend/page.css"; // Para los estilos del nav y footer de la landing
import "@/app/frontend/mis-certificados/page.css";
import "@/app/frontend/mi-cuenta/page.css"; // Para los tags de áreas de interés

export const dynamic = "force-dynamic";

type PublicProfilePageProps = {
  params: Promise<{ slug: string }>;
};

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

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug } = await params;
  let data: Awaited<ReturnType<typeof getPublicProfileBySlug>>;

  try {
    data = await getPublicProfileBySlug(slug);
  } catch {
    notFound();
  }

  const { perfil, certificados } = data;
  const areas = perfil.areas_interes || [];
  const profileReturnPath = `/u/${slug}`;
  const encodedProfileReturnPath = encodeURIComponent(profileReturnPath);

  return (
    <section className="fp-page fp-landing">
      {/* ─── Navbar ─── */}
      <header className="fp-landing__nav">
        <Link href="/frontend" className="fp-brand" style={{ textDecoration: "none" }}>
          <span className="fp-brand__icon fp-brand__icon--round">
            <MaterialIcon filled>verified</MaterialIcon>
          </span>
          <span>MyCertify</span>
        </Link>

        <div className="fp-landing__nav-actions">
          <ThemeToggle />
          <Link href="/frontend/codigo-qr" className="fp-button fp-button--ghost fp-button--sm">
            <MaterialIcon>arrow_back</MaterialIcon>
            Volver
          </Link>
          <Link className="fp-button fp-button--ghost fp-button--sm" href="/frontend/iniciar-sesion">
            Iniciar sesión
          </Link>
          <Link className="fp-button fp-button--accent fp-button--sm" href="/frontend/registro">
            Crear cuenta
          </Link>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main className="fp-stack-xl" style={{ padding: "2rem", minHeight: "calc(100vh - 160px)" }}>
        <section className="fp-card fp-card--panel fp-stack-lg" style={{ width: "min(100%, 64rem)", margin: "0 auto" }}>
          
          {/* Volver button moved to header */}

          <header className="fp-stack-sm">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              {perfil.avatar_url ? (
                <Image
                  src={perfil.avatar_url}
                  alt={perfil.nombre_completo}
                  width={64}
                  height={64}
                  unoptimized
                  style={{ width: "4rem", height: "4rem", borderRadius: "50%", objectFit: "cover" }} 
                />
              ) : (
                <div className="fp-sidebar__avatar-placeholder fp-sidebar__avatar-placeholder--large">
                  <MaterialIcon>person</MaterialIcon>
                </div>
              )}
              <div className="fp-stack-xs">
                <h1 className="fp-headline-lg" style={{ margin: 0 }}>
                  {perfil.nombre_completo}
                </h1>
                {perfil.titulo_profesional && (
                  <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
                    {perfil.titulo_profesional}
                  </p>
                )}
                {(perfil.ciudad || perfil.pais) && (
                  <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                    {[perfil.ciudad, perfil.pais].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
            {perfil.descripcion_perfil && (
              <p className="fp-body-md fp-muted" style={{ margin: 0, marginTop: "1rem" }}>
                {perfil.descripcion_perfil}
              </p>
            )}
          </header>

          <div className="fp-divider" />

          {/* ─── Áreas de Interés ─── */}
          {areas.length > 0 && (
            <>
              <section className="fp-stack-md">
                <h2 className="fp-headline-md" style={{ margin: 0 }}>
                  Áreas de Interés
                </h2>
                <div className="fp-interests-display">
                  {areas.map((area) => (
                    <div key={area.id} className="fp-interest-tag">
                      <span className="fp-interest-tag__icon">
                        <AreaIcon icon={area.icon} />
                      </span>
                      <span className="fp-interest-tag__label">{area.label}</span>
                    </div>
                  ))}
                </div>
              </section>
              <div className="fp-divider" />
            </>
          )}

          {/* ─── Certificados ─── */}
          <section className="fp-stack-lg">
            <PublicCertificatesGrid certificados={certificados} />
          </section>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="fp-landing__footer" id="contacto">
        <div className="fp-landing__footer-inner">
          <div className="fp-landing__footer-left">
            <div className="fp-brand fp-brand--footer">
              <span className="fp-brand__icon fp-brand__icon--round fp-brand__icon--sm">
                <MaterialIcon filled>verified</MaterialIcon>
              </span>
              <span>MyCertify</span>
            </div>
            <span className="fp-footer__copyright">
              © 2026 MyCertify
            </span>
          </div>
          <div className="fp-landing__footer-links fp-body-sm">
            <Link href={`/frontend/terminos-condiciones?from=${encodedProfileReturnPath}`}>Términos y Condiciones</Link>
            <Link href={`/frontend/terminos-servicio?from=${encodedProfileReturnPath}`}>Términos de Servicio</Link>
            <Link href={`/frontend/seguridad?from=${encodedProfileReturnPath}`}>Seguridad</Link>
            <Link href={`/frontend/contacto?from=${encodedProfileReturnPath}`}>Contacto</Link>
            <a
              href="https://github.com/JuanDav17/project_cv.git"
              target="_blank"
              rel="noopener noreferrer"
              className="fp-github-link"
              aria-label="GitHub Repository"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
}
