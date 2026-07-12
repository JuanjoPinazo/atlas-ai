import { createAdminClient } from '@/lib/supabase/admin';

/**
 * Validates against rate limits in the database.
 * Returns true if allowed, false if blocked.
 */
export async function checkRateLimit(
  actionType: string,
  identifier: string,
  maxAttempts: number = 5,
  windowMinutes: number = 15
): Promise<boolean> {
  const adminClient = createAdminClient();

  const { data: record, error } = await adminClient
    .from('rate_limits')
    .select('*')
    .eq('action_type', actionType)
    .eq('identifier', identifier)
    .single();

  const now = new Date();

  // If no record, create one
  if (error || !record) {
    await adminClient.from('rate_limits').insert({
      action_type: actionType,
      identifier,
      attempts: 1,
      blocked_until: null,
    });
    return true;
  }

  // Check if currently blocked
  if (record.blocked_until && new Date(record.blocked_until) > now) {
    return false;
  }

  // If window expired since last updated, reset
  const updated = new Date(record.updated_at);
  const diffMinutes = (now.getTime() - updated.getTime()) / 60000;

  if (diffMinutes > windowMinutes) {
    await adminClient
      .from('rate_limits')
      .update({ attempts: 1, blocked_until: null, updated_at: now.toISOString() })
      .eq('id', record.id);
    return true;
  }

  // If within window, increment
  const newAttempts = record.attempts + 1;
  let newBlockedUntil = null;

  if (newAttempts > maxAttempts) {
    newBlockedUntil = new Date(now.getTime() + windowMinutes * 60000).toISOString();
  }

  await adminClient
    .from('rate_limits')
    .update({ 
      attempts: newAttempts, 
      blocked_until: newBlockedUntil, 
      updated_at: now.toISOString() 
    })
    .eq('id', record.id);

  return newAttempts <= maxAttempts;
}
