import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const get = (k) => env.split('\n').find(l => l.startsWith(k+'='))?.split('=')[1]?.trim();
const URL = get('NEXT_PUBLIC_SUPABASE_URL');
const SERVICE = get('SUPABASE_SERVICE_ROLE_KEY');
const admin = createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });

async function mkUser(email, status) {
  const { data, error } = await admin.auth.admin.createUser({ email, password: 'TestPass123!', email_confirm: true });
  if (error) { console.log('createUser error', email, error.message); return null; }
  const { error: profErr } = await admin.from('profiles').insert({ id: data.user.id, email, status });
  if (profErr) console.log('profile insert error', email, profErr.message);
  return data.user.id;
}

const idA = await mkUser('usera@audit.test', 'ACTIVE');
const idB = await mkUser('userb@audit.test', 'ACTIVE');
const idSusp = await mkUser('suspended@audit.test', 'SUSPENDED');
const idMembSusp = await mkUser('membsuspended@audit.test', 'ACTIVE');
console.log('ids', { idA, idB, idSusp, idMembSusp });

const memberships = [
  { organization_id: '00000000-0000-0000-0000-000000000001', user_id: idA, role: 'USUARIO', status: 'ACTIVE' },
  { organization_id: '00000000-0000-0000-0000-0000000000b2', user_id: idB, role: 'USUARIO', status: 'ACTIVE' },
  { organization_id: '00000000-0000-0000-0000-000000000001', user_id: idSusp, role: 'USUARIO', status: 'ACTIVE' },
  { organization_id: '00000000-0000-0000-0000-000000000001', user_id: idMembSusp, role: 'USUARIO', status: 'SUSPENDED' },
];
for (const m of memberships) {
  const { error } = await admin.from('organization_memberships').insert(m);
  if (error) console.log('membership insert error', m.user_id, error.message);
}
console.log('done');
