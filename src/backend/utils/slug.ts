const NON_SLUG_CHARS = /[^a-z0-9]+/g;

export function slugify(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(NON_SLUG_CHARS, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "usuario";
}

export function splitFullName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return { nombres: "Usuario", apellidos: "MyCertify" };
  }

  if (parts.length === 1) {
    return { nombres: parts[0], apellidos: "MyCertify" };
  }

  return {
    nombres: parts.slice(0, -1).join(" "),
    apellidos: parts.at(-1) ?? "MyCertify",
  };
}

export function publicNameFromProfile(profile: {
  nombres?: string | null;
  apellidos?: string | null;
}) {
  return [profile.nombres, profile.apellidos].filter(Boolean).join(" ").trim();
}

