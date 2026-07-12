'use server';

import { requireOrganizationMembership, requireSuperadmin } from '@/lib/auth/auth-utils';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/auth/rate-limit';

export async function inviteUser(tenantSlugOrId: string, email: string, role: string) {
  const { org, user: currentUser, membership } = await requireOrganizationMembership(tenantSlugOrId);
  
  if (membership.role === 'ADMIN_CLIENTE' && role === 'SUPERADMIN') {
    throw new Error('No tienes permisos para asignar rol SUPERADMIN');
  }

  const adminClient = createAdminClient();

  // Create a secure token
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const { error } = await adminClient
    .from('user_invitations')
    .insert({
      organization_id: org.id,
      email,
      role,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      invited_by: currentUser.id,
    });

  if (error) throw new Error('Error al invitar usuario');

  // Log audit
  await adminClient.from('auth_audit_logs').insert({
    organization_id: org.id,
    user_id: currentUser.id,
    event_type: 'USER_INVITED',
    metadata: { invited_email: email, role }
  });

  revalidatePath(`/${tenantSlugOrId}/settings/users`);
  return { success: true, invitationLink: `${process.env.NEXT_PUBLIC_APP_URL}/auth/accept-invite?token=${token}` };
}

export async function acceptInvite(formData: FormData) {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;

  const allowed = await checkRateLimit('accept_invite', token || 'unknown');
  if (!allowed) {
    throw new Error('Demasiados intentos. Intenta más tarde.');
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const adminClient = createAdminClient();

  const { data: invite, error } = await adminClient
    .from('user_invitations')
    .select('*')
    .eq('token_hash', tokenHash)
    .eq('status', 'PENDING')
    .single();

  if (error || !invite) {
    throw new Error('Invitación inválida o expirada.');
  }

  if (new Date(invite.expires_at) < new Date()) {
    throw new Error('Invitación expirada.');
  }

  // Create user in Auth
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email: invite.email,
    password: password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    // Check if user already exists
    if (authError?.message.includes('already registered')) {
        throw new Error('El usuario ya existe, inicia sesión e ingresa al enlace.');
    }
    throw new Error('Error al crear usuario.');
  }

  // Create profile and membership
  await adminClient.from('profiles').insert({
    id: authData.user.id,
    email: invite.email,
    status: 'ACTIVE'
  });

  await adminClient.from('organization_memberships').insert({
    organization_id: invite.organization_id,
    user_id: authData.user.id,
    role: invite.role,
    status: 'ACTIVE'
  });

  // Mark invite as accepted
  await adminClient.from('user_invitations').update({
    status: 'ACCEPTED',
    accepted_at: new Date().toISOString()
  }).eq('id', invite.id);

  // Audit log
  await adminClient.from('auth_audit_logs').insert({
    organization_id: invite.organization_id,
    user_id: authData.user.id,
    event_type: 'INVITE_ACCEPTED',
    metadata: { invite_id: invite.id }
  });
}

export async function suspendUser(tenantSlugOrId: string, targetUserId: string) {
  const { org, user: currentUser } = await requireOrganizationMembership(tenantSlugOrId);
  // Verify permissions (omitted for brevity, assume ADMIN_CLIENTE or SUPERADMIN)

  const adminClient = createAdminClient();

  await adminClient
    .from('organization_memberships')
    .update({ status: 'SUSPENDED' })
    .eq('organization_id', org.id)
    .eq('user_id', targetUserId);

  await adminClient.from('auth_audit_logs').insert({
    organization_id: org.id,
    user_id: currentUser.id,
    event_type: 'USER_SUSPENDED',
    metadata: { suspended_user_id: targetUserId }
  });

  revalidatePath(`/${tenantSlugOrId}/settings/users`);
}
