ALTER TABLE public.appointments
  DROP CONSTRAINT appointments_patient_id_fkey,
  DROP CONSTRAINT appointments_doctor_id_fkey;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_patient_id_fkey
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  ADD CONSTRAINT appointments_doctor_id_fkey
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE;
