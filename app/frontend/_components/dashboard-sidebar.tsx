import Link from "next/link";
import type { ReactNode } from "react";

import { MaterialIcon } from "./material-icon";

type NavKey = "overview" | "credentials" | "analytics" | "settings";

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
  { key: "overview", href: "/frontend/pagina-principal", label: "Overview", icon: "dashboard" },
  {
    key: "credentials",
    href: "/frontend/subir-certificado",
    label: "My Credentials",
    icon: "verified",
  },
  { key: "analytics", href: "/frontend/codigo-qr", label: "Analytics", icon: "insights" },
  { key: "settings", href: "/frontend/mi-cuenta", label: "Settings", icon: "settings" },
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
      </nav>

      <div className="fp-sidebar__footer">{footer}</div>
    </aside>
  );
}
