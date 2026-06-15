"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

import { logout as logoutRequest } from "@/lib/api/auth";
import { showErrorToast, showSuccessToast } from "@/lib/ui/toast";

import { MaterialIcon } from "./material-icon";

export function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutRequest();
      showSuccessToast("Sesion cerrada correctamente.");
    } catch {
      showErrorToast("No se pudo cerrar la sesion por completo.");
    } finally {
      router.push("/iniciar-sesion");
      router.refresh();
    }
  };

  const modal =
    showModal
      ? createPortal(
          <div className="fp-logout-modal-overlay">
            <div className="fp-logout-modal fp-stack-md">
              <h2
                className="fp-headline-md"
                style={{ margin: 0, color: "var(--fp-on-surface)" }}
              >
                Cerrar sesion
              </h2>
              <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
                Se cerrara tu sesion actual. Deberas ingresar tus credenciales
                para volver a entrar.
              </p>
              <div className="fp-logout-modal-actions">
                <button
                  type="button"
                  className="fp-button fp-button--ghost"
                  onClick={() => setShowModal(false)}
                  disabled={isLoggingOut}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="fp-button fp-button--primary"
                  style={{
                    background: "var(--fp-error)",
                    color: "white",
                    boxShadow: "none",
                  }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  {isLoggingOut ? "Cerrando..." : "Cerrar sesion"}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className="fp-sidebar__link fp-label-md"
        style={{
          width: "100%",
          border: "none",
          background: "transparent",
          cursor: "pointer",
        }}
        onClick={() => setShowModal(true)}
      >
        <MaterialIcon>logout</MaterialIcon>
        <span>Cerrar sesion</span>
      </button>

      {modal}
    </>
  );
}
