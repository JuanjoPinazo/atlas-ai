import { SimulatorApp } from './_components/SimulatorApp';

export default function SimulatorPage() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-cyan-400">
            Atlas AI Simulator
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Escribe una intención y descubre cómo el Context Engine procesa, filtra y recupera conocimiento en tiempo real.
          </p>
        </header>

        <SimulatorApp />
      </div>
    </div>
  );
}
