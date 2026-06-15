"use client";

import { useSyncExternalStore } from "react";

import { MaterialIcon } from "./material-icon";

type Theme = "light" | "dark";
const THEME_EVENT = "certifypro-theme-change";

type ThemeToggleProps = {
  floating?: boolean;
  className?: string;
};

function getDocumentTheme(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const listener = () => onStoreChange();
  window.addEventListener(THEME_EVENT, listener);

  return () => window.removeEventListener(THEME_EVENT, listener);
}

export function ThemeToggle({ floating = false, className }: ThemeToggleProps) {
  const theme = useSyncExternalStore(subscribe, getDocumentTheme, () => "light");

  const toggleTheme = () => {
    const currentTheme = getDocumentTheme();
    const nextTheme: Theme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("certifypro-theme", nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return (
    <button
      type="button"
      aria-label={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
      className={[
        "fp-theme-toggle",
        floating ? "fp-theme-toggle--floating" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={toggleTheme}
    >
      <MaterialIcon>{theme === "dark" ? "light_mode" : "dark_mode"}</MaterialIcon>
    </button>
  );
}
