"use client";

import React from 'react';
import { Lightbulb, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

export function ProactiveAlerts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Recommendations */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm group hover:border-indigo-500/50 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Recomendación de IA</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 h-16 line-clamp-3">
          Detectamos 15 quejas sobre "Tiempo de envío" en los últimos 3 días. Sugiero añadir una nueva Política de ADN para ofrecer envíos exprés automáticos en estos casos.
        </p>
        <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-2 transition-all">
          Revisar borrador <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Anomalies */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm group hover:border-red-500/50 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Anomalía Detectada</h3>
        </div>
        <div className="mb-4 h-16 flex flex-col justify-center">
          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-red-600 dark:text-red-400">+240%</span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 pb-1">Escalados a humanos</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Comparado con la media semanal.</p>
        </div>
        <button className="text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-1 hover:gap-2 transition-all">
          Analizar logs <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Opportunities */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm group hover:border-emerald-500/50 transition-colors">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white">Oportunidad Activa</h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 h-16 line-clamp-3">
          El 30% de los usuarios que preguntan por el plan básico terminan cerrando el chat sin comprar. He generado un guion persuasivo alternativo para test A/B.
        </p>
        <button className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:gap-2 transition-all">
          Ver Test A/B <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
