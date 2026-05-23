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
    id_usuario UUID NOT NULL REFERENCES public.usuarios(id_usuario),
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
    fecha_actualizacion TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX idx_perfiles_slug ON public.perfiles_usuario(slug_publico);

-- Tabla archivos_certificado
CREATE TABLE archivos_certificado (
    id_archivo UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    id_certificado UUID NOT NULL REFERENCES public.certificados(id_certificado),
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
    id_certificado UUID NOT NULL REFERENCES public.certificados(id_certificado),
    id_etiqueta UUID NOT NULL REFERENCES public.etiquetas(id_etiqueta),
    PRIMARY KEY (id_certificado, id_etiqueta)
);

-- Tabla certificado_carreras
CREATE TABLE certificado_carreras (
    id_certificado UUID NOT NULL REFERENCES public.certificados(id_certificado),
    id_carrera UUID NOT NULL REFERENCES public.carreras(id_carrera),
    PRIMARY KEY (id_certificado, id_carrera)
);

-- Tabla certificado_areas
CREATE TABLE certificado_areas (
    id_certificado UUID NOT NULL REFERENCES public.certificados(id_certificado),
    id_area UUID NOT NULL REFERENCES public.areas_conocimiento(id_area),
    PRIMARY KEY (id_certificado, id_area)
);