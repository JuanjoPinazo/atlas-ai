import { requireAuthenticatedUser } from '@/lib/auth/auth-utils';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function SelectOrganizationPage() {
  const user = await requireAuthenticatedUser();
  const supabase = await createClient();

  const { data: memberships } = await supabase
    .from('organization_memberships')
    .select('role, organizations(id, name, slug)')
    .eq('user_id', user.id)
    .eq('status', 'ACTIVE');

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Selecciona tu Organización
          </h2>
        </div>
        
        {(!memberships || memberships.length === 0) ? (
          <div className="text-center text-zinc-400">
            No tienes organizaciones asignadas. Contacta con tu administrador.
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {memberships.map((membership: any) => (
              <Link
                key={membership.organizations.id}
                href={`/${membership.organizations.slug}`}
                className="block w-full rounded-lg border border-zinc-800 bg-zinc-950 p-4 hover:border-indigo-500 hover:bg-zinc-800 transition-colors text-center text-white"
              >
                <div className="font-semibold">{membership.organizations.name}</div>
                <div className="text-xs text-zinc-400 mt-1">Rol: {membership.role}</div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
