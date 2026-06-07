import type { AuthProfile } from "@/backend/auth/service";

import { apiFetch } from "./http";

export type { AuthProfile };

export type RegisterResponse = {
  profile: AuthProfile;
  sessionReady: boolean;
  emailConfirmationRequired: boolean;
  requiresVerification: boolean;
  expiresAt?: string;
  emailSent?: boolean;
  devCode?: string;
  devLink?: string;
};

export type LoginResponse = {
  profile: AuthProfile;
  requiresVerification: boolean;
  expiresAt: string;
  emailSent: boolean;
  devCode?: string;
  devLink?: string;
};

export type PasswordResetRequestResponse = {
  emailSent: boolean;
  expiresAt: string | null;
  devCode?: string;
  devLink?: string;
};

export type PasswordResetVerifyResponse = {
  resetToken: string;
  expiresAt: string;
};

export function register(payload: {
  fullName: string;
  email: string;
  password: string;
}) {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function verifyCode(payload: { code?: string; token?: string }) {
  return apiFetch<{ profile: AuthProfile }>("/auth/verify-code", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return apiFetch<void>("/auth/logout", {
    method: "POST",
  });
}

export function me() {
  return apiFetch<AuthProfile>("/auth/me");
}

export function requestPasswordReset(email: string) {
  return apiFetch<PasswordResetRequestResponse>("/auth/password-reset/request", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function verifyPasswordReset(payload: {
  email?: string;
  code?: string;
  token?: string;
}) {
  return apiFetch<PasswordResetVerifyResponse>("/auth/password-reset/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function confirmPasswordReset(payload: {
  resetToken: string;
  password: string;
}) {
  return apiFetch<{ passwordUpdated: boolean }>("/auth/password-reset/confirm", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
