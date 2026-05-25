# MyCertify

MyCertify es una aplicacion web para registrar, organizar y compartir
certificados profesionales. Cada usuario puede crear su perfil, subir
certificados en PDF, generar un codigo QR publico y mostrar solo los
certificados marcados como publicos.

El proyecto usa Next.js App Router con frontend React y backend en Route
Handlers, Supabase para base de datos/autenticacion/storage, y Gmail/Nodemailer
para el envio de codigos de verificacion.

## Stack

- Next.js `16.2.6`
- React `19.2.4`
- TypeScript
- Supabase Auth, PostgreSQL y Storage
- Nodemailer para correos con Gmail
- QR dinamico con `qrcode`
- React Icons
- Vercel como plataforma objetivo de despliegue

## Funcionalidades actuales

- Registro de usuario con Supabase Auth.
- Login con correo y contrasena.
- Segundo paso de verificacion con codigo alfanumerico o link de un solo uso.
- Recuperacion de contrasena desde `/frontend/recuperar-contrasena`.
- Codigos y links de verificacion de un solo uso: al consumirse se eliminan de
  la base de datos.
- Proteccion de rutas privadas mediante sesion de Supabase y cookie httpOnly de
  verificacion.
- Perfil de usuario editable.
- Subida de certificados PDF a Supabase Storage.
- Validacion de PDF maximo 1 MB en frontend, backend y base de datos.
- Listado de certificados reales del usuario.
- QR dinamico que apunta a `/u/[slug]`.
- Perfil publico con certificados visibles.

## Estructura principal

```txt
app/
  api/                          # API routes de Next.js
  frontend/                     # Pantallas privadas/publicas de la UI
  u/[slug]/                     # Perfil publico escaneable por QR

backend/
  auth/                         # Auth, codigos, recuperacion y cookies
  certificates/                 # Servicios y validaciones de certificados
  config/                       # Variables de entorno
  email/                        # Envio de correos con Nodemailer
  http/                         # Respuestas y errores HTTP
  profile/                      # Perfil del usuario
  public/                       # Consultas publicas por slug
  supabase/                     # Clientes Supabase server/admin/proxy
  utils/                        # Hash, tokens y slugs

database/
  database.sql                  # Esquema completo
  migrations/                   # Migraciones incrementales

lib/api/                        # Cliente frontend para llamar al backend
```

## Requisitos

- Node.js compatible con Next.js 16.
- npm.
- Proyecto de Supabase.
- Cuenta de Gmail para envio de correos.
- Git para versionamiento.

## Instalacion

```bash
npm install
```

El proyecto usa `package-lock.json`, asi que en CI/Vercel tambien puedes usar:

```bash
npm ci
```

## Variables de entorno

Copia el ejemplo:

```bash
copy .env.example .env.local
```

En Windows PowerShell tambien puedes usar:

```powershell
Copy-Item .env.example .env.local
```

Variables importantes:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxxx
SUPABASE_SECRET_KEY=sb_secret_xxxxxxxxxxxxxxxxx

SUPABASE_CERTIFICADOS_BUCKET=certificados

AUTH_CODE_TTL_MINUTES=10
AUTH_CODE_LENGTH=7
AUTH_DEV_FIXED_CODE=A1B2C3D
PASSWORD_RESET_SESSION_TTL_MINUTES=10

EMAIL_FROM="MyCertify <tu-correo@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu-correo@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

Notas:

- `SUPABASE_SECRET_KEY` o `SUPABASE_SERVICE_ROLE_KEY` solo debe vivir en el
  servidor. No la expongas en componentes cliente.
- En desarrollo, si no configuras correo, el backend devuelve `devCode` para
  poder probar el flujo.
- Para Gmail, la forma simple es activar 2FA en Google y crear una contrasena de
  aplicacion para `SMTP_PASSWORD`.
- Tambien puedes usar OAuth2 con `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y
  `GOOGLE_REFRESH_TOKEN`.

## Base de datos

### Opcion recomendada: Supabase

1. Crea un proyecto en Supabase.
2. Abre el SQL Editor.
3. Ejecuta `database/database.sql`.
4. Verifica que exista el bucket privado `certificados` en Supabase Storage.
5. Copia las llaves del proyecto a `.env.local`.

El script crea las tablas principales, indices, constraints, bucket de Storage
y politicas RLS basicas cuando se ejecuta dentro de Supabase.

### Si ya habias ejecutado el SQL anterior

Ejecuta la migracion incremental:

```txt
database/migrations/20260524_email_codes_password_reset.sql
```

Esta migracion agrega:

- `correo_destino` y `token_hash` en `codigos_verificacion`.
- `sesiones_recuperacion_contrasena`.
- Indices para tokens de verificacion y recuperacion.

### PostgreSQL local

Puedes ejecutar `database/database.sql` en PostgreSQL local para validar el
modelo de datos. Sin embargo, el flujo completo de la app necesita Supabase
Auth y Supabase Storage, por lo que para probar autenticacion, uploads y QR
publico es mejor usar Supabase.

## Ejecutar el proyecto

Servidor de desarrollo:

```bash
npm run dev
```

Abre:

```txt
http://localhost:3000/frontend
```

Build de produccion:

```bash
npm run build
```

Servidor de produccion local:

```bash
npm run start
```

Lint:

```bash
npm run lint
```

## Flujo de autenticacion

1. El usuario inicia sesion en `/frontend/iniciar-sesion`.
2. Supabase valida correo y contrasena.
3. El backend genera codigo alfanumerico y link seguro.
4. El codigo/link se guarda hasheado en `codigos_verificacion`.
5. Se envia correo con Nodemailer.
6. El usuario valida en `/frontend/codigo` o abre el link.
7. Si la validacion es correcta, el registro se elimina de la base de datos.
8. Se crea una cookie httpOnly `mycertify-auth-verified`.
9. Las rutas privadas quedan disponibles.

Si alguien intenta reutilizar el mismo codigo o link, el backend responde que ya
no se puede usar.

## Recuperacion de contrasena

Ruta:

```txt
/frontend/recuperar-contrasena
```

Flujo:

1. El usuario ingresa su correo.
2. El backend genera codigo/link de recuperacion.
3. El usuario valida el codigo o abre el link.
4. El codigo/link se elimina de `codigos_verificacion`.
5. Se crea una sesion corta en `sesiones_recuperacion_contrasena`.
6. El usuario escribe la nueva contrasena.
7. El backend actualiza la contrasena con Supabase Admin API.
8. La sesion de recuperacion se elimina.

## Rutas principales

Frontend:

- `/frontend`
- `/frontend/registro`
- `/frontend/iniciar-sesion`
- `/frontend/codigo`
- `/frontend/recuperar-contrasena`
- `/frontend/pagina-principal`
- `/frontend/subir-certificado`
- `/frontend/mis-certificados`
- `/frontend/codigo-qr`
- `/frontend/mi-cuenta`
- `/u/[slug]`

Backend:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-code`
- `POST /api/auth/password-reset/request`
- `POST /api/auth/password-reset/verify`
- `POST /api/auth/password-reset/confirm`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/perfil`
- `PUT /api/perfil`
- `GET /api/certificados`
- `POST /api/certificados`
- `GET /api/certificados/:id`
- `GET /api/public/perfiles/:slug`

## Certificados y Storage

Los certificados se guardan en:

- `certificados`: metadatos del certificado.
- `archivos_certificado`: referencia al PDF, hash, ruta, tamano y MIME type.
- Supabase Storage bucket `certificados`: archivo PDF real.

Reglas importantes:

- Solo PDF.
- Maximo 1 MB.
- El bucket debe ser privado.
- El backend genera URLs firmadas cuando necesita mostrar o descargar archivos.

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en Vercel.
3. Configura las mismas variables de `.env.local` en Vercel Project Settings.
4. Asegurate de que `NEXT_PUBLIC_APP_URL` apunte al dominio real.
5. Ejecuta el build con `npm run build`.

Vercel detecta Next.js automaticamente.

## Documentacion adicional

La carpeta `backend/` tiene documentacion corta del backend en:

```txt
backend/README.md
```

## Notas de seguridad

- No subas `.env.local` al repositorio.
- No expongas `SUPABASE_SECRET_KEY` en el cliente.
- Los codigos y tokens se guardan hasheados.
- Los links/codigos de verificacion se eliminan al usarse.
- Los PDFs se guardan en bucket privado.
- Para produccion, usa una cuenta/correo dedicado para SMTP.
