"use client";

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';

export function ImpactSimulator() {
  const [conversion, setConversion] = useState(15);
  const [ticket, setTicket] = useState(800);

  const estimatedImpact = conversion * ticket * 4; // Arbitrary logic for demo

  return (
    <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 shadow-sm h-full flex flex-col relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-20 pointer-events-none" />

      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
        Simulador de Impacto
      </h3>
      <p className="text-sm text-slate-400 mb-6">Ajusta los parámetros para proyectar el ROI si Atlas toma el control.</p>
      
      <div className="space-y-6 flex-1">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300 font-bold">Mejora en Conversión (%)</span>
            <span className="text-indigo-400 font-bold">+{conversion}%</span>
          </div>
          <input 
            type="range" 
            min="1" max="50" 
            value={conversion}
            onChange={(e) => setConversion(Number(e.target.value))}
            className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-300 font-bold">Ticket Medio Recuperado (€)</span>
            <span className="text-indigo-400 font-bold">€{ticket}</span>
          </div>
          <input 
            type="range" 
            min="100" max="3000" step="50"
            value={ticket}
            onChange={(e) => setTicket(Number(e.target.value))}
            className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" 
          />
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-indigo-500/30 flex items-center justify-between">
        <span className="text-sm text-slate-400 font-bold">Proyección Mensual:</span>
        <span className="text-3xl font-extrabold text-emerald-400">€{estimatedImpact.toLocaleString()}</span>
      </div>
    </div>
  );
}
