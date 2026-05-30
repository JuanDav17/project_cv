"use client";

import { useState } from "react";
import {
  Code2,
  Terminal,
  Bug,
  Shield,
  Cloud,
  DollarSign,
  Building2,
  Megaphone,
  CheckSquare,
  Layers,
  Users,
  Brain,
  Database,
  Globe,
  Smartphone,
  Cpu,
  PenTool,
  BarChart2,
  Lock,
  Rocket,
  Lightbulb,
  Settings,
  BookOpen,
  Target,
  Zap,
} from "lucide-react";

import type { InterestArea } from "@/lib/api/areas-interes";

/* ─── Iconos disponibles para el picker ─────────────────────── */

const AVAILABLE_ICONS: { name: string; label: string; Icon: React.ElementType }[] = [
  { name: "Code2", label: "Código", Icon: Code2 },
  { name: "Terminal", label: "Terminal", Icon: Terminal },
  { name: "Bug", label: "Bug/Testing", Icon: Bug },
  { name: "Shield", label: "Seguridad", Icon: Shield },
  { name: "Cloud", label: "Cloud", Icon: Cloud },
  { name: "DollarSign", label: "Finanzas", Icon: DollarSign },
  { name: "Building2", label: "Arquitectura", Icon: Building2 },
  { name: "Megaphone", label: "Marketing", Icon: Megaphone },
  { name: "CheckSquare", label: "Gestión", Icon: CheckSquare },
  { name: "Layers", label: "Diseño", Icon: Layers },
  { name: "Users", label: "Personas", Icon: Users },
  { name: "Brain", label: "IA/ML", Icon: Brain },
  { name: "Database", label: "Base de datos", Icon: Database },
  { name: "Globe", label: "Web", Icon: Globe },
  { name: "Smartphone", label: "Mobile", Icon: Smartphone },
  { name: "Cpu", label: "Hardware", Icon: Cpu },
  { name: "PenTool", label: "Diseño gráfico", Icon: PenTool },
  { name: "BarChart2", label: "Análisis", Icon: BarChart2 },
  { name: "Lock", label: "Privacidad", Icon: Lock },
  { name: "Rocket", label: "Startups", Icon: Rocket },
  { name: "Lightbulb", label: "Innovación", Icon: Lightbulb },
  { name: "Settings", label: "DevOps", Icon: Settings },
  { name: "BookOpen", label: "Educación", Icon: BookOpen },
  { name: "Target", label: "Objetivos", Icon: Target },
  { name: "Zap", label: "Performance", Icon: Zap },
];

/* ─── Tipos ──────────────────────────────────────────────────── */

type CustomInterestDialogProps = {
  onAdd: (area: InterestArea) => void;
  onClose: () => void;
};

/* ─── Componente ─────────────────────────────────────────────── */

export function CustomInterestDialog({ onAdd, onClose }: CustomInterestDialogProps) {
  const [label, setLabel] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("Lightbulb");

  const handleAdd = () => {
    const trimmed = label.trim();
    if (!trimmed) return;

    const newArea: InterestArea = {
      id: `custom-${Date.now()}`,
      label: trimmed,
      icon: selectedIcon,
      custom: true,
    };

    onAdd(newArea);
    onClose();
  };

  return (
    <div className="cid-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cid-dialog fp-stack-lg" role="dialog" aria-modal="true" aria-label="Agregar área personalizada">
        {/* Header */}
        <div className="cid-dialog__header">
          <div className="fp-stack-xs">
            <h2 className="fp-headline-md" style={{ margin: 0 }}>
              Crear área personalizada
            </h2>
            <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
              Escribe el nombre de tu área y elige un ícono que la represente.
            </p>
          </div>
          <button
            type="button"
            className="cid-dialog__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <div className="fp-divider" />

        {/* Input de nombre */}
        <div className="fp-field">
          <label className="fp-field__label fp-label-md" htmlFor="custom-area-label">
            Nombre del área
          </label>
          <input
            id="custom-area-label"
            className="fp-input"
            placeholder="Ej. Blockchain, Robótica, Bioinformática..."
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
            maxLength={60}
          />
          <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
            {label.length}/60 caracteres
          </p>
        </div>

        {/* Picker de iconos */}
        <div className="fp-field">
          <span className="fp-field__label fp-label-md">Elige un ícono</span>
          <div className="cid-icon-grid">
            {AVAILABLE_ICONS.map(({ name, label: iconLabel, Icon }) => (
              <button
                key={name}
                type="button"
                title={iconLabel}
                aria-label={iconLabel}
                aria-pressed={selectedIcon === name}
                className={["cid-icon-btn", selectedIcon === name ? "is-selected" : ""].filter(Boolean).join(" ")}
                onClick={() => setSelectedIcon(name)}
              >
                <Icon size={20} strokeWidth={1.8} />
              </button>
            ))}
          </div>
        </div>

        <div className="fp-divider" />

        {/* Preview */}
        {label.trim() && (
          <div className="cid-preview">
            <span className="fp-label-md fp-muted">Vista previa:</span>
            <div className="cid-preview__chip">
              {(() => {
                const found = AVAILABLE_ICONS.find((i) => i.name === selectedIcon);
                if (!found) return null;
                const { Icon } = found;
                return <Icon size={18} strokeWidth={2} />;
              })()}
              <span>{label.trim()}</span>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="cid-dialog__actions">
          <button type="button" className="fp-button fp-button--ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="fp-button fp-button--primary"
            onClick={handleAdd}
            disabled={!label.trim()}
          >
            Añadir área
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Renderizador de iconos lucide por nombre (para chips) ──── */

export function LucideIconByName({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const found = AVAILABLE_ICONS.find((i) => i.name === name);
  if (!found) return null;
  const { Icon } = found;
  return <Icon size={size} strokeWidth={1.8} />;
}
