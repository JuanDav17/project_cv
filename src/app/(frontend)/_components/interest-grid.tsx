"use client";

import { useState } from "react";
import { LucideIconByName } from "./custom-interest-dialog";
import { MaterialIcon } from "./material-icon";

export type InterestItem = {
  id: string;
  label: string;
  /** Material Icon name (predefined) OR lucide icon name prefixed with "lucide:" (custom) */
  icon: string;
  custom?: boolean;
};

type InterestGridProps = {
  interests: InterestItem[];
  selectedIds?: string[];
  onSelectionChange?: (selected: InterestItem[]) => void;
  onOthersClick?: () => void;
};

const OTHERS_ID = "otros";

/** Lucide icon names are PascalCase and never contain underscores. Material icons always have underscores or are lowercase. */
function isLucideIcon(icon: string): boolean {
  return (
    icon.length > 0 &&
    !icon.includes("_") &&
    icon[0] === icon[0].toUpperCase() &&
    icon[0] !== icon[0].toLowerCase()
  );
}

export function InterestGrid({
  interests,
  selectedIds: externalSelected,
  onSelectionChange,
  onOthersClick,
}: InterestGridProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  const selected = externalSelected ?? internalSelected;

  const toggleInterest = (item: InterestItem) => {
    if (item.id === OTHERS_ID) {
      onOthersClick?.();
      return;
    }

    const next = selected.includes(item.id)
      ? selected.filter((id) => id !== item.id)
      : [...selected, item.id];

    setInternalSelected(next);
    onSelectionChange?.(interests.filter((i) => next.includes(i.id)));
  };

  return (
    <div className="fp-interest-grid">
      {interests.map((interest) => {
        const isSelected = selected.includes(interest.id);
        const isOthers = interest.id === OTHERS_ID;

        const iconFixMap: Record<string, string> = {
          "terminal": "Terminal",
          "code": "Code2",
          "design_services": "palette",
          "architecture": "domain",
          "cloud_sync": "cloud",
          "checklist": "list_alt"
        };
        const mappedIcon = iconFixMap[interest.icon] || interest.icon;

        const lucide = interest.custom || isLucideIcon(mappedIcon);

        return (
          <button
            key={interest.id}
            type="button"
            className={[
              "fp-interest-chip",
              "fp-label-md",
              isSelected ? "is-selected" : "",
              isOthers ? "fp-interest-chip--others" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleInterest(interest)}
          >
            <span className="fp-interest-chip__icon">
              {isSelected && !isOthers ? (
                <MaterialIcon>check_circle</MaterialIcon>
              ) : lucide ? (
                <LucideIconByName name={mappedIcon} size={22} />
              ) : (
                <MaterialIcon>{mappedIcon}</MaterialIcon>
              )}
            </span>
            <span className="fp-interest-chip__label">{interest.label}</span>
            {isOthers && (
              <span className="fp-interest-chip__arrow">
                <MaterialIcon>arrow_forward</MaterialIcon>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
