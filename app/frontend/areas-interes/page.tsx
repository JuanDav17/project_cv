import Link from "next/link";

import { FrontendFooter } from "../_components/footer";
import { FlowForm } from "../_components/flow-form";
import { InterestGrid } from "../_components/interest-grid";
import { MaterialIcon } from "../_components/material-icon";
import { OnboardingStepper } from "../_components/onboarding-stepper";

import "../informacion-academica/page.css"; // Shared onboarding styles
import "./page.css";

const interests = [
  { id: "frontend", label: "Frontend", icon: "code" },
  { id: "backend", label: "Backend", icon: "terminal" },
  { id: "pentester", label: "Pentester", icon: "bug_report" },
  { id: "sec", label: "Analista Ciberseguridad", icon: "security" },
  { id: "devops", label: "DevOps", icon: "cloud_sync" },
  { id: "finanzas", label: "Finanzas", icon: "payments" },
  { id: "arquitectura", label: "Arquitectura", icon: "architecture" },
  { id: "marketing", label: "Marketing Digital", icon: "campaign" },
  { id: "proyectos", label: "Gestión de Proyectos", icon: "checklist" },
  { id: "ux", label: "Diseño UI/UX", icon: "design_services" },
  { id: "rrhh", label: "Recursos Humanos", icon: "groups" },
  { id: "ia", label: "Datos e IA", icon: "psychology" },
  { id: "otros", label: "Otros", icon: "more_horiz" },
];

export default function AreasInteresPage() {
  return (
    <section className="fp-page fp-page--onboarding">
      <header className="fp-onboarding-topbar">
        <div className="fp-onboarding-topbar__inner">
          <div className="fp-brand" style={{ fontSize: "1.5rem" }}>
            <span className="fp-brand__icon fp-brand__icon--round">
              <MaterialIcon filled>verified</MaterialIcon>
            </span>
            <span>CertifyPro</span>
          </div>

          <Link className="fp-button fp-button--ghost fp-label-md" href="/frontend">
            Volver al inicio
          </Link>
        </div>
      </header>

      <main
        className="fp-onboarding-main"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <article className="fp-card fp-onboarding-card fp-stack-xl" style={{ width: "100%", maxWidth: "60rem" }}>
          <div className="fp-onboarding-card__glow" />

          <OnboardingStepper
            currentStep={3}
            labels={["Cuenta", "Perfil", "Carrera y Áreas", "Plan"]}
            mobileLabel="Paso 3: Carrera y Áreas"
          />

          <header className="fp-stack-sm">
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Áreas de Interés
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: 0, maxWidth: "42rem" }}>
              Selecciona las áreas que definen tu perfil profesional. Puedes elegir varias
              opciones para personalizar tus recomendaciones de cursos.
            </p>
          </header>

          <FlowForm className="fp-stack-xl" nextHref="/frontend/pagina-principal">
            <InterestGrid interests={interests} />

            <div className="fp-divider" />

            <div className="fp-row-between" style={{ flexWrap: "wrap" }}>
              <Link className="fp-button fp-button--ghost" href="/frontend/informacion-academica">
                Atrás
              </Link>
              <button className="fp-button fp-button--primary" type="submit">
                Continuar
              </button>
            </div>
          </FlowForm>
        </article>
      </main>

      <FrontendFooter />
    </section>
  );
}
