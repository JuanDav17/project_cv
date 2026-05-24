import Image from "next/image";
import Link from "next/link";

import { MaterialIcon } from "./_components/material-icon";
import { ThemeToggle } from "./_components/theme-toggle";

import "./page.css";

const features = [
  {
    icon: "qr_code_2",
    title: "Perfiles con QR",
    copy: "Comparte tu portafolio de certificaciones al instante. Un escaneo es suficiente para que cualquier empleador verifique tus credenciales de forma segura.",
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
            <span>CertifyPro</span>
          </div>

          <nav className="fp-landing__nav-links fp-body-sm">
            <a href="#soluciones" className="fp-nav-link--active">Soluciones</a>
          </nav>

          <div className="fp-landing__nav-actions">
            <ThemeToggle />
            <Link className="fp-button fp-button--ghost fp-button--sm" href="/frontend/iniciar-sesion">
              Iniciar sesión
            </Link>
            <Link className="fp-button fp-button--accent fp-button--sm" href="/frontend/registro">
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
              <Link className="fp-button fp-button--outline-light" href="/frontend/registro">
                Crea tu perfil gratis
              </Link>
              <Link className="fp-button fp-button--outline-light" href="/frontend/iniciar-sesion">
                Ver demostración
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
                  <span className="fp-hero__badge-label">Certificación Validada</span>
                  <strong className="fp-hero__badge-value">100% Auténtico</strong>
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
        <footer className="fp-landing__footer">
          <div className="fp-landing__footer-inner">
            <div className="fp-landing__footer-left">
              <div className="fp-brand fp-brand--footer">
                <span className="fp-brand__icon fp-brand__icon--round fp-brand__icon--sm">
                  <MaterialIcon filled>verified</MaterialIcon>
                </span>
                <span>CertifyPro</span>
              </div>
              <span className="fp-footer__copyright">
                © 2024 CertifyPro Inc. Todos los derechos reservados.
              </span>
            </div>
            <div className="fp-landing__footer-links fp-body-sm">
              <Link href="/frontend">Política de Privacidad</Link>
              <Link href="/frontend">Términos de Servicio</Link>
              <Link href="/frontend">Seguridad</Link>
              <Link href="/frontend">Contacto</Link>
            </div>
          </div>
        </footer>
      </main>
    </section>
  );
}
