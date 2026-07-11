import React from 'react';
import { TrendingUp, AlertTriangle, CheckSquare } from 'lucide-react';

export function InsightsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Opportunities */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
          <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          Oportunidades
        </h3>
        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-green-100 dark:border-green-900/50 bg-green-50/50 dark:bg-green-900/10">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-green-700 dark:text-green-400">Upsell Detectado:</span> 12 clientes preguntaron por funcionalidades avanzadas hoy. Podríamos crear una propuesta automatizada.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Eficiencia:</span> El tiempo medio de respuesta ha bajado a 1.2s tras optimizar los dominios.
            </p>
          </div>
        </div>
      </div>

      {/* Risks & Actions */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            Riesgos Activos
          </h3>
          <div className="p-4 rounded-xl border border-red-100 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
            <p className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-red-700 dark:text-red-400">Policy Conflict:</span> 3 clientes solicitaron reembolsos, activando el límite estricto en tu ADN. Se ha derivado al equipo humano.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            Próximas Acciones
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 border-slate-300 rounded text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Revisar las 2 propuestas generadas pendientes de aprobación.</span>
            </li>
            <li className="flex items-start gap-3">
              <input type="checkbox" className="mt-1 border-slate-300 rounded text-indigo-600 focus:ring-indigo-500" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Subir el nuevo catálogo al Company Brain.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
