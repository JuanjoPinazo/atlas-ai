import { acceptInvite } from '@/app/actions/user-management';

export default async function AcceptInvitePage(props: { searchParams: Promise<{ token?: string }> }) {
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
        <h2>Enlace de invitación inválido.</h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Aceptar Invitación
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Crea tu contraseña para acceder a VELSORA
          </p>
        </div>
        <form className="mt-8 space-y-6" action={acceptInvite}>
          <input type="hidden" name="token" value={token} />
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="relative block w-full rounded-lg border-0 bg-zinc-800 py-3 px-4 text-white placeholder-zinc-400 focus:z-10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="Contraseña"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Unirse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
