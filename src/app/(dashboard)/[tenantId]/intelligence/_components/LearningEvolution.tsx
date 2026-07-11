"use client";

import React from 'react';
import { Activity } from 'lucide-react';

export function LearningEvolution() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8">
      
      {/* Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center border-r border-slate-100 dark:border-slate-800 pr-0 md:pr-8">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6 text-center w-full">Madurez del Cerebro</h3>
        
        <div className="relative w-48 h-24 overflow-hidden mb-4">
          {/* Semi-circle background */}
          <div className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-slate-100 dark:border-slate-800" />
          {/* Active progress */}
          <div 
            className="absolute top-0 left-0 w-48 h-48 rounded-full border-[16px] border-indigo-500 border-b-transparent border-r-transparent transform -rotate-45"
            style={{ transition: 'transform 1s ease-out' }}
          />
          {/* Inner masking to make it look like a gauge */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">82%</span>
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mt-1">Óptimo</span>
          </div>
        </div>

        <p className="text-sm text-slate-500 text-center max-w-xs mt-4">
          El modelo tiene suficientes reglas de ADN y contexto para operar autónomamente en un 82% de las situaciones.
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 flex flex-col justify-center pl-0 md:pl-4">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-slate-400" />
          <h3 className="font-bold text-slate-900 dark:text-white">Evolución de Entidades</h3>
        </div>

        <div className="space-y-6">
          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-900/30" />
            <div className="absolute left-[4px] top-4 w-0.5 h-10 bg-slate-200 dark:bg-slate-800" />
            <p className="text-sm font-bold text-slate-900 dark:text-white">Hoy</p>
            <p className="text-xs text-slate-500">Actualización v1.2 instalada desde Network</p>
          </div>
          
          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <div className="absolute left-[4px] top-4 w-0.5 h-10 bg-slate-200 dark:bg-slate-800" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Hace 3 días</p>
            <p className="text-xs text-slate-500">Ingesta manual de 4 documentos de conocimiento</p>
          </div>

          <div className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Hace 1 semana</p>
            <p className="text-xs text-slate-500">Instalación inicial del Knowledge Pack</p>
          </div>
        </div>
      </div>

    </div>
  );
}
