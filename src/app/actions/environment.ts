"use server";

import { SERVER_ENVIRONMENT } from '@/config/server-environment';

export async function getServerEnvironmentBadge() {
  if (!SERVER_ENVIRONMENT.IS_ADMIN) return null;
  return {
    mode: SERVER_ENVIRONMENT.RUNTIME_MODE.toUpperCase(),
    provider: SERVER_ENVIRONMENT.DATA_PROVIDER.toUpperCase()
  };
}
