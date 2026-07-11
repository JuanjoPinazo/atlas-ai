"use client";

import React from 'react';
import { ValueOpportunity } from '@/lib/schemas/business-value';

interface Props {
  opportunities: ValueOpportunity[];
}

const COLUMNS = [
  { id: 'detected', label: 'Detectadas', color: 'border-red-500/30 bg-red-500/5' },
  { id: 'analyzing', label: 'En Análisis', color: 'border-amber-500/30 bg-amber-500/5' },
  { id: 'executing', label: 'Ejecutando (Atlas)', color: 'border-indigo-500/30 bg-indigo-500/5' },
  { id: 'recovered', label: 'Recuperado', color: 'border-emerald-500/30 bg-emerald-500/5' }
];

export function OpportunityKanban({ opportunities }: Props) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm overflow-x-auto">
      <h3 className="text-xl font-bold text-white mb-6">Pipeline de Generación de Valor</h3>
      
      <div className="flex gap-4 min-w-max pb-4">
        {COLUMNS.map(column => {
          const columnOps = opportunities.filter(o => o.status === column.id);
          const columnTotal = columnOps.reduce((acc, curr) => acc + curr.potential_roi, 0);

          return (
            <div key={column.id} className={`w-80 rounded-2xl border ${column.color} p-4 flex flex-col`}>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-300 uppercase tracking-widest text-xs">{column.label}</h4>
                <span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded-full">
                  €{columnTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {columnOps.map(op => (
                  <div key={op.id} className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-lg cursor-grab hover:border-slate-500 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        op.impact_level === 'high' ? 'bg-red-500/20 text-red-400' :
                        op.impact_level === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        Impacto: {op.impact_level}
                      </span>
                      <span className="text-emerald-400 font-bold text-sm">€{op.potential_roi}</span>
                    </div>
                    <h5 className="font-bold text-white text-sm mb-1">{op.title}</h5>
                    <p className="text-xs text-slate-400 line-clamp-2">{op.description}</p>
                  </div>
                ))}
                {columnOps.length === 0 && (
                  <div className="h-24 border-2 border-dashed border-slate-700/50 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                    Vacío
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
