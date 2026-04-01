ALTER POLICY "Users can view relevant profiles"
ON "public"."profiles"
USING (
  (auth.uid() = id) 
  OR (role = 'doctor'::text) 
  OR (EXISTS ( 
    SELECT 1 FROM appointments a 
    WHERE a.doctor_id = auth.uid() AND a.patient_id = profiles.id
  )) 
  OR (EXISTS ( 
    SELECT 1 FROM appointments a 
    WHERE a.patient_id = auth.uid() AND a.doctor_id = profiles.id
  ))
);