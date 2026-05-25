import type { ProfileDto } from "@/backend/profile/service";

import { apiFetch } from "./http";

export type { ProfileDto };

export function getProfile() {
  return apiFetch<ProfileDto>("/perfil");
}

export function updateProfile(payload: Partial<ProfileDto>) {
  return apiFetch<ProfileDto>("/perfil", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

