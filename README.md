# 🎓 MyCertify (project_cv)

<div align="center">
  <p><strong>Plataforma integral para registrar, organizar y compartir certificados profesionales con verificación mediante código QR.</strong></p>
</div>

---

## 📖 ¿Qué es MyCertify?

**MyCertify** es una aplicación web moderna diseñada para centralizar y gestionar la validación de logros académicos y profesionales. Actúa como un portafolio digital seguro donde los usuarios pueden almacenar sus certificados en formato PDF y compartirlos fácilmente con reclutadores, clientes o empleadores a través de un perfil público altamente profesional.

## 🚀 ¿Qué hace?

El sistema permite a los profesionales crear una cuenta segura, subir sus diplomas o certificados y decidir de forma granular cuáles de ellos desean hacer públicos. A partir de esta selección, la aplicación genera automáticamente un **código QR dinámico** que enlaza directamente al perfil público del usuario, permitiendo a cualquier tercero validar las credenciales escaneando el código desde un currículum impreso, una tarjeta de presentación o un perfil de LinkedIn.

## 🌟 Ventajas

- **Verificación Ágil para Reclutadores:** El código QR facilita la validación instantánea de los certificados, eliminando la necesidad de adjuntar múltiples PDFs pesados en correos electrónicos.
- **Privacidad Granular:** El usuario tiene control total sobre qué certificados son visibles públicamente y cuáles se mantienen en su bóveda privada.
- **Alta Seguridad:** Sistema de autenticación robusto con verificación en dos pasos (2FA) mediante códigos alfanuméricos o enlaces de un solo uso enviados por correo electrónico.
- **Optimización de Recursos:** Validación estricta de peso y formato de archivos (solo PDFs de máx. 1 MB) tanto en el cliente como en el servidor.
- **Experiencia de Usuario Fluida:** Carga rápida, manejo de estado eficiente y navegación sin interrupciones gracias a la arquitectura Serverless.

## ⚙️ Funcionalidades Principales

- **Sistema de Autenticación Completo:** Registro, inicio de sesión y recuperación de contraseñas.
- **Verificación de 2 Pasos (2FA):** Integrada con Resend para envíos de códigos seguros. Las rutas privadas están protegidas mediante validaciones de sesión y cookies `httpOnly`.
- **Gestión de Perfil:** Interfaz intuitiva para la edición de los datos profesionales del usuario.
- **Gestor de Certificados:** Subida directa de archivos a *Supabase Storage*, listado y administración de documentos académicos.
- **Generación de Código QR:** Creación de un QR único vinculado al identificador (`slug`) del usuario en tiempo real.
- **Perfil Público (`/u/[slug]`):** Vista de solo lectura, elegante y responsiva, diseñada para que terceros visualicen los certificados aprobados por el propietario.

## 🛠️ Arquitectura

El proyecto está construido bajo una arquitectura *Full-Stack* orientada a Serverless con el ecosistema de Next.js:

1. **Frontend (Cliente):** Construido con React. Se comunica con el backend mediante una capa de red abstraída (`lib/api/`) para consumir los servicios REST.
2. **Backend (API Routes):** Funciona mediante *Route Handlers* de Next.js. Se encarga de la lógica de negocio, validaciones de seguridad y la comunicación con Supabase mediante clientes proxy/admin.
3. **Autenticación y Sesiones:** Al iniciar sesión y pasar el 2FA, el backend verifica el token, lo destruye de la base de datos (garantizando que sea de un solo uso) y establece una cookie `httpOnly` llamada `mycertify-auth-verified` para autorizar el acceso a las rutas en `/frontend/*`.
4. **Almacenamiento de Archivos:** Los archivos PDF se envían de forma segura al bucket privado `certificados` en Supabase Storage, mientras que la metadata (título, fecha, emisor) se guarda en PostgreSQL. Al consultar el perfil público, el backend genera URLs firmadas temporales para previsualizar los archivos sin exponer el bucket.

## 💻 Tecnologías Utilizadas

### Frontend
| Tecnología | Descripción |
|---|---|
| [Next.js 16.2.6](https://nextjs.org/) | Framework de React con *App Router* |
| [React 19.2.4](https://react.dev/) | Biblioteca principal para la construcción de interfaces |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático para código robusto y escalable |
| [qrcode](https://www.npmjs.com/package/qrcode) | Motor de generación dinámica de códigos QR |
| [Lucide React](https://lucide.dev/) | Paquete de iconografía optimizada |

### Backend & Base de Datos
| Tecnología | Descripción |
|---|---|
| [Supabase](https://supabase.com/) | Base de datos PostgreSQL, Auth y Storage (Buckets) |
| [Resend](https://resend.com/) | Envío de correos transaccionales (OTP, reset) |
| [Vercel](https://vercel.com/) | Plataforma de despliegue nativa para Next.js |

---

## 👨‍💻 Guía de Instalación Local

### 1. Requisitos Previos

- **Node.js** (versión compatible con Next.js 16) y **npm**
- **Git** instalado
- Una cuenta en **Supabase** (para BD, Auth y Storage)
- Una cuenta de **Resend** con una API key para correos transaccionales

### 2. Clonar el Repositorio

```bash
git clone https://github.com/JuanDav17/project_cv.git
cd project_cv
```

### 3. Instalación de Dependencias

```bash
npm ci
# Si tienes problemas, puedes usar: npm install
```

### 4. Configurar Variables de Entorno

Copia el archivo de ejemplo para crear tu archivo de variables locales:

```bash
cp .env.example .env.local
# En Windows PowerShell: Copy-Item .env.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Credenciales de Supabase (Settings > API de tu proyecto)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxxxxxxx

SUPABASE_CERTIFICADOS_BUCKET=certificados

# Configuración de Auth & Sesión
AUTH_CODE_TTL_MINUTES=10
AUTH_CODE_LENGTH=7
AUTH_DEV_FIXED_CODE=A1B2C3D
PASSWORD_RESET_SESSION_TTL_MINUTES=10

# Configuración de Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
EMAIL_FROM="MyCertify <onboarding@resend.dev>"
```

> ⚠️ **Seguridad:** Nunca expongas `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY` en componentes que se rendericen en el cliente.

### 5. Configurar la Base de Datos (Supabase)

1. Crea un nuevo proyecto en Supabase.
2. Ve a **SQL Editor** en el panel izquierdo.
3. Copia el contenido de `database/database.sql` y ejecútalo. Esto creará el esquema, las tablas principales y las políticas de seguridad (RLS).
4. *(Opcional)* Si ya tenías el esquema base, ejecuta la migración incremental en `database/migrations/20260524_email_codes_password_reset.sql`.
5. Ve a **Storage** y verifica que el bucket `certificados` exista. Si no, créalo manualmente y configúralo como **Privado**.

### 6. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

Abre tu navegador en [http://localhost:3000/frontend](http://localhost:3000/frontend).

> 💡 Si no configuraste Resend en desarrollo, el backend puede devolver y mostrar el código de prueba configurado en `AUTH_DEV_FIXED_CODE`.

### 7. Comandos Adicionales

```bash
npm run build   # Generar build de producción
npm run start   # Probar el build generado localmente
npm run lint    # Revisar linting
```
