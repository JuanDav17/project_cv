import Link from "next/link";

import { MaterialIcon } from "./_components/material-icon";
import { ThemeToggle } from "./_components/theme-toggle";

const features = [
  {
    icon: "qr_code_2",
    title: "Perfil verificable con QR",
    copy: "Comparte tu hoja de vida con un QR que abre un perfil claro, confiable y listo para ser revisado por reclutadores.",
  },
  {
    icon: "upload_file",
    title: "Certificados organizados",
    copy: "Ordena cursos, diplomas y constancias en una experiencia visual que muestra mejor tu recorrido y tus fortalezas.",
  },
  {
    icon: "monitoring",
    title: "Analítica para reclutadores",
    copy: "Ayuda a que una empresa entienda rápido en qué te especializas y qué tan sólido es tu perfil sin pedir pasos extra.",
  },
];

const pillars = [
  {
    title: "Qué es el proyecto",
    copy: "CertifyPro convierte certificados dispersos en una presencia profesional que se siente ordenada, creíble y fácil de compartir.",
  },
  {
    title: "Qué hace",
    copy: "Te permite registrar formación, clasificar intereses, mostrar evidencia académica y entregar un perfil público pensado para oportunidades reales.",
  },
  {
    title: "Por qué genera confianza",
    copy: "Se basa en evidencia documental, estructura profesional y una experiencia clara para que tus logros hablen con más fuerza.",
  },
];

const flowSteps = [
  "Crea tu cuenta profesional.",
  "Inicia sesión y completa tu información académica.",
  "Selecciona tus áreas de interés y especialización.",
  "Accede al panel, sube certificados y comparte tu QR.",
];

export default function FrontendIndexPage() {
  return (
    <section className="fp-page" style={{ position: "relative" }}>
      <ThemeToggle floating />

      <main className="fp-landing">
        <header className="fp-landing__nav">
          <div className="fp-brand">
            <span className="fp-brand__icon fp-brand__icon--round">
              <MaterialIcon filled>verified</MaterialIcon>
            </span>
            <span>CertifyPro</span>
          </div>

          <nav className="fp-landing__nav-links fp-body-sm">
            <a href="#proyecto">Proyecto</a>
            <a href="#flujo">Flujo</a>
            <a href="#stack">Confianza</a>
          </nav>

          <div className="fp-landing__nav-actions">
            <Link className="fp-button fp-button--ghost" href="/frontend/iniciar-sesion">
              Iniciar sesión
            </Link>
            <Link className="fp-button fp-button--primary" href="/frontend/registro">
              Crear cuenta
            </Link>
          </div>
        </header>

        <section className="fp-landing__hero">
          <div className="fp-landing__hero-copy fp-stack-lg">
            <div className="fp-stack-sm">
              <span className="fp-index__eyebrow fp-label-sm">
                Haz que tu perfil se vea serio, actual y verificable
              </span>
              <h1 className="fp-display" style={{ margin: 0 }}>
                Deja de adjuntar certificados sueltos y muestra una historia profesional que sí engancha
              </h1>
              <p className="fp-body-lg fp-muted" style={{ margin: 0 }}>
                CertifyPro reúne tu formación, tus intereses y tus logros en un perfil compartible
                por QR para que una empresa entienda quién eres, qué sabes y por qué vale la pena
                entrevistarte.
              </p>
            </div>

            <div className="fp-index__actions">
              <Link className="fp-button fp-button--primary" href="/frontend/registro">
                Crear cuenta
              </Link>
              <Link className="fp-button fp-button--secondary" href="/frontend/iniciar-sesion">
                Iniciar sesión
              </Link>
            </div>

            <div className="fp-landing__stats">
              <article className="fp-card fp-landing__stat">
                <span className="fp-label-sm fp-muted">Más claridad</span>
                <strong className="fp-headline-md">Tus logros, mejor presentados</strong>
              </article>
              <article className="fp-card fp-landing__stat">
                <span className="fp-label-sm fp-muted">Más confianza</span>
                <strong className="fp-headline-md">Perfil público verificable</strong>
              </article>
              <article className="fp-card fp-landing__stat">
                <span className="fp-label-sm fp-muted">Más impacto</span>
                <strong className="fp-headline-md">Un QR que abre tu trayectoria</strong>
              </article>
            </div>
          </div>

          <aside className="fp-card fp-landing__preview fp-stack-lg">
            <div className="fp-stack-sm">
              <span className="fp-label-sm fp-muted">Vista del perfil público</span>
              <h2 className="fp-headline-md" style={{ margin: 0 }}>
                Un solo escaneo para entender tu valor profesional
              </h2>
            </div>

            <div className="fp-landing__preview-qr">
              <div className="fp-landing__preview-grid" />
            </div>

            <div className="fp-stack-sm">
              <div className="fp-landing__mini-card">
                <MaterialIcon filled>workspace_premium</MaterialIcon>
                <div className="fp-stack-xs">
                  <strong className="fp-label-md">Biografía enfocada en reclutadores</strong>
                  <span className="fp-body-sm fp-muted">
                    Resume lo que haces, hacia dónde vas y qué evidencias respaldan tu perfil.
                  </span>
                </div>
              </div>
              <div className="fp-landing__mini-card">
                <MaterialIcon filled>insights</MaterialIcon>
                <div className="fp-stack-xs">
                  <strong className="fp-label-md">Lectura inmediata del perfil</strong>
                  <span className="fp-body-sm fp-muted">
                    Muestra especialización, diversidad de aprendizaje y trayectoria en una sola vista.
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section className="fp-landing__section fp-stack-lg" id="proyecto">
          <div className="fp-stack-sm">
            <span className="fp-index__eyebrow fp-label-sm">Qué es y qué hace</span>
            <h2 className="fp-headline-lg" style={{ margin: 0 }}>
              Diseñada para que tu formación se vea tan sólida como realmente es
            </h2>
          </div>

          <div className="fp-landing__features">
            {features.map((feature) => (
              <article className="fp-card fp-index__card fp-stack-md" key={feature.title}>
                <div className="fp-landing__feature-icon">
                  <MaterialIcon filled>{feature.icon}</MaterialIcon>
                </div>
                <h3 className="fp-headline-md" style={{ margin: 0 }}>
                  {feature.title}
                </h3>
                <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="fp-landing__section fp-stack-lg" id="flujo">
          <div className="fp-stack-sm">
            <span className="fp-index__eyebrow fp-label-sm">Flujo del usuario</span>
            <h2 className="fp-headline-lg" style={{ margin: 0 }}>
              Un recorrido simple, claro y pensado para mostrar progreso
            </h2>
          </div>

          <div className="fp-landing__flow">
            {flowSteps.map((step, index) => (
              <article className="fp-card fp-landing__flow-step" key={step}>
                <span className="fp-landing__flow-number">{index + 1}</span>
                <p className="fp-body-md" style={{ margin: 0 }}>
                  {step}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="fp-landing__section fp-stack-lg" id="stack">
          <div className="fp-stack-sm">
            <span className="fp-index__eyebrow fp-label-sm">Base del proyecto</span>
            <h2 className="fp-headline-lg" style={{ margin: 0 }}>
              Lo importante no es solo almacenar certificados, sino hacer que generen confianza
            </h2>
          </div>

          <div className="fp-landing__pillars">
            {pillars.map((pillar) => (
              <article className="fp-card fp-index__card fp-stack-sm" key={pillar.title}>
                <h3 className="fp-headline-md" style={{ margin: 0 }}>
                  {pillar.title}
                </h3>
                <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
                  {pillar.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="fp-card fp-landing__cta fp-stack-md">
          <div className="fp-stack-sm">
            <span className="fp-index__eyebrow fp-label-sm">Empezar demo frontend</span>
            <h2 className="fp-headline-lg" style={{ margin: 0 }}>
              Empieza ahora y recorre la experiencia completa del usuario
            </h2>
            <p className="fp-body-md" style={{ margin: 0, opacity: 0.92 }}>
              Esta demo ya conecta la landing, el registro, el inicio de sesión, el onboarding y
              el dashboard para que puedas evaluar el flujo visual completo.
            </p>
          </div>

          <div className="fp-index__actions">
            <Link className="fp-button fp-button--primary" href="/frontend/registro">
              Ir a registrarme
            </Link>
            <Link className="fp-button fp-button--ghost" href="/frontend/iniciar-sesion">
              Ya tengo cuenta
            </Link>
          </div>
        </section>
      </main>
    </section>
  );
}
