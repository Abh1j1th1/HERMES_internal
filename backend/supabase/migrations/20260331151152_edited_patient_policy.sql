
DROP POLICY IF EXISTS "No direct inserts on patients" ON patients;

CREATE POLICY "Users can create their own patient record"
ON patients
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);
