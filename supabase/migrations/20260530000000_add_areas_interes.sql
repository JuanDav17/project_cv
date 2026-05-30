ALTER TABLE public.perfiles_usuario 
ADD COLUMN areas_interes JSONB DEFAULT '[]'::jsonb;
