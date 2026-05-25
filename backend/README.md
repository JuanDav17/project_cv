# Backend MyCertify

Esta carpeta contiene la logica de servidor. Las rutas HTTP viven en
`app/backend/api` y llaman servicios de esta carpeta para mantener separado
Next.js, Supabase y las reglas de negocio.

## Rutas disponibles

- `POST /backend/api/auth/register`
- `POST /backend/api/auth/login`
- `POST /backend/api/auth/verify-code`
- `POST /backend/api/auth/password-reset/request`
- `POST /backend/api/auth/password-reset/verify`
- `POST /backend/api/auth/password-reset/confirm`
- `POST /backend/api/auth/logout`
- `GET /backend/api/auth/me`
- `GET /backend/api/perfil`
- `PUT /backend/api/perfil`
- `GET /backend/api/certificados`
- `POST /backend/api/certificados`
- `GET /backend/api/certificados/:id`
- `GET /backend/api/public/perfiles/:slug`

## Supabase

1. Crea el proyecto en Supabase.
2. Ejecuta `database/database.sql` en el SQL Editor.
3. Crea o confirma el bucket privado `certificados`.
4. Copia `.env.example` a `.env.local` y completa las variables.

El backend sube PDFs a Supabase Storage y guarda metadatos en
`certificados` y `archivos_certificado`. El limite de PDF es 1 MB tanto en
frontend como en base de datos.

## Flujo de sesion

El login usa email y contrasena de Supabase Auth. Luego genera un codigo
alfanumerico y un enlace de un solo uso en `codigos_verificacion`. Cuando se
usa el codigo o enlace, el registro se borra; si se intenta repetir, el backend
responde que ya no se puede usar.

La recuperacion de contrasena usa el mismo mecanismo, pero al validar el codigo
crea una sesion corta en `sesiones_recuperacion_contrasena`. Esa sesion se borra
cuando la contrasena se actualiza.

## Correos con Google

Configura `.env.local` con las variables SMTP de Gmail. Para desarrollo la ruta
mas simple es usar una contrasena de aplicacion de Google:

- `SMTP_USER`: tu correo Gmail.
- `SMTP_PASSWORD`: contrasena de aplicacion.
- `EMAIL_FROM`: remitente visible.

Tambien puedes usar OAuth2 con `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` y
`GOOGLE_REFRESH_TOKEN`; si existe `GOOGLE_REFRESH_TOKEN`, Nodemailer usara esa
configuracion.
