import { GitPullRequest } from 'lucide-react';
import { DecisionSimulatorApp } from './_components/DecisionSimulatorApp';

export default function DecisionEnginePage() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <GitPullRequest className="w-8 h-8 text-indigo-500" />
            Decision Engine (Admin Dashboard)
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Simula, evalúa y valida el comportamiento del motor de reglas declarativas.
          </p>
        </header>

        <DecisionSimulatorApp />
      </div>
    </div>
  );
}
