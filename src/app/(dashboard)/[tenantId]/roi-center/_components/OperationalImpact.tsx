"use client";

import React from 'react';
import { ShieldAlert, Wallet } from 'lucide-react';

export function OperationalImpact() {
  const chartData = [
    { month: 'Ene', value: 30 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 65 },
    { month: 'Abr', value: 50 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 100 },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <h3 className="font-bold text-slate-900 dark:text-white text-xl mb-8">Impacto Operativo</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Cancellations Avoided */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 flex-shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">128</span>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mt-1">Cancelaciones Evitadas</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Intervenciones de la IA que lograron reprogramar o retener al cliente antes de que ejecutara una cancelación.
            </p>
          </div>
        </div>

        {/* Budgets Recovered */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">€15,200</span>
            <h4 className="font-bold text-slate-700 dark:text-slate-300 mt-1">Presupuestos Recuperados</h4>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
              Capital reactivado mediante seguimientos (follow-ups) automáticos realizados por los Empleados Digitales.
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="mt-auto">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Crecimiento Mensual del Ahorro</h4>
        <div className="h-32 flex items-end gap-2 md:gap-4">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
              <div 
                className="w-full bg-indigo-100 dark:bg-indigo-900/40 rounded-t-lg relative group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/60 transition-colors"
                style={{ height: `${data.value}%` }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {data.value}k
                </div>
              </div>
              <span className="text-xs font-medium text-slate-500">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
