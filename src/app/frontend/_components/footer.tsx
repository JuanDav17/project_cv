import Link from "next/link";

export function FrontendFooter() {
  return (
    <footer className="fp-footer">
      <div className="fp-footer__inner">
        <div className="fp-footer__brand fp-label-md">MyCertify</div>
        <div className="fp-body-sm">© 2024 MyCertify Precision Systems. All rights reserved.</div>
        <div className="fp-footer__links fp-body-sm">
          <Link href="/frontend/terminos-condiciones">Términos y Condiciones</Link>
          <Link href="/frontend/terminos-servicio">Términos de Servicio</Link>
          <Link href="/frontend/seguridad">Seguridad</Link>
        </div>
      </div>
    </footer>
  );
}
