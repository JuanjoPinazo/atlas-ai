export type AtlasRuntimeMode = 'development_local' | 'demo' | 'staging' | 'production';
export type AtlasDataProvider = 'local' | 'supabase';

const runtimeMode = (process.env.ATLAS_RUNTIME_MODE || 'demo') as AtlasRuntimeMode;
const dataProvider = (process.env.ATLAS_DATA_PROVIDER || 'local') as AtlasDataProvider;

if (runtimeMode === 'production' && dataProvider !== 'supabase') {
  throw new Error('ATLAS_RUNTIME_ERROR: Production environment strictly requires supabase provider.');
}
if (runtimeMode === 'staging' && dataProvider !== 'supabase') {
  throw new Error('ATLAS_RUNTIME_ERROR: Staging environment strictly requires supabase provider.');
}
if (dataProvider === 'local' && !['development_local', 'demo'].includes(runtimeMode)) {
  throw new Error('ATLAS_RUNTIME_ERROR: Local provider is only allowed in development_local or demo modes.');
}

export const SERVER_ENVIRONMENT = {
  RUNTIME_MODE: runtimeMode,
  DATA_PROVIDER: dataProvider,
  IS_ADMIN: process.env.NEXT_PUBLIC_IS_ADMIN === 'true'
};
