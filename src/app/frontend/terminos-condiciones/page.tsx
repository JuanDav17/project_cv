import Link from "next/link";
import { FrontendFooter } from "../_components/footer";
import { MaterialIcon } from "../_components/material-icon";
import { ThemeToggle } from "../_components/theme-toggle";
import "./page.css";

export default function TerminosYCondicionesPage() {
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
            <h1 className="fp-headline-lg" style={{ margin: 0 }}>
              Términos y Condiciones
            </h1>
            <p className="fp-body-lg fp-muted" style={{ margin: "0.5rem 0 0" }}>
              Última actualización: Mayo 2024
            </p>
          </header>

          <article className="fp-legal-content">
            <h2>1. Aceptación de los Términos</h2>
            <p>
              Al acceder y utilizar MyCertify (&quot;la Plataforma&quot;), usted acepta estar sujeto a estos Términos y Condiciones. Si no está de acuerdo con alguna parte de los términos, no podrá acceder a la Plataforma. Estos términos se aplican a todos los visitantes, usuarios y otras personas que accedan o utilicen el servicio.
            </p>

            <h2>2. Descripción del Servicio</h2>
            <p>
              MyCertify es una plataforma de gestión documental diseñada para permitir a los usuarios subir, organizar, almacenar y visualizar certificados y credenciales académicas o profesionales. El servicio incluye, pero no se limita a, la carga de imágenes o archivos, catalogación por temas u horas, personalización visual y generación de enlaces QR para validación.
            </p>

            <h2>3. Cuentas de Usuario</h2>
            <p>
              Cuando crea una cuenta con nosotros, debe proporcionarnos información precisa, completa y actual en todo momento. El incumplimiento de esto constituye una violación de los términos, lo que puede resultar en la cancelación inmediata de su cuenta en nuestra Plataforma. Usted es responsable de salvaguardar la contraseña que utiliza para acceder al servicio y para cualquier actividad o acción bajo su contraseña.
            </p>

            <h2>4. Propiedad Intelectual y Contenido del Usuario</h2>
            <p>
              Los certificados, archivos e información que usted sube (&quot;Contenido del Usuario&quot;) siguen siendo de su propiedad. Al subir contenido, usted nos otorga una licencia limitada para almacenar, procesar y mostrar dicho contenido exclusivamente para la prestación del servicio. Usted garantiza que posee los derechos necesarios sobre los certificados que sube y que estos no infringen derechos de terceros ni constituyen documentos fraudulentos.
            </p>

            <h2>5. Privacidad y Protección de Datos</h2>
            <p>
              El uso de la Plataforma también se rige por nuestra Política de Privacidad, que se incorpora a estos Términos por referencia. Recopilamos y utilizamos información de acuerdo con las leyes de protección de datos aplicables, empleando medidas como encriptación y control de accesos para salvaguardar su información.
            </p>

            <h2>6. Limitación de Responsabilidad</h2>
            <p>
              MyCertify proporciona la plataforma &quot;tal cual&quot;. No garantizamos que el servicio sea ininterrumpido, seguro o libre de errores. En ningún caso la Plataforma, sus directores, empleados o afiliados serán responsables de daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar el servicio.
            </p>
          </article>
        </div>
      </main>

      <FrontendFooter />
    </section>
  );
}
