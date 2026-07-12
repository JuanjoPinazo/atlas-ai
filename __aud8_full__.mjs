import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const get = (k) => env.split('\n').find(l => l.startsWith(k+'='))?.split('=')[1]?.trim();
const URL = get('NEXT_PUBLIC_SUPABASE_URL');
const ANON = get('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const SERVICE = get('SUPABASE_SERVICE_ROLE_KEY');
const admin = createClient(URL, SERVICE, { auth: { autoRefreshToken: false, persistSession: false } });

console.log('=== POINT 5: ACTIVE user can sign in + query own data ===');
const cA = createClient(URL, ANON);
const { data: signA, error: signAErr } = await cA.auth.signInWithPassword({ email: 'usera@audit.test', password: 'TestPass123!' });
console.log('signin userA ->', !!signA?.user, signAErr?.message);
const { data: profA, error: profAErr } = await cA.from('profiles').select('status').eq('id', signA.user.id).single();
console.log('userA profile ->', JSON.stringify({ profA, error: profAErr?.message }));
const { data: membA, error: membAErr } = await cA.from('organization_memberships').select('organization_id, role, status').eq('user_id', signA.user.id);
console.log('userA memberships ->', JSON.stringify({ membA, error: membAErr?.message }));

console.log('=== POINT 3: no recursion on organization_memberships ===');
console.log('(same query above succeeded without 42P17 ->', !membAErr || membAErr.code !== '42P17', ')');

console.log('=== POINT 10: userA reads organizations / membership rows scoped to own tenant only ===');
const { data: orgsA } = await cA.from('organizations').select('id, slug');
console.log('userA sees organizations ->', JSON.stringify(orgsA));
const { data: allMembA } = await cA.from('organization_memberships').select('organization_id, user_id');
console.log('userA sees organization_memberships (all visible rows) ->', JSON.stringify(allMembA));

const cB = createClient(URL, ANON);
const { data: signB } = await cB.auth.signInWithPassword({ email: 'userb@audit.test', password: 'TestPass123!' });
const { data: orgsB } = await cB.from('organizations').select('id, slug');
console.log('userB sees organizations ->', JSON.stringify(orgsB));
const { data: allMembB } = await cB.from('organization_memberships').select('organization_id, user_id');
console.log('userB sees organization_memberships (all visible rows) ->', JSON.stringify(allMembB));

// Cross write attempt: userA tries to update userB's membership row
const { data: crossUpdate, error: crossUpdateErr } = await cA.from('organization_memberships').update({ role: 'SUPERADMIN' }).eq('user_id', signB.user.id).select();
console.log('userA attempts to escalate userB role ->', JSON.stringify({ crossUpdate, error: crossUpdateErr?.message }));
const { data: verifyB } = await admin.from('organization_memberships').select('role').eq('user_id', signB.user.id).single();
console.log('userB role after attack attempt (admin view) ->', verifyB?.role);

console.log('=== POINT 6: SUSPENDED profile - auth layer vs data ===');
const cSusp = createClient(URL, ANON);
const { data: signSusp, error: signSuspErr } = await cSusp.auth.signInWithPassword({ email: 'suspended@audit.test', password: 'TestPass123!' });
console.log('auth layer signin (suspended) ->', !!signSusp?.user, signSuspErr?.message);
const { data: profSusp, error: profSuspErr } = await cSusp.from('profiles').select('status').eq('id', signSusp.user.id).single();
console.log('suspended profile query ->', JSON.stringify({ profSusp, error: profSuspErr?.message }));

console.log('=== POINT 7: SUSPENDED membership query ===');
const cMembSusp = createClient(URL, ANON);
const { data: signMS } = await cMembSusp.auth.signInWithPassword({ email: 'membsuspended@audit.test', password: 'TestPass123!' });
const { data: membMS, error: membMSErr } = await cMembSusp.from('organization_memberships').select('status').eq('user_id', signMS.user.id).eq('organization_id','00000000-0000-0000-0000-000000000001').single();
console.log('membsuspended membership query ->', JSON.stringify({ membMS, error: membMSErr?.message }));

console.log('=== POINT 1/2: service_role legitimate ops (rate_limits, user_invitations) ===');
const { error: rlErr } = await admin.from('rate_limits').select('*').limit(1);
console.log('service_role select rate_limits -> error:', rlErr?.message || 'NONE');
const { error: invErr } = await admin.from('user_invitations').insert({
  organization_id: '00000000-0000-0000-0000-000000000001', email: 'inv@audit.test', role: 'USUARIO',
  token_hash: 'a'.repeat(64), expires_at: new Date(Date.now()+7*86400000).toISOString()
});
console.log('service_role insert user_invitations -> error:', invErr?.message || 'NONE');
