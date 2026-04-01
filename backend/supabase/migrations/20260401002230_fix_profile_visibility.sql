DROP POLICY "Users can view relevant profiles" ON public.profiles;

CREATE POLICY "Users can view relevant profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id
  OR role = 'doctor'
  OR EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.doctor_id = auth.uid()
    AND a.patient_id = id
  )
  OR EXISTS (
    SELECT 1 FROM appointments a
    WHERE a.patient_id = auth.uid()
    AND a.doctor_id = id
  )
);
