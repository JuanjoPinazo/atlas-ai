import { redirect } from 'next/navigation';
import { requireAuthenticatedUser } from '@/lib/auth/auth-utils';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  if (process.env.VELSORA_DEMO_PUBLIC === 'true') {
    redirect('/demo-dental/discovery/interview');
  }

  const user = await requireAuthenticatedUser();
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from('organization_memberships')
    .select('role, organizations(slug)')
    .eq('user_id', user.id)
    .eq('status', 'ACTIVE');

  const isSuperadmin = memberships?.some((m) => m.role === 'SUPERADMIN');

  if (isSuperadmin) {
    // Show option to enter HQ or select organization
    redirect('/select-organization'); 
  }

  if (!memberships || memberships.length === 0) {
    redirect('/select-organization?error=no-org');
  }

  if (memberships.length === 1) {
    // @ts-ignore
    const slug = memberships[0].organizations.slug;
    redirect(`/${slug}`);
  }

  redirect('/select-organization');
}

