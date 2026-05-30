/**
 * API de Áreas de Interés — persiste en localStorage.
 * No requiere cambios en la base de datos.
 */

export type InterestArea = {
  id: string;
  label: string;
  /** Nombre del icono de lucide-react */
  icon: string;
  /** true si fue creada por el usuario via el popup "Otros" */
  custom?: boolean;
};

const STORAGE_KEY = "mycertify-interest-areas";

export function saveInterests(areas: InterestArea[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(areas));
}

export function getInterests(): InterestArea[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as InterestArea[];
  } catch {
    return [];
  }
}

export function clearInterests(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
