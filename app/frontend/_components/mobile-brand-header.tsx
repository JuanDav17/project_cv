import type { ReactNode } from "react";

type MobileBrandHeaderProps = {
  children?: ReactNode;
};

export function MobileBrandHeader({ children }: MobileBrandHeaderProps) {
  return (
    <header className="fp-mobile-header">
      <div className="fp-headline-md" style={{ color: "var(--fp-primary)", fontWeight: 700 }}>
        CertifyPro
      </div>
      <div className="fp-mobile-header__actions">{children}</div>
    </header>
  );
}
