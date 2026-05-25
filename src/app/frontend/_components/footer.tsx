import Link from "next/link";

export function FrontendFooter() {
  return (
    <footer className="fp-footer">
      <div className="fp-footer__inner">
        <div className="fp-footer__brand fp-label-md">CertifyPro</div>
        <div className="fp-body-sm">© 2024 CertifyPro Precision Systems. All rights reserved.</div>
        <div className="fp-footer__links fp-body-sm">
          <Link href="/frontend">Privacy Policy</Link>
          <Link href="/frontend">Terms of Service</Link>
          <Link href="/frontend">Security</Link>
          <Link href="/frontend">Status</Link>
        </div>
      </div>
    </footer>
  );
}
