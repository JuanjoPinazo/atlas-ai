-- Seed data for VELSORA IAM

-- Note: In a real environment, auth.users inserts should happen via the Supabase Auth API.
-- For local development, we can insert directly if needed, or assume the user signs up.
-- Here we'll just insert the organization.

INSERT INTO organizations (id, name, slug, status, vertical)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'VELSORA Demo Dental',
    'demo-dental',
    'ACTIVE',
    'DENTAL'
) ON CONFLICT (slug) DO NOTHING;

-- Instruction for manual seed:
-- 1. Create a user via Supabase Studio or CLI.
-- 2. Insert into profiles (id, email) VALUES ('uuid-of-user', 'admin@velsora.com');
-- 3. Insert into organization_memberships (organization_id, user_id, role) VALUES ('00000000-0000-0000-0000-000000000001', 'uuid-of-user', 'SUPERADMIN');
