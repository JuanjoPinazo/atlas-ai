"use client";

import React from 'react';
import { Play } from 'lucide-react';

export function ExecutiveCopilot() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Executive Copilot</h2>
      
      <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[80px] opacity-30" />
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white">
            <Play className="w-5 h-5 ml-1" />
          </div>
          <div>
            <h3 className="text-white font-bold">Resumen Diario (Generado por IA)</h3>
            <p className="text-sm text-slate-400">Hace 2 horas</p>
          </div>
        </div>

        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            "Buenos días. Ayer cerramos con una facturación de <strong>€4,200</strong>, superando el objetivo diario en un 15%. 
            Atlas recuperó 2 presupuestos antiguos que sumaron €1,500."
          </p>
          <p>
            "<strong>Riesgo detectado:</strong> Hay 3 pacientes VIP que no han vuelto en más de 8 meses. 
            He dejado preparada una campaña de reactivación en borrador para tu aprobación."
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/30 p-4 rounded-xl mt-4">
            <button className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">
              Revisar Campaña Propuesta →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
