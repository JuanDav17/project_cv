import Link from "next/link";
import { FrontendFooter } from "../_components/footer";
import {
  resolveLegalReturnHref,
  type LegalPageProps,
} from "../_components/legal-return";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";
import "./page.css";

export default async function AyudaPage({ searchParams }: LegalPageProps) {
  const backHref = await resolveLegalReturnHref(searchParams);

  return (
    <section className="fp-page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar Pública */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--fp-outline-variant)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--fp-surface)" }}>
        <Link href="/frontend" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--fp-on-surface)", fontWeight: "600", fontSize: "1.2rem" }}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", background: "var(--fp-primary)", color: "white" }}>
            <MaterialIcon filled>verified</MaterialIcon>
          </span>
          MyCertify
        </Link>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <ThemeToggle />
          <Link href={backHref} className="fp-button fp-button--secondary fp-button--sm">
            <MaterialIcon>arrow_back</MaterialIcon> Volver
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, padding: "3rem 1.5rem" }}>
        <div className="fp-legal-container">
          <header className="fp-section-intro" style={{ marginBottom: "2rem" }}>
            <h1 className="fp-headline-lg" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MaterialIcon style={{ fontSize: "2rem", color: "var(--fp-primary)" }}>help_center</MaterialIcon>
              Centro de Ayuda
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: "0.5rem 0 0" }}>
              Preguntas frecuentes y soporte sobre el uso de MyCertify.
            </p>
          </header>

          <article className="fp-legal-content">
            <h2><MaterialIcon>account_circle</MaterialIcon> ¿Cómo creo una cuenta?</h2>
            <p>
              Crear una cuenta es muy sencillo. Solo necesitas dirigirte a la página de registro, ingresar tu información personal, tu historial académico y tus áreas de interés. Al finalizar, se enviará un código de verificación a tu correo para activar tu cuenta.
            </p>

            <h2><MaterialIcon>upload_file</MaterialIcon> ¿Cómo subo un nuevo certificado?</h2>
            <p>
              Desde tu panel principal o "Dashboard", dirígete a la sección "Emitir Certificado" o "Subir Certificado". Allí podrás ingresar los datos de la certificación, la entidad emisora, las fechas y adjuntar el archivo correspondiente.
            </p>

            <h2><MaterialIcon>qr_code_2</MaterialIcon> ¿Para qué sirve mi Código QR?</h2>
            <p>
              El código QR enlaza directamente a tu perfil público. Puedes compartirlo con reclutadores, añadirlo a tu currículum vitae o a tu portafolio para que cualquier persona pueda verificar tus logros académicos y certificaciones al instante.
            </p>

            <h2><MaterialIcon>lock</MaterialIcon> ¿Es segura mi información?</h2>
            <p>
              ¡Totalmente! En MyCertify utilizamos encriptación y medidas de seguridad estándar de la industria. Si deseas conocer más detalles, te invitamos a revisar nuestra sección de <Link href="/frontend/seguridad?from=%2Ffrontend%2Fayuda" style={{ color: "var(--fp-primary)" }}>Seguridad</Link>.
            </p>

            <h2><MaterialIcon>email</MaterialIcon> ¿Aún tienes dudas?</h2>
            <p>
              Si no encontraste la respuesta a tu pregunta en esta sección, puedes ponerte en contacto con nosotros visitando la página de <Link href="/frontend/contacto?from=%2Ffrontend%2Fayuda" style={{ color: "var(--fp-primary)" }}>Contacto</Link>. Estaremos encantados de ayudarte.
            </p>
          </article>
        </div>
      </main>

      <FrontendFooter />
    </section>
  );
}
