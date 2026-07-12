const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://qhsbvjtxtwqlisvrgowa.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function main() {
  const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
  
  if (listError) {
    console.error('Error listing users:', listError);
    return;
  }

  const user = usersData.users.find(u => u.email === 'juanjopinazo@gmail.com');
  if (!user) {
    console.log('User not found in list!');
    return;
  }
  
  console.log('User found:', user.email, 'Confirmed at:', user.email_confirmed_at);
  
  const { data, error } = await supabase.auth.admin.updateUserById(
    user.id,
    { password: 'juanjo26', email_confirm: true }
  );

  if (error) {
    console.error('Error updating user:', error.message);
  } else {
    console.log('User password updated and email confirmed successfully.');
  }
}

main();
