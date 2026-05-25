SET search_path TO public;

ALTER TABLE public.codigos_verificacion
    ADD COLUMN IF NOT EXISTS correo_destino VARCHAR(255),
    ADD COLUMN IF NOT EXISTS token_hash VARCHAR(64);

CREATE UNIQUE INDEX IF NOT EXISTS idx_codigos_token
    ON public.codigos_verificacion(token_hash);

CREATE TABLE IF NOT EXISTS public.sesiones_recuperacion_contrasena (
    id_sesion UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    id_usuario UUID NOT NULL REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expira_en TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recuperacion_usuario
    ON public.sesiones_recuperacion_contrasena(id_usuario);

CREATE INDEX IF NOT EXISTS idx_recuperacion_token
    ON public.sesiones_recuperacion_contrasena(token_hash);

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
        ALTER TABLE public.sesiones_recuperacion_contrasena ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;
