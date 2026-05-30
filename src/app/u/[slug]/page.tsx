import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicProfileBySlug } from "@/backend/public/service";
import { MaterialIcon } from "@/app/frontend/_components/material-icon";
import { ThemeToggle } from "@/app/frontend/_components/theme-toggle";
import { LucideIconByName } from "@/app/frontend/_components/custom-interest-dialog";

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
                <img 
                  src={perfil.avatar_url} 
                  alt={perfil.nombre_completo} 
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
            <h2 className="fp-headline-md" style={{ margin: 0 }}>
              Certificados Públicos
            </h2>

            {certificados.length === 0 && (
              <div className="fp-alert">
                <MaterialIcon>info</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  Este perfil aún no tiene certificados públicos.
                </p>
              </div>
            )}

            <div className="fp-certificates-grid">
              {certificados.map((certificado) => (
                <article key={certificado.id_certificado} className="fp-cert-card">
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
                    {certificado.archivo?.url_firmada && (
                      <a
                        className="fp-button fp-button--secondary fp-button--full"
                        href={certificado.archivo.url_firmada}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <MaterialIcon>picture_as_pdf</MaterialIcon>
                        Ver PDF
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="fp-landing__footer">
        <div className="fp-landing__footer-inner">
          <div className="fp-landing__footer-left">
            <div className="fp-brand fp-brand--footer">
              <span className="fp-brand__icon fp-brand__icon--round fp-brand__icon--sm">
                <MaterialIcon filled>verified</MaterialIcon>
              </span>
              <span>MyCertify</span>
            </div>
            <span className="fp-footer__copyright">
              © 2024 MyCertify Inc. Todos los derechos reservados.
            </span>
          </div>
          <div className="fp-landing__footer-links fp-body-sm">
            <Link href="/frontend/terminos-condiciones">Términos y Condiciones</Link>
            <Link href="/frontend/terminos-servicio">Términos de Servicio</Link>
            <Link href="/frontend/seguridad">Seguridad</Link>
            <Link href="/frontend">Contacto</Link>
          </div>
        </div>
      </footer>
    </section>
  );
}
