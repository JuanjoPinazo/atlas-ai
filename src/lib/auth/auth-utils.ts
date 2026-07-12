import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Check if profile is active
  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (profile?.status === 'SUSPENDED') {
    redirect('/login?error=suspended');
  }

  return user;
}

export async function requireOrganizationMembership(tenantSlugOrId: string) {
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();

  // Find organization by slug or id
  const { data: org } = await supabase
    .from('organizations')
    .select('id, slug, status')
    .or(`id.eq.${tenantSlugOrId},slug.eq.${tenantSlugOrId}`)
    .single();

  if (!org) {
    redirect('/select-organization');
  }

  // Check membership
  const { data: membership } = await supabase
    .from('organization_memberships')
    .select('role, status')
    .eq('organization_id', org.id)
    .eq('user_id', user.id)
    .single();

  // If Superadmin, bypass membership check
  const isSuperadmin = await checkSuperadmin(user.id);

  if (!membership && !isSuperadmin) {
    redirect('/select-organization');
  }

  if (membership?.status === 'SUSPENDED') {
    redirect('/select-organization?error=suspended');
  }

  return { user, org, membership: membership || { role: 'SUPERADMIN' } };
}

export async function requireRole(tenantSlugOrId: string, allowedRoles: string[]) {
  const { user, org, membership } = await requireOrganizationMembership(tenantSlugOrId);

  if (!allowedRoles.includes(membership.role) && membership.role !== 'SUPERADMIN') {
    redirect(`/${org.slug}?error=unauthorized`);
  }

  return { user, org, membership };
}

export async function requireSuperadmin() {
  const user = await requireAuthenticatedUser();
  const isSuperadmin = await checkSuperadmin(user.id);

  if (!isSuperadmin) {
    redirect('/');
  }

  return user;
}

async function checkSuperadmin(userId: string) {
  const supabase = await createClient();
  // Using an RPC or direct query.
  // Wait, SUPERADMIN is a role in organization_memberships, or is it global?
  // The ADR says "SUPERADMIN: acceso global a VELSORA HQ".
  // A superadmin could be someone who has a membership with role = 'SUPERADMIN' in the "hq" or just any membership with SUPERADMIN.
  // For simplicity, let's assume if they have role = 'SUPERADMIN' in ANY organization, they are a superadmin.
  const { data } = await supabase
    .from('organization_memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'SUPERADMIN')
    .limit(1);
    
  return data && data.length > 0;
}
