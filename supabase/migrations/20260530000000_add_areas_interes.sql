ALTER TABLE public.perfiles_usuario 
ADD COLUMN IF NOT EXISTS areas_interes JSONB DEFAULT '[]'::jsonb;
