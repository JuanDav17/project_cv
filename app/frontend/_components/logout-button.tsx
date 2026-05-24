"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { MaterialIcon } from "./material-icon";

export function LogoutButton() {
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    // Aquí iría cualquier lógica de limpieza de sesión (borrar tokens, etc.)
    router.push("/frontend");
  };

  const modal = showModal && mounted ? createPortal(
    <div className="fp-logout-modal-overlay">
      <div className="fp-logout-modal fp-stack-md">
        <h2 className="fp-headline-md" style={{ margin: 0, color: "var(--fp-on-surface)" }}>
          ¿Cerrar sesión?
        </h2>
        <p className="fp-body-sm fp-muted" style={{ margin: 0 }}>
          ¿Está seguro de cerrar su sesión actual? Deberá ingresar sus credenciales para volver a entrar.
        </p>
        <div className="fp-logout-modal-actions">
          <button
            type="button"
            className="fp-button fp-button--ghost"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="fp-button fp-button--primary"
            style={{ background: "var(--fp-error)", color: "white", boxShadow: "none" }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <>
      <button
        type="button"
        className="fp-sidebar__link fp-label-md"
        style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer" }}
        onClick={() => setShowModal(true)}
      >
        <MaterialIcon>logout</MaterialIcon>
        <span>Cerrar Sesión</span>
      </button>

      {modal}
    </>
  );
}
