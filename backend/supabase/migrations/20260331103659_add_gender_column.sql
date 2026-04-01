ALTER TABLE public.profiles
  ADD COLUMN gender text NULL
  CONSTRAINT profiles_gender_check
    CHECK (gender = ANY (ARRAY['male'::text, 'female'::text, 'other'::text]));

ALTER TABLE public.patients
  ADD COLUMN address text NULL;
