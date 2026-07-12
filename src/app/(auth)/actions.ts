'use server'

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { checkRateLimit } from '@/lib/auth/rate-limit';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const allowed = await checkRateLimit('login', email);
  if (!allowed) {
    return { error: 'Demasiados intentos. Intenta más tarde.' };
  }

  const supabase = await createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Credenciales incorrectas' }; // Don't reveal if account exists
  }

  // Check if profile is suspended
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    console.error('login: profile check failed', profileError);
    await supabase.auth.signOut();
    return { error: 'Error al verificar la cuenta' };
  }

  if (profile.status === 'SUSPENDED') {
    await supabase.auth.signOut();
    return { error: 'Cuenta suspendida' };
  }

  redirect('/');
}

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string;

  const allowed = await checkRateLimit('forgot_password', email);
  if (!allowed) {
    return { error: 'Demasiados intentos. Intenta más tarde.' };
  }

  const supabase = await createClient();

  // Don't await this, just trigger it and return success so we don't reveal emails
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
  });

  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const password = formData.get('password') as string;
  const supabase = await createClient();
  
  // Rate limiting for reset password could be by IP, but we don't have IP here easily. 
  // We will assume it's protected enough by the callback token.

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: 'No se pudo actualizar la contraseña' };
  }

  redirect('/login?reset=success');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

