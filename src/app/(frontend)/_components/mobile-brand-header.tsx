import type { ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";

type MobileBrandHeaderProps = {
  children?: ReactNode;
};

export function MobileBrandHeader({ children }: MobileBrandHeaderProps) {
  return (
    <header className="fp-mobile-header">
      <div className="fp-headline-md" style={{ color: "var(--fp-primary)", fontWeight: 700 }}>
        MyCertify
      </div>
      <div className="fp-mobile-header__actions">
        <ThemeToggle />
        {children}
      </div>
    </header>
  );
}
