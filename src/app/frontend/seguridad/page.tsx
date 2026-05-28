import Link from "next/link";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";
import "./page.css";

export default function SeguridadPage() {
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
          <Link href="/frontend" className="fp-button fp-button--secondary fp-button--sm">
            <MaterialIcon>arrow_back</MaterialIcon> Volver
          </Link>
        </div>
      </header>

      <main style={{ flex: 1, padding: "3rem 1.5rem" }}>
        <div className="fp-legal-container">
          <header className="fp-section-intro" style={{ marginBottom: "2rem" }}>
            <h1 className="fp-headline-lg" style={{ margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MaterialIcon style={{ fontSize: "2rem", color: "var(--fp-primary)" }}>security</MaterialIcon>
              Seguridad
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: "0.5rem 0 0" }}>
              Cómo protegemos tu información y tus credenciales.
            </p>
          </header>

          <article className="fp-legal-content">
            <h2><MaterialIcon>lock</MaterialIcon> Infraestructura y Almacenamiento Seguro</h2>
            <p>
              En MyCertify nos tomamos la seguridad de tus datos muy en serio. Toda la infraestructura está desplegada en servidores seguros utilizando las mejores prácticas de la industria. La información personal y los metadatos de los certificados se almacenan en bases de datos con encriptación en reposo y en tránsito.
            </p>

            <h2><MaterialIcon>shield</MaterialIcon> Autenticación y Autorización</h2>
            <p>
              El acceso a la plataforma está protegido mediante modernos estándares de autenticación. Las contraseñas nunca se almacenan en texto plano; utilizamos algoritmos de hash criptográfico fuertes para proteger tus credenciales. Todas las sesiones son manejadas mediante tokens seguros que expiran de manera periódica.
            </p>

            <h2><MaterialIcon>cloud_done</MaterialIcon> Protección de Archivos (Storage)</h2>
            <p>
              Los documentos y comprobantes físicos o digitales que subes a la plataforma se almacenan en buckets de almacenamiento en la nube protegidos y configurados con estrictas políticas de acceso. Los archivos marcados como "privados" requieren autenticación con tu cuenta para ser visualizados o descargados, garantizando que nadie sin autorización pueda acceder a ellos.
            </p>

            <h2><MaterialIcon>qr_code_scanner</MaterialIcon> Verificación Pública Segura</h2>
            <p>
              Cuando decides compartir un certificado o generar un código QR, el enlace generado es seguro y de solo lectura. Los visores externos solo pueden ver la información que tú hayas decidido hacer pública en ese certificado en particular, y no tienen acceso a tu perfil completo ni a otros certificados privados.
            </p>

            <h2><MaterialIcon>bug_report</MaterialIcon> Reporte de Vulnerabilidades</h2>
            <p>
              Si eres un investigador de seguridad y crees haber encontrado una vulnerabilidad en MyCertify, te pedimos que nos lo notifiques de inmediato a través de nuestros canales de soporte antes de hacerla pública. Estamos comprometidos a investigar y resolver rápidamente cualquier problema reportado.
            </p>
          </article>
        </div>
      </main>

      <FrontendFooter />
    </section>
  );
}
