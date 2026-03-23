-- 1. Revoke everything from the public/anonymous user first
REVOKE ALL ON TABLE public.appointments FROM anon;
REVOKE ALL ON TABLE public.medical_records FROM anon;
REVOKE ALL ON TABLE public.doctors FROM anon;
REVOKE ALL ON TABLE public.patients FROM anon;
REVOKE ALL ON TABLE public.profiles FROM anon;

-- 2. Only allow anonymous users to SEE the doctor's availability
GRANT SELECT ON TABLE public.availability TO anon;

-- 3. Give full access ONLY to logged-in users (RLS will still filter WHAT they see)
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;