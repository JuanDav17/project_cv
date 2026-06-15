"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { getProfile, updateProfile, type ProfileDto } from "@/lib/api/perfil";
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
import { DashboardSidebar } from "../_components/dashboard-sidebar";
import { MobileBrandHeader } from "../_components/mobile-brand-header";

import "./page.css";

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

export default function EditarAreasPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileDto | null>(null);
  const [allInterests, setAllInterests] = useState<InterestItem[]>(PREDEFINED_INTERESTS);
  const [selectedItems, setSelectedItems] = useState<InterestItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [validationError, setValidationError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((p) => {
        setProfile(p);
        const saved = p.areas_interes || [];
        if (saved.length === 0) return;

        const customSaved = saved.filter((a) => a.custom);
        const customAsItems: InterestItem[] = customSaved.map((a) => ({
          id: a.id,
          label: a.label,
          icon: a.icon,
          custom: true,
        }));

        const withCustom = [
          ...PREDEFINED_INTERESTS.filter((i) => i.id !== "otros"),
          ...customAsItems,
          PREDEFINED_INTERESTS.find((i) => i.id === "otros")!,
        ];
        setAllInterests(withCustom);

        const savedIds = new Set(saved.map((a) => a.id));
        const restored = withCustom.filter((i) => savedIds.has(i.id) && i.id !== "otros");
        setSelectedItems(restored);
      })
      .catch(() => {
        window.location.href = "/frontend/iniciar-sesion?next=/frontend/editar_areas";
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

    setAllInterests((prev) => {
      const othersIndex = prev.findIndex((i) => i.id === "otros");
      const copy = [...prev];
      copy.splice(othersIndex, 0, newItem);
      return copy;
    });

    setSelectedItems((prev) => [...prev, newItem]);
    if (selectionCount + 1 >= MIN_SELECTIONS) {
      setValidationError(false);
    }
  };

  const handleSave = async () => {
    if (!canContinue) {
      setValidationError(true);
      showWarningToast("Selecciona al menos 3 áreas de interés.");
      throw new Error("not enough selections");
    }

    if (!profile) return;
    setIsSaving(true);

    const toSave: InterestArea[] = selectedItems.map((item) => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      custom: item.custom,
    }));

    try {
      await updateProfile({
        nombres: profile.nombres,
        apellidos: profile.apellidos,
        areas_interes: toSave,
      });
      showSuccessToast("Áreas de interés actualizadas correctamente.");
      router.push("/frontend/mi-cuenta");
    } catch {
      showErrorToast("No se pudieron guardar tus áreas de interés.");
      throw new Error("save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = profile?.nombre_completo ?? "Usuario";

  return (
    <section className="fp-page fp-page--shell">
      <DashboardSidebar
        active="settings"
        header={
          <>
            <div className="fp-sidebar__section fp-sidebar__section--plain">
              <div className="fp-headline-md" style={{ color: "var(--fp-primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MaterialIcon>workspace_premium</MaterialIcon>
                MyCertify
              </div>
            </div>
            <div className="fp-sidebar__section">
              <div className="fp-sidebar__profile fp-sidebar__profile--centered">
                <div className="fp-sidebar__avatar-placeholder fp-sidebar__avatar-placeholder--large">
                  <MaterialIcon>person</MaterialIcon>
                </div>
                <div className="fp-stack-xs" style={{ marginTop: "0.5rem" }}>
                  <p className="fp-label-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
                    {displayName}
                  </p>
                  {profile?.titulo_profesional && (
                    <p className="fp-body-sm fp-muted" style={{ margin: 0, fontSize: "0.75rem" }}>
                      {profile.titulo_profesional}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        }
        footer={
          <div className="fp-stack-md">
            <Link className="fp-sidebar__link fp-label-md" href="/frontend/ayuda?from=/frontend/editar_areas">
              <MaterialIcon>support_agent</MaterialIcon>
              <span>Centro de Ayuda</span>
            </Link>
          </div>
        }
      />

      <main className="fp-shell-main">
        <MobileBrandHeader>
          <MaterialIcon>menu</MaterialIcon>
        </MobileBrandHeader>

        <div className="fp-shell-content fp-stack-xl">
          <header className="fp-section-intro fp-stack-sm">
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Editar Áreas de Interés
            </h1>
            <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
              Actualiza las áreas que definen tu perfil profesional en la plataforma.
            </p>
          </header>

          <article className="fp-card fp-card--panel fp-stack-lg">
            <div className="fp-areas-header">
              <div className="fp-stack-sm">
                <h2 className="fp-headline-md" style={{ margin: 0 }}>
                  Tus Áreas Seleccionadas
                </h2>
                <p className="fp-body-md fp-muted" style={{ margin: 0 }}>
                  Selecciona las áreas que definen tu perfil. Puedes elegir varias
                  opciones o crear las tuyas propias.
                </p>
              </div>
              <div className={["fp-areas-counter", selectionCount >= MIN_SELECTIONS ? "fp-areas-counter--ok" : ""].filter(Boolean).join(" ")}>
                <span className="fp-areas-counter__num">{selectionCount}</span>
                <span className="fp-areas-counter__label">/ {MIN_SELECTIONS} mín.</span>
              </div>
            </div>

            <div className="fp-divider" />

            <FlowForm
              className="fp-stack-xl"
              nextHref="#"
              onBeforeSubmit={handleSave}
            >
              <InterestGrid
                interests={allInterests}
                selectedIds={selectedIds}
                onSelectionChange={handleSelectionChange}
                onOthersClick={() => setShowDialog(true)}
              />

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
                <Link className="fp-button fp-button--ghost" href="/frontend/mi-cuenta">
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
                    disabled={!canContinue || isSaving}
                    style={{ opacity: canContinue ? 1 : 0.5 }}
                  >
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                    <MaterialIcon>save</MaterialIcon>
                  </button>
                </div>
              </div>
            </FlowForm>
          </article>
        </div>
        <FrontendFooter />
      </main>

      {showDialog && (
        <CustomInterestDialog
          onAdd={handleAddCustom}
          onClose={() => setShowDialog(false)}
        />
      )}
    </section>
  );
}
