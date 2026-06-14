"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FOOTER_INFO_PATHS = new Set([
  "/frontend/terminos-condiciones",
  "/frontend/terminos-servicio",
  "/frontend/seguridad",
  "/frontend/contacto",
]);

function legalHref(path: string, from: string) {
  return `${path}?from=${encodeURIComponent(from)}`;
}

function subscribeToLocationChanges(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);

  return () => window.removeEventListener("popstate", onStoreChange);
}

function getBrowserSearch() {
  return typeof window === "undefined" ? "" : window.location.search;
}

function getServerSearch() {
  return "";
}

function safeFooterReturnHref(value: string | null) {
  if (!value) {
    return null;
  }

  let decoded = value.trim();

  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    return null;
  }

  if (decoded.startsWith("//") || !decoded.startsWith("/")) {
    return null;
  }

  if (decoded.startsWith("/frontend") || decoded.startsWith("/u/")) {
    return decoded;
  }

  return null;
}

export function FrontendFooter() {
  const pathname = usePathname();
  const currentPathname = pathname ?? "/frontend";
  const search = useSyncExternalStore(
    subscribeToLocationChanges,
    getBrowserSearch,
    getServerSearch,
  );
  const preservedFrom = safeFooterReturnHref(
    new URLSearchParams(search).get("from"),
  );
  const from =
    FOOTER_INFO_PATHS.has(currentPathname) && preservedFrom
      ? preservedFrom
      : currentPathname.startsWith("/frontend") || currentPathname.startsWith("/u/")
      ? currentPathname
      : "/frontend";

  return (
    <footer className="fp-footer" id="contacto">
      <div className="fp-footer__inner">
        <div className="fp-footer__brand fp-label-md">MyCertify</div>
        <div className="fp-body-sm">
          © 2026 MyCertify
        </div>
        <div className="fp-footer__links fp-body-sm">
          <Link href={legalHref("/frontend/terminos-condiciones", from)}>
            Terminos y Condiciones
          </Link>
          <Link href={legalHref("/frontend/terminos-servicio", from)}>
            Terminos de Servicio
          </Link>
          <Link href={legalHref("/frontend/seguridad", from)}>Seguridad</Link>
          <Link href={legalHref("/frontend/contacto", from)}>Contacto</Link>
          <a
            href="https://github.com/JuanDav17/project_cv.git"
            target="_blank"
            rel="noopener noreferrer"
            className="fp-github-link"
            aria-label="GitHub Repository"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
