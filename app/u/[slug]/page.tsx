import Link from "next/link";
import { notFound } from "next/navigation";

import { getPublicProfileBySlug } from "@/backend/public/service";
import { MaterialIcon } from "@/app/frontend/_components/material-icon";

import "@/app/frontend/mis-certificados/page.css";

export const dynamic = "force-dynamic";

type PublicProfilePageProps = {
  params: Promise<{ slug: string }>;
};

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug } = await params;
  let data: Awaited<ReturnType<typeof getPublicProfileBySlug>>;

  try {
    data = await getPublicProfileBySlug(slug);
  } catch {
    notFound();
  }

  const { perfil, certificados } = data;

  return (
    <main className="fp-page fp-stack-xl" style={{ padding: "2rem", minHeight: "100vh" }}>
      <section className="fp-card fp-card--panel fp-stack-lg" style={{ width: "min(100%, 64rem)", margin: "0 auto" }}>
        <header className="fp-stack-sm">
          <Link className="fp-link fp-link--strong fp-label-md" href="/frontend">
            MyCertify
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div className="fp-sidebar__avatar-placeholder fp-sidebar__avatar-placeholder--large">
              <MaterialIcon>person</MaterialIcon>
            </div>
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
            <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
              {perfil.descripcion_perfil}
            </p>
          )}
        </header>

        <div className="fp-divider" />

        <section className="fp-stack-lg">
          <h2 className="fp-headline-md" style={{ margin: 0 }}>
            Certificados publicos
          </h2>

          {certificados.length === 0 && (
            <div className="fp-alert">
              <MaterialIcon>info</MaterialIcon>
              <p className="fp-body-sm" style={{ margin: 0 }}>
                Este perfil aun no tiene certificados publicos.
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
  );
}
