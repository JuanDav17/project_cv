SET search_path TO public;

ALTER TABLE public.perfiles_usuario
  ADD COLUMN IF NOT EXISTS areas_interes JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.certificados
  DROP CONSTRAINT IF EXISTS certificados_id_usuario_fkey,
  ADD CONSTRAINT certificados_id_usuario_fkey
    FOREIGN KEY (id_usuario)
    REFERENCES public.usuarios(id_usuario)
    ON DELETE CASCADE;

ALTER TABLE public.archivos_certificado
  DROP CONSTRAINT IF EXISTS archivos_certificado_id_certificado_fkey,
  ADD CONSTRAINT archivos_certificado_id_certificado_fkey
    FOREIGN KEY (id_certificado)
    REFERENCES public.certificados(id_certificado)
    ON DELETE CASCADE;

ALTER TABLE public.certificado_etiquetas
  DROP CONSTRAINT IF EXISTS certificado_etiquetas_id_certificado_fkey,
  DROP CONSTRAINT IF EXISTS certificado_etiquetas_id_etiqueta_fkey,
  ADD CONSTRAINT certificado_etiquetas_id_certificado_fkey
    FOREIGN KEY (id_certificado)
    REFERENCES public.certificados(id_certificado)
    ON DELETE CASCADE,
  ADD CONSTRAINT certificado_etiquetas_id_etiqueta_fkey
    FOREIGN KEY (id_etiqueta)
    REFERENCES public.etiquetas(id_etiqueta)
    ON DELETE CASCADE;

ALTER TABLE public.certificado_carreras
  DROP CONSTRAINT IF EXISTS certificado_carreras_id_certificado_fkey,
  DROP CONSTRAINT IF EXISTS certificado_carreras_id_carrera_fkey,
  ADD CONSTRAINT certificado_carreras_id_certificado_fkey
    FOREIGN KEY (id_certificado)
    REFERENCES public.certificados(id_certificado)
    ON DELETE CASCADE,
  ADD CONSTRAINT certificado_carreras_id_carrera_fkey
    FOREIGN KEY (id_carrera)
    REFERENCES public.carreras(id_carrera)
    ON DELETE CASCADE;

ALTER TABLE public.certificado_areas
  DROP CONSTRAINT IF EXISTS certificado_areas_id_certificado_fkey,
  DROP CONSTRAINT IF EXISTS certificado_areas_id_area_fkey,
  ADD CONSTRAINT certificado_areas_id_certificado_fkey
    FOREIGN KEY (id_certificado)
    REFERENCES public.certificados(id_certificado)
    ON DELETE CASCADE,
  ADD CONSTRAINT certificado_areas_id_area_fkey
    FOREIGN KEY (id_area)
    REFERENCES public.areas_conocimiento(id_area)
    ON DELETE CASCADE;
