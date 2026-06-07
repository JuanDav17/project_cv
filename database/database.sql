SET search_path TO public;
-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. TABLAS INDEPENDIENTES (Sin llaves foráneas a otras)
-- ==========================================

-- Tabla usuarios
CREATE table usuarios (
    id_usuario UUID PRIMARY KEY NOT NULL,
    correo VARCHAR(255) UNIQUE NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'activo',
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_estado CHECK (estado IN ('activo','inactivo','suspendido'))
);

-- Tabla codigos_verificacion
CREATE TABLE codigos_verificacion (
    id_codigo UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    id_usuario UUID NOT NULL REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    correo_destino VARCHAR(255),
    codigo_hash VARCHAR(64) NOT NULL,
    token_hash VARCHAR(64) UNIQUE,
    proposito VARCHAR(30) NOT NULL DEFAULT 'login',
    expira_en TIMESTAMP NOT NULL,
    usado BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_uso TIMESTAMP,
    CONSTRAINT chk_proposito_codigo CHECK (proposito IN ('login','email','password_reset'))
);
CREATE INDEX idx_codigos_usuario ON public.codigos_verificacion(id_usuario);
CREATE INDEX idx_codigos_vigentes ON public.codigos_verificacion(id_usuario, proposito, usado, expira_en);
CREATE UNIQUE INDEX idx_codigos_token ON public.codigos_verificacion(token_hash);

-- Tabla sesiones_recuperacion_contrasena
CREATE TABLE sesiones_recuperacion_contrasena (
    id_sesion UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    id_usuario UUID NOT NULL REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    token_hash VARCHAR(64) UNIQUE NOT NULL,
    expira_en TIMESTAMP NOT NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_recuperacion_usuario ON public.sesiones_recuperacion_contrasena(id_usuario);
CREATE INDEX idx_recuperacion_token ON public.sesiones_recuperacion_contrasena(token_hash);

-- Tabla instituciones
CREATE TABLE instituciones (
    id_institucion UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    nombre_institucion VARCHAR(200) NOT NULL,
    tipo_institucion VARCHAR(60),
    pais VARCHAR(80),
    sitio_web VARCHAR(255),
    logo_url VARCHAR(500),
    verificada BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT chk_tipo_institucion CHECK (
        tipo_institucion IN ('universidad','plataforma_online','empresa_tech','instituto','otro')
    )
);

-- Tabla niveles_formacion
CREATE TABLE niveles_formacion (
    id_nivel UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    nombre_nivel VARCHAR(80) UNIQUE NOT NULL,
    descripcion TEXT,
    orden SMALLINT NOT NULL DEFAULT 0,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);

-- Tabla areas_conocimiento
CREATE TABLE areas_conocimiento (
    id_area UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    area_padre UUID REFERENCES public.areas_conocimiento(id_area),
    nombre_area VARCHAR(120) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX idx_areas_padre ON public.areas_conocimiento(area_padre);

-- Tabla etiquetas
CREATE TABLE etiquetas (
    id_etiqueta UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    nombre_etiqueta VARCHAR(80) UNIQUE NOT NULL,
    color VARCHAR(7) DEFAULT '#6366F1',
    CONSTRAINT chk_color CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
);


-- ==========================================
-- 2. TABLAS CON DEPENDENCIAS PRIMARIAS
-- ==========================================

-- Tabla carreras
CREATE TABLE carreras (
    id_carrera UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    id_nivel UUID REFERENCES public.niveles_formacion(id_nivel),
    id_area_general UUID REFERENCES public.areas_conocimiento(id_area),
    nombre_carrera VARCHAR(150) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE INDEX idx_carreras_area ON public.carreras(id_area_general);
CREATE INDEX idx_carreras_nivel ON public.carreras(id_nivel);

-- Tabla certificados
CREATE TABLE certificados (
    id_certificado UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    id_usuario UUID NOT NULL REFERENCES public.usuarios(id_usuario) ON DELETE CASCADE,
    id_institucion UUID REFERENCES public.instituciones(id_institucion),
    titulo_certificado VARCHAR(300) NOT NULL,
    descripcion TEXT,
    codigo_credencial VARCHAR(150),
    url_credencial VARCHAR(500),
    duracion_horas INT NOT NULL,
    rango_horas VARCHAR(20) NOT NULL,
    modalidad VARCHAR(30),
    fecha_emision DATE,
    visibilidad VARCHAR(20) NOT NULL DEFAULT 'publico',
    verificado_plataforma BOOLEAN NOT NULL DEFAULT FALSE,
    destacado BOOLEAN NOT NULL DEFAULT FALSE,
    orden_display SMALLINT NOT NULL DEFAULT 0,
    tema VARCHAR(100),
    tipo_certificado VARCHAR(100),
    color VARCHAR(7),
    fecha_creacion TIMESTAMP NOT NULL DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_duracion CHECK (duracion_horas >= 0),
    CONSTRAINT chk_rango CHECK (rango_horas IN ('3-39','40-90','+90')),
    CONSTRAINT chk_modalidad CHECK (modalidad IN ('online','presencial','hibrido','autoestudio')),
    CONSTRAINT chk_visibilidad CHECK (visibilidad IN ('publico','privado'))
);
CREATE INDEX idx_certificados_destacado ON public.certificados(destacado);
CREATE INDEX idx_certificados_institucion ON public.certificados(id_institucion);
CREATE INDEX idx_certificados_rango ON public.certificados(rango_horas);
CREATE INDEX idx_certificados_usuario ON public.certificados(id_usuario);
CREATE INDEX idx_certificados_visibilidad ON public.certificados(visibilidad);


-- ==========================================
-- 3. TABLAS COMPLEJAS Y DE RELACIÓN (Muchos a Muchos)
-- ==========================================

-- Tabla perfiles_usuario
CREATE TABLE perfiles_usuario (
    id_perfil UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    id_usuario UUID UNIQUE NOT NULL REFERENCES public.usuarios(id_usuario),
    id_carrera_principal UUID REFERENCES public.carreras(id_carrera),
    id_nivel_actual UUID REFERENCES public.niveles_formacion(id_nivel),
    id_area_interes UUID REFERENCES public.areas_conocimiento(id_area),
    slug_publico VARCHAR(100) UNIQUE NOT NULL,
    descripcion_perfil TEXT,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    pais VARCHAR(80),
    ciudad VARCHAR(80),
    titulo_profesional VARCHAR(150),
    url_linkedin VARCHAR(255),
    url_github VARCHAR(255),
    url_portafolio VARCHAR(255),
    avatar_url VARCHAR(500),
    areas_interes JSONB DEFAULT '[]'::jsonb,
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_perfiles_slug ON public.perfiles_usuario(slug_publico);

-- Tabla archivos_certificado
CREATE TABLE archivos_certificado (
    id_archivo UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    id_certificado UUID NOT NULL REFERENCES public.certificados(id_certificado) ON DELETE CASCADE,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_mime VARCHAR(80) NOT NULL DEFAULT 'application/pdf',
    tamano_bytes INT NOT NULL,
    hash_archivo VARCHAR(64),
    es_actual BOOLEAN NOT NULL DEFAULT TRUE,
    fecha_subida TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_tipo_mime CHECK (tipo_mime = 'application/pdf'),
    CONSTRAINT chk_tamano CHECK (tamano_bytes > 0 AND tamano_bytes <= 1048576)
);
CREATE INDEX idx_archivos_certificado ON public.archivos_certificado(id_certificado);

-- Tabla certificado_etiquetas
CREATE TABLE certificado_etiquetas (
    id_certificado UUID NOT NULL REFERENCES public.certificados(id_certificado) ON DELETE CASCADE,
    id_etiqueta UUID NOT NULL REFERENCES public.etiquetas(id_etiqueta) ON DELETE CASCADE,
    PRIMARY KEY (id_certificado, id_etiqueta)
);

-- Tabla certificado_carreras
CREATE TABLE certificado_carreras (
    id_certificado UUID NOT NULL REFERENCES public.certificados(id_certificado) ON DELETE CASCADE,
    id_carrera UUID NOT NULL REFERENCES public.carreras(id_carrera) ON DELETE CASCADE,
    PRIMARY KEY (id_certificado, id_carrera)
);

-- Tabla certificado_areas
CREATE TABLE certificado_areas (
    id_certificado UUID NOT NULL REFERENCES public.certificados(id_certificado) ON DELETE CASCADE,
    id_area UUID NOT NULL REFERENCES public.areas_conocimiento(id_area) ON DELETE CASCADE,
    PRIMARY KEY (id_certificado, id_area)
);

-- ==========================================
-- 4. CONFIGURACION SUPABASE OPCIONAL
-- ==========================================
-- Este bloque se ejecuta en Supabase. En PostgreSQL plano se omite si no existen
-- los esquemas auth/storage.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'storage') THEN
        EXECUTE $sql$
            INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
            VALUES ('certificados', 'certificados', false, 1048576, ARRAY['application/pdf'])
            ON CONFLICT (id) DO UPDATE
            SET public = EXCLUDED.public,
                file_size_limit = EXCLUDED.file_size_limit,
                allowed_mime_types = EXCLUDED.allowed_mime_types
        $sql$;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
        ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.perfiles_usuario ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.archivos_certificado ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.codigos_verificacion ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.sesiones_recuperacion_contrasena ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.instituciones ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.niveles_formacion ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.areas_conocimiento ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.carreras ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.etiquetas ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.certificado_etiquetas ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.certificado_carreras ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.certificado_areas ENABLE ROW LEVEL SECURITY;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'usuarios' AND policyname = 'usuarios_select_own') THEN
            EXECUTE 'CREATE POLICY usuarios_select_own ON public.usuarios FOR SELECT TO authenticated USING (id_usuario = auth.uid())';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'perfiles_usuario' AND policyname = 'perfiles_select_own') THEN
            EXECUTE 'CREATE POLICY perfiles_select_own ON public.perfiles_usuario FOR SELECT TO authenticated USING (id_usuario = auth.uid())';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'perfiles_usuario' AND policyname = 'perfiles_update_own') THEN
            EXECUTE 'CREATE POLICY perfiles_update_own ON public.perfiles_usuario FOR UPDATE TO authenticated USING (id_usuario = auth.uid()) WITH CHECK (id_usuario = auth.uid())';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'certificados' AND policyname = 'certificados_select_own') THEN
            EXECUTE 'CREATE POLICY certificados_select_own ON public.certificados FOR SELECT TO authenticated USING (id_usuario = auth.uid())';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'certificados' AND policyname = 'certificados_insert_own') THEN
            EXECUTE 'CREATE POLICY certificados_insert_own ON public.certificados FOR INSERT TO authenticated WITH CHECK (id_usuario = auth.uid())';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'certificados' AND policyname = 'certificados_update_own') THEN
            EXECUTE 'CREATE POLICY certificados_update_own ON public.certificados FOR UPDATE TO authenticated USING (id_usuario = auth.uid()) WITH CHECK (id_usuario = auth.uid())';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'certificados' AND policyname = 'certificados_delete_own') THEN
            EXECUTE 'CREATE POLICY certificados_delete_own ON public.certificados FOR DELETE TO authenticated USING (id_usuario = auth.uid())';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'archivos_certificado' AND policyname = 'archivos_select_own') THEN
            EXECUTE 'CREATE POLICY archivos_select_own ON public.archivos_certificado FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.certificados c WHERE c.id_certificado = archivos_certificado.id_certificado AND c.id_usuario = auth.uid()))';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instituciones' AND policyname = 'instituciones_select_authenticated') THEN
            EXECUTE 'CREATE POLICY instituciones_select_authenticated ON public.instituciones FOR SELECT TO authenticated USING (true)';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'instituciones' AND policyname = 'instituciones_insert_authenticated') THEN
            EXECUTE 'CREATE POLICY instituciones_insert_authenticated ON public.instituciones FOR INSERT TO authenticated WITH CHECK (true)';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'niveles_formacion' AND policyname = 'niveles_select_authenticated') THEN
            EXECUTE 'CREATE POLICY niveles_select_authenticated ON public.niveles_formacion FOR SELECT TO authenticated USING (true)';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'areas_conocimiento' AND policyname = 'areas_select_authenticated') THEN
            EXECUTE 'CREATE POLICY areas_select_authenticated ON public.areas_conocimiento FOR SELECT TO authenticated USING (true)';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'carreras' AND policyname = 'carreras_select_authenticated') THEN
            EXECUTE 'CREATE POLICY carreras_select_authenticated ON public.carreras FOR SELECT TO authenticated USING (true)';
        END IF;

        IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'etiquetas' AND policyname = 'etiquetas_select_authenticated') THEN
            EXECUTE 'CREATE POLICY etiquetas_select_authenticated ON public.etiquetas FOR SELECT TO authenticated USING (true)';
        END IF;
    END IF;
END $$;
