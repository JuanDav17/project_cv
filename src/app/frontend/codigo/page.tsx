"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { verifyCode } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/http";
import {
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} from "@/lib/ui/toast";

import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";

import "../iniciar-sesion/page.css";
import "./page.css";

export default function CodigoPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [devCode] = useState(() =>
    typeof window === "undefined"
      ? ""
      : sessionStorage.getItem("mycertify-dev-code") ?? "",
  );
  const [tokenFromUrl] = useState(() =>
    typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("token") ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const verifyCredential = useCallback(async (payload: { code?: string; token?: string }) => {
    setLoading(true);
    setError("");

    try {
      await verifyCode(payload);
      sessionStorage.removeItem("mycertify-dev-code");
      setSuccess(true);
      showSuccessToast("Codigo verificado. Redirigiendo...");
      router.push("/frontend/pagina-principal");
      router.refresh();
    } catch (requestError) {
      const message =
        requestError instanceof ApiError
          ? requestError.message
          : "Codigo invalido. Intentalo nuevamente.";
      setError(message);
      showErrorToast(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (tokenFromUrl) {
      const timeout = window.setTimeout(() => {
        void verifyCredential({ token: tokenFromUrl });
      }, 0);

      return () => window.clearTimeout(timeout);
    }
  }, [tokenFromUrl, verifyCredential]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!code.trim()) {
      const message = "Por favor ingresa un codigo.";
      setError(message);
      showWarningToast(message);
      return;
    }

    await verifyCredential({ code });
  };

  return (
    <section className="fp-login-split">
      <aside className="fp-login-split__hero" aria-hidden="true">
        <Image
          className="fp-login-split__hero-img"
          src="/login-hero.png"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          draggable={false}
        />
        <div className="fp-login-split__hero-overlay" />

        <div className="fp-login-split__hero-content">
          <div className="fp-login-split__hero-brand">
            <div className="fp-login-split__hero-logo">
              <MaterialIcon filled>school</MaterialIcon>
            </div>
            <span className="fp-login-split__hero-brand-name">MyCertify</span>
          </div>

          <div className="fp-login-split__hero-copy">
            <h2 className="fp-login-split__hero-title">
              Verifica tu identidad
            </h2>
            <p className="fp-login-split__hero-subtitle">
              Ingresa el codigo de acceso generado para continuar con tu panel.
            </p>
          </div>

          <p className="fp-login-split__hero-footer">
            Seguridad en cada paso.
          </p>
        </div>
      </aside>

      <main className="fp-login-split__form-area">
        <nav className="fp-auth-topnav">
          <Link className="fp-auth-topnav__home" href="/frontend/iniciar-sesion">
            <MaterialIcon>arrow_back</MaterialIcon>
            <span>Volver</span>
          </Link>
          <ThemeToggle />
        </nav>

        <div className="fp-auth-form-center">
          <div className="fp-login-split__form-container">
            <header className="fp-login-split__form-header">
              <h1 className="fp-login-split__form-title">Ingresar Codigo</h1>
            </header>

            <form className="fp-login-split__form fp-stack-md" onSubmit={handleSubmit}>
              <div className="fp-field">
                <label
                  className="fp-field__label fp-label-md"
                  htmlFor="verification-code"
                >
                  Codigo de verificacion
                </label>
                <div className="fp-input-wrap">
                  <span className="fp-input-icon">
                    <MaterialIcon>lock</MaterialIcon>
                  </span>
                  <input
                    id="verification-code"
                    className={`fp-input ${error ? "fp-input--error" : ""} ${success ? "fp-input--success" : ""
                      }`}
                    placeholder="A1B2C3D"
                    type="text"
                    value={code}
                    onChange={(event) => {
                      setCode(
                        event.target.value
                          .replace(/[^a-zA-Z0-9]/g, "")
                          .toUpperCase(),
                      );
                      if (error) setError("");
                    }}
                    disabled={loading || success}
                    maxLength={10}
                    autoCapitalize="characters"
                  />
                </div>
              </div>

              <button
                className="fp-button fp-button--primary fp-button--full"
                type="submit"
                disabled={loading || success}
              >
                {loading ? "Validando..." : "Validar y Acceder"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </section>
  );
}
