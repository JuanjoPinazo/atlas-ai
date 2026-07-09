-- 001_seed_hospitals.sql
-- Datos iniciales de hospitales

INSERT INTO public.hospitals (id, name, city, country, center_type)
VALUES 
  ('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Hospital Clínico Universitario de Valencia', 'Valencia', 'España', 'academic'),
  ('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Hospital Universitario y Politécnico La Fe', 'Valencia', 'España', 'academic'),
  ('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Hospital General Universitario de Alicante', 'Alicante', 'España', 'public_general'),
  ('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Centro Demo OPSTAR (Virtual)', 'Madrid', 'España', 'demo')
ON CONFLICT (id) DO NOTHING;
