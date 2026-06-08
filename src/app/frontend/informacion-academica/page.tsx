"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

import { getProfile, updateProfile, type ProfileDto } from "@/lib/api/perfil";
import { showErrorToast, showSuccessToast } from "@/lib/ui/toast";
import { FlowForm } from "../_components/flow-form";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { OnboardingStepper } from "../_components/onboarding-stepper";
import { ThemeToggle } from "../_components/theme-toggle";

import "./page.css";

export default function InformacionAcademicaPage() {
  const careerInputRef = useRef<HTMLInputElement>(null);
  const educationRef = useRef<HTMLSelectElement>(null);
  const programRef = useRef<HTMLSelectElement>(null);

  const [defaultCareer, setDefaultCareer] = useState("");
  const [currentProfile, setCurrentProfile] = useState<ProfileDto | null>(null);

  // Pre-popular el título con el valor guardado en el perfil
  useEffect(() => {
    getProfile()
      .then((profile) => {
        setCurrentProfile(profile);
        if (profile.titulo_profesional) {
          setDefaultCareer(profile.titulo_profesional);
        }
      })
      .catch(() => {
        // Sin sesión o error: no pre-populamos, silencioso
      });
  }, []);

  const handleBeforeSubmit = async () => {
    const titulo = careerInputRef.current?.value?.trim() ?? "";
    if (!titulo) return; // Si no llenó, no guardamos (el campo no es obligatorio aquí)

    try {
      if (currentProfile) {
        await updateProfile({
          nombres: currentProfile.nombres,
          apellidos: currentProfile.apellidos,
          titulo_profesional: titulo,
        });
        showSuccessToast("Titulo profesional actualizado.");
      }
    } catch {
      const message = "No se pudo guardar el titulo profesional.";
      showErrorToast(message);
      throw new Error("save failed");
    }
  };

  return (
    <section className="fp-page fp-page--onboarding">
      <header className="fp-onboarding-topbar">
        <div className="fp-onboarding-topbar__inner">
          <div className="fp-brand" style={{ fontSize: "1.5rem" }}>
            <span className="fp-brand__icon fp-brand__icon--round">
              <MaterialIcon filled>workspace_premium</MaterialIcon>
            </span>
            <span>MyCertify</span>
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

          <FlowForm
            className="fp-stack-xl"
            nextHref="/frontend/areas-interes"
            onBeforeSubmit={handleBeforeSubmit}
          >
            <div className="fp-field">
              <label className="fp-field__label fp-label-md" htmlFor="education-level">
                Nivel de Formación
              </label>
              <div className="fp-select-wrap">
                <select id="education-level" ref={educationRef} className="fp-select" defaultValue="">
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
                <select id="program-type" ref={programRef} className="fp-select" defaultValue="">
                  <option disabled value="">
                    Selecciona un tipo de programa extra que hayas realizado
                  </option>
                  <option>Diplomado</option>
                  <option>Bootcamp</option>
                  <option>Otros</option>
                  <option>Ninguno</option>
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
                  <MaterialIcon>school</MaterialIcon>
                </span>
                <input
                  id="career"
                  ref={careerInputRef}
                  className="fp-input"
                  placeholder="Ej. Ingeniería de Software, Diseño Gráfico..."
                  type="text"
                  defaultValue={defaultCareer}
                  key={defaultCareer} // Fuerza re-render cuando el valor cambia
                />
              </div>
              <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                Este título aparecerá en tu perfil público como &quot;Título Profesional&quot;.
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
