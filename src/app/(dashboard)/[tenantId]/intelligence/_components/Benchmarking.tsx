"use client";

import React from 'react';
import { BarChart3 } from 'lucide-react';

export function Benchmarking() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">Sector Benchmarking</h3>
          <p className="text-xs text-slate-500 font-medium">Comparativa vs. Clínicas Dentales en España</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-6">
        
        {/* Metric 1 */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Resolución en primer contacto</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">+12% vs Sector</span>
          </div>
          <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-[85%] bg-indigo-500 rounded-full z-10" />
            <div className="absolute top-0 left-0 h-full w-[73%] bg-slate-300 dark:bg-slate-600 rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Tu Atlas: 85%</span>
            <span>Media Sector: 73%</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Tiempo medio de respuesta</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">0.8s más rápido</span>
          </div>
          <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-[25%] bg-indigo-500 rounded-full z-10" />
            <div className="absolute top-0 left-0 h-full w-[45%] bg-slate-300 dark:bg-slate-600 rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Tu Atlas: 1.2s</span>
            <span>Media Sector: 2.0s</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">Precisión de políticas ADN</span>
            <span className="font-bold text-amber-500">-2% vs Sector</span>
          </div>
          <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-[94%] bg-indigo-500 rounded-full z-10" />
            <div className="absolute top-0 left-0 h-full w-[96%] bg-slate-300 dark:bg-slate-600 rounded-full" />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Tu Atlas: 94%</span>
            <span>Media Sector: 96%</span>
          </div>
        </div>

      </div>
    </div>
  );
}
