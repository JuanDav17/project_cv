import Link from "next/link";

import { FlowForm } from "../_components/flow-form";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { OnboardingStepper } from "../_components/onboarding-stepper";
import { ThemeToggle } from "../_components/theme-toggle";

import "./page.css";

export default function InformacionAcademicaPage() {
  return (
    <section className="fp-page fp-page--onboarding">
      <header className="fp-onboarding-topbar">
        <div className="fp-onboarding-topbar__inner">
          <div className="fp-brand" style={{ fontSize: "1.5rem" }}>
            <span className="fp-brand__icon fp-brand__icon--round">
              <MaterialIcon filled>workspace_premium</MaterialIcon>
            </span>
            <span>CertifyPro</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="fp-onboarding-main fp-stack-xl">
        <div className="fp-stack-sm" style={{ textAlign: "center" }}>
          <h1 className="fp-headline-lg" style={{ margin: 0 }}>
            Completar Perfil Profesional
          </h1>
          <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
            Configura tu perfil para destacar en la plataforma.
          </p>
        </div>

        <OnboardingStepper
          currentStep={2}
          labels={["Cuenta", "Nivel Educativo", "Carrera y Áreas", "Finalizar"]}
          mobileLabel="Paso 2: Nivel Educativo"
        />

        <article className="fp-card fp-card--panel fp-stack-lg">
          <h2 className="fp-headline-md" style={{ margin: 0 }}>
            Información Académica
          </h2>
          <div className="fp-divider" />

          <FlowForm className="fp-stack-xl" nextHref="/frontend/areas-interes">
            <div className="fp-field">
              <label className="fp-field__label fp-label-md" htmlFor="education-level">
                Nivel de Formación
              </label>
              <div className="fp-select-wrap">
                <select id="education-level" className="fp-select" defaultValue="">
                  <option disabled value="">
                    Selecciona tu nivel más alto alcanzado
                  </option>
                  <option>Primaria</option>
                  <option>Secundaria</option>
                  <option>Bachiller</option>
                  <option>Técnico</option>
                  <option>Tecnólogo</option>
                  <option>Profesional</option>
                  <option>Máster</option>
                  <option>Doctorado</option>
                </select>
                <span className="fp-select-wrap__icon">
                  <MaterialIcon>expand_more</MaterialIcon>
                </span>
              </div>
            </div>

            <div className="fp-field">
              <label className="fp-field__label fp-label-md" htmlFor="program-type">
                Programas
              </label>
              <div className="fp-select-wrap">
                <select id="program-type" className="fp-select" defaultValue="">
                  <option disabled value="">
                    Selecciona un tipo de programa
                  </option>
                  <option>Diplomado</option>
                  <option>Bootcamp</option>
                  <option>Otros</option>
                </select>
                <span className="fp-select-wrap__icon">
                  <MaterialIcon>expand_more</MaterialIcon>
                </span>
              </div>
            </div>

            <div className="fp-field">
              <label className="fp-field__label fp-label-md" htmlFor="career">
                Carrera Profesional / Título
              </label>
              <div className="fp-input-wrap">
                <span className="fp-input-icon">
                  <MaterialIcon>search</MaterialIcon>
                </span>
                <input
                  id="career"
                  className="fp-input"
                  placeholder="Ej. Ingeniería de Software, Diseño Gráfico..."
                  type="text"
                />
              </div>
              <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                Comienza a escribir para ver sugerencias.
              </p>
            </div>

            <div className="fp-divider" />

            <div className="fp-row-between">
              <Link className="fp-button fp-button--ghost" href="/frontend/iniciar-sesion">
                <MaterialIcon>arrow_back</MaterialIcon>
                Atrás
              </Link>
              <button className="fp-button fp-button--primary" type="submit">
                Continuar
                <MaterialIcon>arrow_forward</MaterialIcon>
              </button>
            </div>
          </FlowForm>
        </article>
      </main>

      <FrontendFooter />
    </section>
  );
}
