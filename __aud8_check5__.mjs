import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const env = fs.readFileSync('.env.local', 'utf8');
const get = (k) => env.split('\n').find(l => l.startsWith(k+'='))?.split('=')[1]?.trim();
const URL = get('NEXT_PUBLIC_SUPABASE_URL');
const ANON = get('NEXT_PUBLIC_SUPABASE_ANON_KEY');

const cA = createClient(URL, ANON);
const { data: signA, error: signAErr } = await cA.auth.signInWithPassword({ email: 'usera@audit.test', password: 'TestPass123!' });
console.log('signin ok?', !!signA?.user, signAErr?.message);

const { data: rpcData, error: rpcErr } = await cA.rpc('is_active_member', { org_id: '00000000-0000-0000-0000-000000000001' });
console.log('is_active_member RPC ->', JSON.stringify({ rpcData, error: rpcErr?.message }));

const { data: memData2, error: memErr2 } = await cA.from('organization_memberships').select('*').eq('user_id', signA.user.id);
console.log('direct membership select by own user_id ->', JSON.stringify({ memData2, error: memErr2?.message }));
