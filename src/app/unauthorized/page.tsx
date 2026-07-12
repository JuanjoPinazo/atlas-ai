import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-red-500">
            Acceso Denegado
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            No tienes los permisos necesarios para acceder a esta área.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
