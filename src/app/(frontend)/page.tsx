import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "./_components/material-icon";
import { ThemeToggle } from "./_components/theme-toggle";

import "./page.css";

const features = [
  {
    icon: "qr_code_2",
    title: "Perfiles con QR",
    copy: "Comparte tu portafolio de certificaciones al instante. Un escaneo es suficiente para que cualquier empleador verifique tus certificados de forma rapida y segura.",
  },
  {
    icon: "description",
    title: "Certificados Organizados",
    copy: "Olvídate de los PDFs perdidos. Centraliza diplomas, cursos y reconocimientos en un solo lugar, categorizados y siempre listos para descargar o compartir.",
  },
  {
    icon: "dashboard",
    title: "Dashboard Interno",
    copy: "Gestiona todos tus logros y documentos desde un panel centralizado diseñado para tu crecimiento.",
  },
];

const flowSteps = [
  {
    number: "1",
    title: "Regístrate",
    copy: "Crea tu cuenta gratuita usando solo tu correo electrónico.",
  },
  {
    number: "2",
    title: "Sube tus logros",
    copy: "Sube tus logros. Añade diplomas y certificados de cursos.",
  },
  {
    number: "3",
    title: "Comparte",
    copy: "Comparte. Genera un perfil público con código QR para tu CV o redes.",
  },
];

export default function FrontendIndexPage() {
  return (
    <section className="fp-page">
      <main className="fp-landing">
        {/* ─── Navbar ─── */}
        <header className="fp-landing__nav">
          <div className="fp-brand">
            <span className="fp-brand__icon fp-brand__icon--round">
              <MaterialIcon filled>verified</MaterialIcon>
            </span>
            <span>MyCertify</span>
          </div>

          <nav className="fp-landing__nav-links fp-body-sm">
            <a href="#soluciones" className="fp-nav-link--active">Soluciones</a>
          </nav>

          <div className="fp-landing__nav-actions">
            <ThemeToggle />
            <Link className="fp-button fp-button--ghost fp-button--sm" href="/iniciar-sesion">
              Iniciar sesión
            </Link>
            <Link className="fp-button fp-button--accent fp-button--sm" href="/registro">
              Empezar
            </Link>
          </div>
        </header>

        {/* ─── Hero Section ─── */}
        <section className="fp-landing__hero">
          <div className="fp-landing__hero-copy">
            <span className="fp-hero__badge">
              <span className="fp-hero__badge-dot" />
              PLATAFORMA PROFESIONAL
            </span>

            <h1 className="fp-hero__title">
              Tu trayectoria profesional,{" "}
              <em className="fp-hero__title-accent">
                validada y siempre a la mano.
              </em>
            </h1>

            <p className="fp-hero__subtitle">
              Organiza, comparte y demuestra tus certificaciones al instante.
              Conecta con reclutadores y destaca en el mercado laboral con un
              perfil verificable.
            </p>

            <div className="fp-hero__actions">
              <Link className="fp-button fp-button--outline-light" href="/registro">
                Crea tu perfil gratis
              </Link>
            </div>
          </div>

          <div className="fp-landing__hero-visual">
            <div className="fp-hero__image-wrapper">
              <Image
                src="/hero-landing.png"
                alt="Equipo profesional trabajando en oficina"
                width={640}
                height={440}
                className="fp-hero__image"
                priority
              />
              <div className="fp-hero__floating-badge">
                <span className="fp-hero__badge-icon">
                  <MaterialIcon filled>check_circle</MaterialIcon>
                </span>
                <div className="fp-hero__badge-text">
                  <span className="fp-hero__badge-label">Certificados Rapidos</span>
                  <strong className="fp-hero__badge-value">100% Funcional</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section className="fp-landing__section" id="soluciones">
          <div className="fp-section__header">
            <h2 className="fp-section__title">
              Todo lo que necesitas para destacar
            </h2>
            <p className="fp-section__subtitle">
              Herramientas diseñadas para profesionales que quieren mostrar su
              verdadero valor sin complicaciones técnicas.
            </p>
          </div>

          <div className="fp-landing__features">
            {features.map((feature) => (
              <article className="fp-feature-card" key={feature.title}>
                <div className="fp-feature-card__icon">
                  <MaterialIcon filled>{feature.icon}</MaterialIcon>
                </div>
                <h3 className="fp-feature-card__title">{feature.title}</h3>
                <p className="fp-feature-card__copy">{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ─── How it works Section ─── */}
        <section className="fp-landing__section fp-landing__section--flow">
          <div className="fp-section__header fp-section__header--left">
            <h2 className="fp-section__title">Cómo funciona</h2>
            <p className="fp-section__subtitle">
              Tres pasos sencillos para tomar el control de tu identidad
              profesional digital.
            </p>
          </div>

          <div className="fp-landing__flow">
            {flowSteps.map((step) => (
              <article className="fp-flow-card" key={step.number}>
                <span className="fp-flow-card__number">{step.number}</span>
                <h3 className="fp-flow-card__title">{step.title}</h3>
                <p className="fp-flow-card__copy">{step.copy}</p>
              </article>
            ))}
          </div>
        </section>

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
              <Link href="/terminos-condiciones?from=%2F">Términos y Condiciones</Link>
              <Link href="/terminos-servicio?from=%2F">Términos de Servicio</Link>
              <Link href="/seguridad?from=%2F">Seguridad</Link>
              <Link href="/contacto?from=%2F">Contacto</Link>
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
      </main>
    </section>
  );
}
