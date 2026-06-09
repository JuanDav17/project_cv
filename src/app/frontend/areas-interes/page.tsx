"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import { getProfile, updateProfile, type ProfileDto } from "@/lib/api/perfil";
import { register } from "@/lib/api/auth";
import { type InterestArea } from "@/lib/api/areas-interes";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/lib/ui/toast";

import { CustomInterestDialog } from "../_components/custom-interest-dialog";
import { FrontendFooter } from "../_components/footer";
import { FlowForm } from "../_components/flow-form";
import { InterestGrid, type InterestItem } from "../_components/interest-grid";
import { MaterialIcon } from "../_components/material-icon";
import { OnboardingStepper } from "../_components/onboarding-stepper";
import { ThemeToggle } from "../_components/theme-toggle";

import "../informacion-academica/page.css";
import "./page.css";

/* ─── Áreas predefinidas ─────────────────────────────────────── */

const PREDEFINED_INTERESTS: InterestItem[] = [
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

const MIN_SELECTIONS = 3;

/* ─── Página ─────────────────────────────────────────────────── */

export default function AreasInteresPage() {
  const [allInterests, setAllInterests] = useState<InterestItem[]>(PREDEFINED_INTERESTS);
  const [selectedItems, setSelectedItems] = useState<InterestItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [validationError, setValidationError] = useState(false);

  const [currentProfile, setCurrentProfile] = useState<ProfileDto | null>(null);
  const [isRegistrationFlow, setIsRegistrationFlow] = useState(false);

  // Cargar selecciones previas desde el perfil del usuario (DB)
  useEffect(() => {
    const isReg = sessionStorage.getItem("register_data") !== null;
    setIsRegistrationFlow(isReg);

    if (isReg) {
      return;
    }

    getProfile()
      .then((profile) => {
        setCurrentProfile(profile);
        const saved = profile.areas_interes || [];
        if (saved.length === 0) return;

    // Re-construir lista: predefinidas + las personalizadas guardadas
    const customSaved = saved.filter((a) => a.custom);
    const customAsItems: InterestItem[] = customSaved.map((a) => ({
      id: a.id,
      label: a.label,
      icon: a.icon,
      custom: true,
    }));

    // Insertar las personalizadas antes de "Otros"
    const withCustom = [
      ...PREDEFINED_INTERESTS.filter((i) => i.id !== "otros"),
      ...customAsItems,
      PREDEFINED_INTERESTS.find((i) => i.id === "otros")!,
    ];
    setAllInterests(withCustom);

    // Restaurar seleccionadas
    const savedIds = new Set(saved.map((a) => a.id));
    const restored = withCustom.filter((i) => savedIds.has(i.id) && i.id !== "otros");
    setSelectedItems(restored);
      })
      .catch(() => {
        // Sin sesión o error, redirigir a inicio de sesión
        window.location.href = "/frontend/iniciar-sesion?next=/frontend/areas-interes";
      });
  }, []);

  const selectedIds = selectedItems.map((i) => i.id);
  const selectionCount = selectedItems.length;
  const canContinue = selectionCount >= MIN_SELECTIONS;

  const handleSelectionChange = (items: InterestItem[]) => {
    setSelectedItems(items);
    if (items.length >= MIN_SELECTIONS) {
      setValidationError(false);
    }
  };

  const handleAddCustom = (area: InterestArea) => {
    const newItem: InterestItem = {
      id: area.id,
      label: area.label,
      icon: area.icon,
      custom: true,
    };

    // Añadir antes del chip "Otros"
    setAllInterests((prev) => {
      const othersIndex = prev.findIndex((i) => i.id === "otros");
      const copy = [...prev];
      copy.splice(othersIndex, 0, newItem);
      return copy;
    });

    // Auto-seleccionar la nueva área
    setSelectedItems((prev) => [...prev, newItem]);
    if (selectionCount + 1 >= MIN_SELECTIONS) {
      setValidationError(false);
    }
  };

  const handleBeforeSubmit = async () => {
    if (!canContinue) {
      setValidationError(true);
      showWarningToast("Selecciona al menos 3 areas de interes.");
      throw new Error("not enough selections");
    }

    // Persistir en la base de datos a través de updateProfile
    const toSave: InterestArea[] = selectedItems.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      custom: item.custom,
    }));
    
    if (isRegistrationFlow) {
      const regDataStr = sessionStorage.getItem("register_data");
      const acadDataStr = sessionStorage.getItem("register_academic_data");
      
      if (!regDataStr || !acadDataStr) {
        showErrorToast("Falta informacion del registro. Por favor vuelve a empezar.");
        throw new Error("missing registration data");
      }
      
      const regData = JSON.parse(regDataStr);
      const acadData = JSON.parse(acadDataStr);
      
      try {
        const response = await register(regData);
        
        await updateProfile({
          nombres: response.profile.nombres,
          apellidos: response.profile.apellidos,
          titulo_profesional: acadData.titulo_profesional,
          areas_interes: toSave,
        });
        
        sessionStorage.removeItem("register_data");
        sessionStorage.removeItem("register_academic_data");
        
        if (response.sessionReady && response.requiresVerification) {
          if (response.devCode) {
            sessionStorage.setItem("mycertify-dev-code", response.devCode);
          } else {
            sessionStorage.removeItem("mycertify-dev-code");
          }
        }
        showSuccessToast("Cuenta creada. Verifica tu codigo.");
      } catch (err: any) {
        showErrorToast(err.message || "No se pudo crear la cuenta.");
        throw new Error("registration failed");
      }
      return;
    }

    if (currentProfile) {
      try {
        await updateProfile({
          nombres: currentProfile.nombres,
          apellidos: currentProfile.apellidos,
          areas_interes: toSave,
        });
        showSuccessToast("Areas de interes actualizadas.");
      } catch {
        showErrorToast("No se pudieron guardar tus areas de interes.");
        throw new Error("save failed");
      }
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
          currentStep={3}
          labels={["Cuenta", "Nivel Educativo", "Carrera y Áreas", "Finalizar"]}
          mobileLabel="Paso 3: Carrera y Áreas"
        />

        <article className="fp-card fp-card--panel fp-stack-lg">
          <div className="fp-areas-header">
            <div className="fp-stack-sm">
              <h2 className="fp-headline-md" style={{ margin: 0 }}>
                Áreas de Interés
              </h2>
              <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
                Selecciona las áreas que definen tu perfil profesional. Puedes elegir varias
                opciones o crear las tuyas propias.
              </p>
            </div>
            {/* Contador */}
            <div className={["fp-areas-counter", selectionCount >= MIN_SELECTIONS ? "fp-areas-counter--ok" : ""].filter(Boolean).join(" ")}>
              <span className="fp-areas-counter__num">{selectionCount}</span>
              <span className="fp-areas-counter__label">/ {MIN_SELECTIONS} mín.</span>
            </div>
          </div>

          <div className="fp-divider" />

          <FlowForm
            className="fp-stack-xl"
            nextHref={isRegistrationFlow ? "/frontend/codigo" : "/frontend/pagina-principal"}
            onBeforeSubmit={handleBeforeSubmit}
          >
            <InterestGrid
              interests={allInterests}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
              onOthersClick={() => setShowDialog(true)}
            />

            {/* Mensaje de validación */}
            {validationError && (
              <div className="fp-alert fp-alert--warning fp-areas-validation">
                <MaterialIcon>warning</MaterialIcon>
                <p className="fp-body-sm" style={{ margin: 0 }}>
                  Debes seleccionar o crear al menos <strong>{MIN_SELECTIONS} áreas de interés</strong> para continuar.
                </p>
              </div>
            )}

            <div className="fp-divider" />

            <div className="fp-row-between" style={{ flexWrap: "wrap" }}>
              <Link className="fp-button fp-button--ghost" href="/frontend/informacion-academica">
                <MaterialIcon>arrow_back</MaterialIcon>
                Atrás
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                {!canContinue && (
                  <span className="fp-body-sm fp-muted">
                    Faltan {MIN_SELECTIONS - selectionCount} área{MIN_SELECTIONS - selectionCount !== 1 ? "s" : ""}
                  </span>
                )}
                <button
                  className="fp-button fp-button--primary"
                  type="submit"
                  disabled={!canContinue}
                  style={{ opacity: canContinue ? 1 : 0.5 }}
                >
                  Continuar
                  <MaterialIcon>arrow_forward</MaterialIcon>
                </button>
              </div>
            </div>
          </FlowForm>
        </article>
      </main>

      <FrontendFooter />

      {/* Dialog de área personalizada */}
      {showDialog && (
        <CustomInterestDialog
          onAdd={handleAddCustom}
          onClose={() => setShowDialog(false)}
        />
      )}
    </section>
  );
}
