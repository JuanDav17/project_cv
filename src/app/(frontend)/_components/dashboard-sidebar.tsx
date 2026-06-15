import Link from "next/link";
import type { ReactNode } from "react";

import { MaterialIcon } from "./material-icon";
import { ThemeToggle } from "./theme-toggle";
import { LogoutButton } from "./logout-button";

type NavKey = "overview" | "credentials" | "my-credentials" | "statistics" | "analytics" | "settings" | "legal";

type DashboardSidebarProps = {
  active: NavKey;
  header: ReactNode;
  footer?: ReactNode;
};

const navItems: Array<{
  key: NavKey;
  href: string;
  label: string;
  icon: string;
}> = [
  { key: "overview", href: "/pagina-principal", label: "Resumen", icon: "dashboard" },
  {
    key: "credentials",
    href: "/subir-certificado",
    label: "Emitir Certificado",
    icon: "upload_file",
  },
  {
    key: "my-credentials",
    href: "/mis-certificados",
    label: "Mis Certificados",
    icon: "workspace_premium",
  },
  {
    key: "statistics",
    href: "/dashboard",
    label: "Dashboard",
    icon: "insights",
  },
  { key: "analytics", href: "/codigo-qr", label: "Mi Código QR", icon: "qr_code_2" },
  { key: "settings", href: "/mi-cuenta", label: "Configuración", icon: "settings" },
];

export function DashboardSidebar({
  active,
  header,
  footer,
}: DashboardSidebarProps) {
  return (
    <aside className="fp-sidebar">
      {header}

      <nav className="fp-sidebar__nav">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={[
              "fp-sidebar__link",
              "fp-label-md",
              item.key === active ? "is-active" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <MaterialIcon filled={item.key === active}>{item.icon}</MaterialIcon>
            <span>{item.label}</span>
          </Link>
        ))}
        <div style={{ marginTop: "auto", paddingTop: "0.5rem" }}>
          <LogoutButton />
        </div>
      </nav>

      <div className="fp-sidebar__footer">
        {footer}
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "center" }}>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
