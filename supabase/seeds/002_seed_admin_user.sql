-- 002_seed_admin_user.sql
-- Seed para usuario admin y perfiles base
-- IMPORTANTE: Las contraseñas en Supabase (auth.users) normalmente se manejan vía API o triggers, 
-- pero para seeding de dev podemos insertar directamente un hash genérico o crear los perfiles.

-- Usamos UUIDs estáticos para facilitar el enlazado
DO $$
DECLARE
  admin_uid UUID := '00000000-0000-0000-0000-000000000001';
BEGIN

  -- 1. Insertar en auth.users (si la tabla es accesible)
  -- NOTA: Esto solo funcionará en un entorno local completo con la extensión pgcrypto o en un volcado raw.
  -- Asumimos que se usa un script local o inserciones dummy.
  INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    admin_uid,
    'authenticated',
    'authenticated',
    'juanjopinazo@gmail.com',
    crypt('AdminDemo123!', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Insertar en profiles
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    admin_uid,
    'juanjopinazo@gmail.com',
    'Juanjo',
    'Pinazo',
    'admin'
  )
  ON CONFLICT (id) DO UPDATE SET role = 'admin';

END $$;
