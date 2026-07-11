"use client";

import React from 'react';
import { Star } from 'lucide-react';

export function AtlasMaturity() {
  const levels = [
    { level: 1, title: 'Ad-hoc', desc: 'Procesos manuales, datos en silos.', status: 'past' },
    { level: 2, title: 'Digitalizado', desc: 'Software de gestión básico, sin IA.', status: 'past' },
    { level: 3, title: 'Conectado', desc: 'Atlas instalado, respuestas en borrador.', status: 'current' },
    { level: 4, title: 'Autónomo', desc: 'Atlas toma decisiones y ejecuta acciones simples.', status: 'future' },
    { level: 5, title: 'Cognitivo', desc: 'Orquestación total de flujos complejos.', status: 'future' }
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-8">Nivel de Madurez (Atlas Maturity)</h2>
      
      <div className="space-y-4 relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10 z-0" />

        {levels.map((l, i) => (
          <div key={l.level} className="relative z-10 flex items-center gap-6">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 font-bold shadow-lg ${
              l.status === 'past' ? 'bg-indigo-900 border-indigo-500 text-indigo-300' :
              l.status === 'current' ? 'bg-emerald-500 border-white text-white scale-110 shadow-emerald-500/50 animate-pulse' :
              'bg-slate-800 border-slate-600 text-slate-500'
            }`}>
              {l.status === 'current' ? <Star className="w-5 h-5" /> : l.level}
            </div>
            
            <div className={`flex-1 p-5 rounded-2xl border backdrop-blur-md transition-all ${
              l.status === 'current' ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5'
            }`}>
              <h3 className={`font-bold ${l.status === 'current' ? 'text-emerald-400' : 'text-slate-300'}`}>Nivel {l.level}: {l.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{l.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
