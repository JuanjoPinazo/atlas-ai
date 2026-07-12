import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  // Check if profile is active (Fail-closed)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('requireAuthenticatedUser: profile lookup failed', profileError);
    // Any error means we assume no access
    redirect('/login?error=profile_error');
  }

  if (profile.status !== 'ACTIVE') {
    redirect('/login?error=suspended');
  }

  return user;
}

export async function requireOrganizationMembership(tenantSlugOrId: string) {
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();

  // Find organization by slug or id safely
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(tenantSlugOrId);
  
  let orgQuery;
  if (isUuid) {
    orgQuery = supabase.from('organizations').select('id, slug, status').eq('id', tenantSlugOrId).single();
  } else {
    orgQuery = supabase.from('organizations').select('id, slug, status').eq('slug', tenantSlugOrId).single();
  }

  const { data: org, error: orgError } = await orgQuery;

  if (orgError || !org) {
    console.error('requireOrganizationMembership: org lookup failed', orgError);
    redirect('/select-organization');
  }

  if (org.status !== 'ACTIVE') {
    redirect('/select-organization?error=org_suspended');
  }

  // Check membership
  const { data: membership, error: membershipError } = await supabase
    .from('organization_memberships')
    .select('role, status')
    .eq('organization_id', org.id)
    .eq('user_id', user.id)
    .single();

  // If Superadmin globally, they can bypass local membership
  const isSuperadmin = await checkSuperadmin(user.id);

  if (membershipError || !membership) {
    if (!isSuperadmin) {
      console.error('requireOrganizationMembership: membership lookup failed or user is not a member', membershipError);
      redirect('/select-organization');
    }
  } else if (membership.status !== 'ACTIVE') {
    // If membership exists but is not active (e.g. SUSPENDED), deny access EVEN IF superadmin
    if (membership.status === 'SUSPENDED') {
      redirect('/select-organization?error=suspended');
    } else {
      // Pending or other states
      redirect('/select-organization?error=pending');
    }
  }

  return { user, org, membership: membership || { role: 'SUPERADMIN', status: 'ACTIVE' } };
}

export async function requireRole(tenantSlugOrId: string, allowedRoles: string[]) {
  const { user, org, membership } = await requireOrganizationMembership(tenantSlugOrId);

  if (!allowedRoles.includes(membership.role) && membership.role !== 'SUPERADMIN') {
    redirect('/unauthorized');
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
  const { data, error } = await supabase
    .from('organization_memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('role', 'SUPERADMIN')
    .limit(1);
    
  if (error) {
    console.error('checkSuperadmin: failed', error);
    return false; // Fail-closed
  }
  return data && data.length > 0;
}
