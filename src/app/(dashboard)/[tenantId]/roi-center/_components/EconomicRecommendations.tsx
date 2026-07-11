"use client";

import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

export function EconomicRecommendations() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Target className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-xl">Recomendaciones Económicas</h3>
          <p className="text-xs text-slate-500 font-medium">Sugerencias algorítmicas para maximizar el ROI</p>
        </div>
      </div>

      <div className="space-y-4 flex-1">
        
        {/* Rec 1 */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-colors group cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Activar Empleado "Recuperador de Carritos"</h4>
            <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold px-2 py-0.5 rounded">
              +€4,500/mes est.
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Notamos que un 15% de las interacciones terminan sin concretar cita. Asignar un agente de seguimiento automático por WhatsApp aumentaría la conversión.
          </p>
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
            Simular Escenario <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Rec 2 */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-colors group cursor-pointer">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Relajar Política de Descuentos</h4>
            <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs font-bold px-2 py-0.5 rounded">
              +12% Retención est.
            </span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Flexibilizar el margen de negociación del asistente un 5% extra en tratamientos de alto valor podría evitar la fuga a competidores locales.
          </p>
          <div className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm gap-1 group-hover:gap-2 transition-all">
            Modificar Business DNA <ArrowRight className="w-4 h-4" />
          </div>
        </div>

      </div>
    </div>
  );
}
