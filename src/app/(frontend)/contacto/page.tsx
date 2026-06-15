import Link from "next/link";
import { FrontendFooter } from "../_components/footer";
import {
  resolveLegalReturnHref,
  type LegalPageProps,
} from "../_components/legal-return";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";
import "./page.css";

export default async function ContactoPage({ searchParams }: LegalPageProps) {
  const backHref = await resolveLegalReturnHref(searchParams);

  return (
    <section className="fp-page" style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar Pública */}
      <header style={{ padding: "1rem 2rem", borderBottom: "1px solid var(--fp-outline-variant)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--fp-surface)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", color: "var(--fp-on-surface)", fontWeight: "600", fontSize: "1.2rem" }}>
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
              <MaterialIcon style={{ fontSize: "2rem", color: "var(--fp-primary)" }}>contact_support</MaterialIcon>
              Contacto
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: "0.5rem 0 0" }}>
              ¿Tienes preguntas o necesitas ayuda? Estamos aquí para asistirte.
            </p>
          </header>

          <article className="fp-legal-content">
            <h2><MaterialIcon>email</MaterialIcon> Correo Electrónico Oficial</h2>
            <p>
              El medio de comunicación único y oficial con el equipo de MyCertify es a través de nuestro correo electrónico. Si tienes dudas, sugerencias o problemas con la plataforma, por favor escríbenos a:
            </p>
            <div style={{ background: "var(--fp-surface-variant)", padding: "1.5rem", borderRadius: "8px", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <MaterialIcon style={{ color: "var(--fp-primary)" }}>mail</MaterialIcon>
              <strong><a href="mailto:mycertifyonline@gmail.com" style={{ color: "var(--fp-primary)", textDecoration: "none" }}>mycertifyonline@gmail.com</a></strong>
            </div>

            <h2><MaterialIcon>schedule</MaterialIcon> Horarios de Atención</h2>
            <p>
              Nuestro equipo revisa y responde los correos en horario laboral. Procuramos dar respuesta a todas las solicitudes en un plazo no mayor a 48 horas hábiles.
            </p>

            <h2><MaterialIcon>help_center</MaterialIcon> Soporte Técnico</h2>
            <p>
              Al comunicarte por motivos de soporte técnico, te sugerimos incluir la mayor cantidad de información posible sobre el error que experimentas, capturas de pantalla y el correo con el que estás registrado en la plataforma. Esto nos ayudará a brindarte una solución de manera más rápida y eficiente.
            </p>
          </article>
        </div>
      </main>

      <FrontendFooter />
    </section>
  );
}
