"use client";

import React from 'react';

export function HeatmapLosses() {
  const areas = [
    { name: 'Recepción', loss: 85, color: 'bg-red-500' },
    { name: 'Agenda', loss: 60, color: 'bg-orange-500' },
    { name: 'Ventas', loss: 90, color: 'bg-red-600' },
    { name: 'Marketing', loss: 40, color: 'bg-amber-500' },
    { name: 'Operaciones', loss: 20, color: 'bg-yellow-500' },
    { name: 'Fidelización', loss: 75, color: 'bg-red-400' }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-2">Mapa de Calor de Fugas</h3>
      <p className="text-sm text-slate-400 mb-6">Dónde se está perdiendo más valor económico.</p>
      
      <div className="flex-1 grid grid-cols-2 gap-4">
        {areas.map(area => (
          <div key={area.name} className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-700 flex flex-col items-center justify-center p-4 group">
            <div 
              className={`absolute inset-0 ${area.color} opacity-20 group-hover:opacity-40 transition-opacity`} 
              style={{ height: `${area.loss}%`, top: 'auto', bottom: 0 }}
            />
            <div className="relative z-10 text-center">
              <span className="block text-white font-bold">{area.name}</span>
              <span className="text-xs font-bold text-slate-400 mt-1 block">Severidad: {area.loss}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
