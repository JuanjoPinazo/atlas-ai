'use client';

import { forgotPassword } from '../actions';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-zinc-900 p-8 rounded-2xl shadow-xl border border-zinc-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Recuperar Contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Ingresa tu email para recibir un enlace de recuperación
          </p>
        </div>
        <form className="mt-8 space-y-6" action={async (formData) => {
          const res = await forgotPassword(formData);
          if (res?.error) {
            alert(res.error);
          } else {
            alert('Enlace de recuperación enviado. Por favor, revisa tu correo electrónico.');
          }
        }}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-lg border-0 bg-zinc-800 py-3 px-4 text-white placeholder-zinc-400 focus:z-10 focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
            >
              Enviar enlace
            </button>
          </div>
          
          <div className="text-center text-sm">
            <Link href="/login" className="font-semibold text-zinc-400 hover:text-white transition-colors">
              Volver al inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
