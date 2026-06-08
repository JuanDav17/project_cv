import Link from "next/link";
import { FrontendFooter } from "../_components/footer";
import {
  resolveLegalReturnHref,
  type LegalPageProps,
} from "../_components/legal-return";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";
import "./page.css";

export default async function TerminosServicioPage({
  searchParams,
}: LegalPageProps) {
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
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Términos de Servicio
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: "0.5rem 0 0" }}>
              Última actualización: Mayo 2024
            </p>
          </header>

          <article className="fp-legal-content">
            <h2>1. Uso de la Plataforma</h2>
            <p>
              MyCertify se proporciona para el uso personal o profesional exclusivo de individuos y entidades que deseen gestionar, verificar y compartir sus certificaciones. Usted se compromete a no utilizar el servicio para fines ilícitos, incluyendo la falsificación de credenciales, suplantación de identidad o infracción de derechos de autor.
            </p>

            <h2>2. Disponibilidad del Servicio</h2>
            <p>
              Nos esforzamos por garantizar que MyCertify esté disponible las 24 horas del día. Sin embargo, el acceso a la Plataforma puede suspenderse temporalmente y sin previo aviso en caso de falla del sistema, mantenimiento, reparación o por razones que escapan a nuestro control.
            </p>

            <h2>3. Veracidad de la Información</h2>
            <p>
              La responsabilidad sobre la veracidad, exactitud y legalidad de los certificados subidos recae exclusivamente en el usuario. MyCertify no actúa como entidad certificadora; es una herramienta de organización y visibilidad. Cualquier credencial subida que sea reportada como fraudulenta podrá ser eliminada y la cuenta suspendida.
            </p>

            <h2>4. Almacenamiento y Archivos</h2>
            <p>
              La plataforma ofrece un espacio de almacenamiento para los documentos probatorios. Nos reservamos el derecho de establecer límites en el volumen y tamaño de los archivos que usted puede cargar. Asimismo, aunque tomamos medidas para proteger sus archivos, recomendamos mantener copias de seguridad de sus certificados originales.
            </p>

            <h2>5. Generación de Códigos QR</h2>
            <p>
              El servicio de generación de códigos QR y enlaces compartibles está pensado para facilitar la verificación externa de sus certificados. Usted es el único responsable de a quién le comparte estos enlaces y de configurar correctamente la privacidad (público/privado) de sus credenciales.
            </p>

            <h2>6. Modificaciones al Servicio</h2>
            <p>
              Nos reservamos el derecho de retirar o modificar el servicio que prestamos en la Plataforma sin previo aviso. De vez en cuando, podemos restringir el acceso a algunas partes de la Plataforma o a toda la Plataforma, a los usuarios, incluidos los usuarios registrados.
            </p>
          </article>
        </div>
      </main>

      <FrontendFooter />
    </section>
  );
}
