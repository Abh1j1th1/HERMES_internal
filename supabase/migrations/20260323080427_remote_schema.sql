drop extension if exists "pg_net";

create type "public"."color_source" as enum ('99COLORS_NET', 'ART_PAINTS_YG07S', 'BYRNE', 'CRAYOLA', 'CMYK_COLOR_MODEL', 'COLORCODE_IS', 'COLORHEXA', 'COLORXS', 'CORNELL_UNIVERSITY', 'COLUMBIA_UNIVERSITY', 'DUKE_UNIVERSITY', 'ENCYCOLORPEDIA_COM', 'ETON_COLLEGE', 'FANTETTI_AND_PETRACCHI', 'FINDTHEDATA_COM', 'FERRARIO_1919', 'FEDERAL_STANDARD_595', 'FLAG_OF_INDIA', 'FLAG_OF_SOUTH_AFRICA', 'GLAZEBROOK_AND_BALDRY', 'GOOGLE', 'HEXCOLOR_CO', 'ISCC_NBS', 'KELLY_MOORE', 'MATTEL', 'MAERZ_AND_PAUL', 'MILK_PAINT', 'MUNSELL_COLOR_WHEEL', 'NATURAL_COLOR_SYSTEM', 'PANTONE', 'PLOCHERE', 'POURPRE_COM', 'RAL', 'RESENE', 'RGB_COLOR_MODEL', 'THOM_POOLE', 'UNIVERSITY_OF_ALABAMA', 'UNIVERSITY_OF_CALIFORNIA_DAVIS', 'UNIVERSITY_OF_CAMBRIDGE', 'UNIVERSITY_OF_NORTH_CAROLINA', 'UNIVERSITY_OF_TEXAS_AT_AUSTIN', 'X11_WEB', 'XONA_COM');

create sequence "public"."medical_records_id_seq";


  create table "public"."appointments" (
    "id" uuid not null default gen_random_uuid(),
    "patient_id" uuid not null,
    "doctor_id" uuid not null,
    "scheduled_at" timestamp with time zone not null,
    "status" text default 'scheduled'::text
      );


alter table "public"."appointments" enable row level security;


  create table "public"."availability" (
    "id" uuid not null default gen_random_uuid(),
    "doctor_id" uuid,
    "day" text not null,
    "start_time" time without time zone not null,
    "end_time" time without time zone not null
      );


alter table "public"."availability" enable row level security;


  create table "public"."doctors" (
    "id" uuid not null,
    "specialization" text not null,
    "license_no" text not null
      );


alter table "public"."doctors" enable row level security;


  create table "public"."medical_records" (
    "id" integer not null default nextval('public.medical_records_id_seq'::regclass),
    "appointment_id" uuid not null,
    "description" text not null,
    "prescription" text,
    "vitals" jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."medical_records" enable row level security;


  create table "public"."patients" (
    "id" uuid not null,
    "dob" date not null
      );


alter table "public"."patients" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "full_name" text not null,
    "role" text not null,
    "email" text not null
      );


alter table "public"."profiles" enable row level security;

alter sequence "public"."medical_records_id_seq" owned by "public"."medical_records"."id";

CREATE UNIQUE INDEX appointments_pkey ON public.appointments USING btree (id);

CREATE UNIQUE INDEX availability_doctor_id_start_time_day_key ON public.availability USING btree (doctor_id, start_time, day);

CREATE UNIQUE INDEX availability_pkey ON public.availability USING btree (id);

CREATE UNIQUE INDEX doctors_license_no_key ON public.doctors USING btree (license_no);

CREATE UNIQUE INDEX doctors_pkey ON public.doctors USING btree (id);

CREATE UNIQUE INDEX medical_records_appointment_id_key ON public.medical_records USING btree (appointment_id);

CREATE UNIQUE INDEX medical_records_pkey ON public.medical_records USING btree (id);

CREATE UNIQUE INDEX patients_pkey ON public.patients USING btree (id);

CREATE UNIQUE INDEX profiles_email_key ON public.profiles USING btree (email);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

alter table "public"."appointments" add constraint "appointments_pkey" PRIMARY KEY using index "appointments_pkey";

alter table "public"."availability" add constraint "availability_pkey" PRIMARY KEY using index "availability_pkey";

alter table "public"."doctors" add constraint "doctors_pkey" PRIMARY KEY using index "doctors_pkey";

alter table "public"."medical_records" add constraint "medical_records_pkey" PRIMARY KEY using index "medical_records_pkey";

alter table "public"."patients" add constraint "patients_pkey" PRIMARY KEY using index "patients_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."appointments" add constraint "appointments_doctor_id_fkey" FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) not valid;

alter table "public"."appointments" validate constraint "appointments_doctor_id_fkey";

alter table "public"."appointments" add constraint "appointments_patient_id_fkey" FOREIGN KEY (patient_id) REFERENCES public.patients(id) not valid;

alter table "public"."appointments" validate constraint "appointments_patient_id_fkey";

alter table "public"."appointments" add constraint "appointments_status_check" CHECK ((status = ANY (ARRAY['scheduled'::text, 'completed'::text, 'cancelled'::text]))) not valid;

alter table "public"."appointments" validate constraint "appointments_status_check";

alter table "public"."availability" add constraint "availability_doctor_id_fkey" FOREIGN KEY (doctor_id) REFERENCES public.doctors(id) ON DELETE CASCADE not valid;

alter table "public"."availability" validate constraint "availability_doctor_id_fkey";

alter table "public"."availability" add constraint "availability_doctor_id_start_time_day_key" UNIQUE using index "availability_doctor_id_start_time_day_key";

alter table "public"."availability" add constraint "valid_time_range" CHECK ((end_time > start_time)) not valid;

alter table "public"."availability" validate constraint "valid_time_range";

alter table "public"."doctors" add constraint "doctors_id_fkey" FOREIGN KEY (id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."doctors" validate constraint "doctors_id_fkey";

alter table "public"."doctors" add constraint "doctors_license_no_key" UNIQUE using index "doctors_license_no_key";

alter table "public"."medical_records" add constraint "medical_records_appointment_id_fkey" FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE not valid;

alter table "public"."medical_records" validate constraint "medical_records_appointment_id_fkey";

alter table "public"."medical_records" add constraint "medical_records_appointment_id_key" UNIQUE using index "medical_records_appointment_id_key";

alter table "public"."patients" add constraint "patients_id_fkey" FOREIGN KEY (id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."patients" validate constraint "patients_id_fkey";

alter table "public"."profiles" add constraint "profiles_email_key" UNIQUE using index "profiles_email_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_role_check" CHECK ((role = ANY (ARRAY['doctor'::text, 'patient'::text]))) not valid;

alter table "public"."profiles" validate constraint "profiles_role_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'patient') -- Default to patient if missing
  );
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."appointments" to "anon";

grant insert on table "public"."appointments" to "anon";

grant references on table "public"."appointments" to "anon";

grant select on table "public"."appointments" to "anon";

grant trigger on table "public"."appointments" to "anon";

grant truncate on table "public"."appointments" to "anon";

grant update on table "public"."appointments" to "anon";

grant delete on table "public"."appointments" to "authenticated";

grant insert on table "public"."appointments" to "authenticated";

grant references on table "public"."appointments" to "authenticated";

grant select on table "public"."appointments" to "authenticated";

grant trigger on table "public"."appointments" to "authenticated";

grant truncate on table "public"."appointments" to "authenticated";

grant update on table "public"."appointments" to "authenticated";

grant delete on table "public"."appointments" to "service_role";

grant insert on table "public"."appointments" to "service_role";

grant references on table "public"."appointments" to "service_role";

grant select on table "public"."appointments" to "service_role";

grant trigger on table "public"."appointments" to "service_role";

grant truncate on table "public"."appointments" to "service_role";

grant update on table "public"."appointments" to "service_role";

grant delete on table "public"."availability" to "anon";

grant insert on table "public"."availability" to "anon";

grant references on table "public"."availability" to "anon";

grant select on table "public"."availability" to "anon";

grant trigger on table "public"."availability" to "anon";

grant truncate on table "public"."availability" to "anon";

grant update on table "public"."availability" to "anon";

grant delete on table "public"."availability" to "authenticated";

grant insert on table "public"."availability" to "authenticated";

grant references on table "public"."availability" to "authenticated";

grant select on table "public"."availability" to "authenticated";

grant trigger on table "public"."availability" to "authenticated";

grant truncate on table "public"."availability" to "authenticated";

grant update on table "public"."availability" to "authenticated";

grant delete on table "public"."availability" to "service_role";

grant insert on table "public"."availability" to "service_role";

grant references on table "public"."availability" to "service_role";

grant select on table "public"."availability" to "service_role";

grant trigger on table "public"."availability" to "service_role";

grant truncate on table "public"."availability" to "service_role";

grant update on table "public"."availability" to "service_role";

grant delete on table "public"."doctors" to "anon";

grant insert on table "public"."doctors" to "anon";

grant references on table "public"."doctors" to "anon";

grant select on table "public"."doctors" to "anon";

grant trigger on table "public"."doctors" to "anon";

grant truncate on table "public"."doctors" to "anon";

grant update on table "public"."doctors" to "anon";

grant delete on table "public"."doctors" to "authenticated";

grant insert on table "public"."doctors" to "authenticated";

grant references on table "public"."doctors" to "authenticated";

grant select on table "public"."doctors" to "authenticated";

grant trigger on table "public"."doctors" to "authenticated";

grant truncate on table "public"."doctors" to "authenticated";

grant update on table "public"."doctors" to "authenticated";

grant delete on table "public"."doctors" to "service_role";

grant insert on table "public"."doctors" to "service_role";

grant references on table "public"."doctors" to "service_role";

grant select on table "public"."doctors" to "service_role";

grant trigger on table "public"."doctors" to "service_role";

grant truncate on table "public"."doctors" to "service_role";

grant update on table "public"."doctors" to "service_role";

grant delete on table "public"."medical_records" to "anon";

grant insert on table "public"."medical_records" to "anon";

grant references on table "public"."medical_records" to "anon";

grant select on table "public"."medical_records" to "anon";

grant trigger on table "public"."medical_records" to "anon";

grant truncate on table "public"."medical_records" to "anon";

grant update on table "public"."medical_records" to "anon";

grant delete on table "public"."medical_records" to "authenticated";

grant insert on table "public"."medical_records" to "authenticated";

grant references on table "public"."medical_records" to "authenticated";

grant select on table "public"."medical_records" to "authenticated";

grant trigger on table "public"."medical_records" to "authenticated";

grant truncate on table "public"."medical_records" to "authenticated";

grant update on table "public"."medical_records" to "authenticated";

grant delete on table "public"."medical_records" to "service_role";

grant insert on table "public"."medical_records" to "service_role";

grant references on table "public"."medical_records" to "service_role";

grant select on table "public"."medical_records" to "service_role";

grant trigger on table "public"."medical_records" to "service_role";

grant truncate on table "public"."medical_records" to "service_role";

grant update on table "public"."medical_records" to "service_role";

grant delete on table "public"."patients" to "anon";

grant insert on table "public"."patients" to "anon";

grant references on table "public"."patients" to "anon";

grant select on table "public"."patients" to "anon";

grant trigger on table "public"."patients" to "anon";

grant truncate on table "public"."patients" to "anon";

grant update on table "public"."patients" to "anon";

grant delete on table "public"."patients" to "authenticated";

grant insert on table "public"."patients" to "authenticated";

grant references on table "public"."patients" to "authenticated";

grant select on table "public"."patients" to "authenticated";

grant trigger on table "public"."patients" to "authenticated";

grant truncate on table "public"."patients" to "authenticated";

grant update on table "public"."patients" to "authenticated";

grant delete on table "public"."patients" to "service_role";

grant insert on table "public"."patients" to "service_role";

grant references on table "public"."patients" to "service_role";

grant select on table "public"."patients" to "service_role";

grant trigger on table "public"."patients" to "service_role";

grant truncate on table "public"."patients" to "service_role";

grant update on table "public"."patients" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


  create policy "Doctors view assigned appointments"
  on "public"."appointments"
  as permissive
  for select
  to public
using ((auth.uid() = doctor_id));



  create policy "Patients can book appointments"
  on "public"."appointments"
  as permissive
  for insert
  to public
with check ((auth.uid() = patient_id));



  create policy "Patients view own appointments"
  on "public"."appointments"
  as permissive
  for select
  to public
using ((auth.uid() = patient_id));



  create policy "Users can see their own appointments"
  on "public"."appointments"
  as permissive
  for select
  to public
using (((auth.uid() = patient_id) OR (auth.uid() = doctor_id)));



  create policy "Anyone can view availability"
  on "public"."availability"
  as permissive
  for select
  to public
using (true);



  create policy "Doctors manage own availability"
  on "public"."availability"
  as permissive
  for all
  to public
using ((auth.uid() = doctor_id));



  create policy "Doctors can view full history of their patients"
  on "public"."medical_records"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.appointments a_inner
  WHERE ((a_inner.id = medical_records.appointment_id) AND (a_inner.patient_id IN ( SELECT a_outer.patient_id
           FROM public.appointments a_outer
          WHERE (a_outer.doctor_id = auth.uid())))))));



  create policy "Patients view own records"
  on "public"."medical_records"
  as permissive
  for select
  to public
using ((EXISTS ( SELECT 1
   FROM public.appointments
  WHERE ((appointments.id = medical_records.appointment_id) AND (appointments.patient_id = auth.uid())))));


CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


