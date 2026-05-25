"use client";

import { useState } from "react";

import { MaterialIcon } from "./material-icon";

type Interest = {
  id: string;
  label: string;
  icon: string;
};

type InterestGridProps = {
  interests: Interest[];
};

export function InterestGrid({ interests }: InterestGridProps) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (id: string) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="fp-interest-grid">
      {interests.map((interest) => {
        const isSelected = selected.includes(interest.id);

        return (
          <button
            key={interest.id}
            type="button"
            className={[
              "fp-interest-chip",
              "fp-label-md",
              isSelected ? "is-selected" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => toggleInterest(interest.id)}
          >
            <span className="fp-interest-chip__icon">
              <MaterialIcon>{isSelected ? "check_circle" : interest.icon}</MaterialIcon>
            </span>
            <span>{interest.label}</span>
          </button>
        );
      })}
    </div>
  );
}
