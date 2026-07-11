"use client";

import React from 'react';
import { ValueOpportunity } from '@/lib/schemas/business-value';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface Props {
  opportunities: ValueOpportunity[];
}

export function ValueHero({ opportunities }: Props) {
  const costOfInaction = opportunities
    .filter(o => o.status === 'detected' || o.status === 'analyzing')
    .reduce((acc, curr) => acc + curr.potential_roi, 0);

  const recoverableValue = opportunities
    .filter(o => o.status !== 'recovered')
    .reduce((acc, curr) => acc + curr.potential_roi, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Cost of Inaction */}
      <div className="bg-red-950/30 border border-red-500/30 rounded-3xl p-8 shadow-2xl shadow-red-500/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center border border-red-500/30 text-red-400">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-red-400 uppercase tracking-widest text-sm">Coste de no actuar</span>
              <p className="text-xs text-slate-400 mt-1">Pérdida mensual estimada actual</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl md:text-7xl font-extrabold text-white tracking-tight">-€{costOfInaction.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Recoverable Value */}
      <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl shadow-emerald-500/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-emerald-400 uppercase tracking-widest text-sm">Valor Recuperable</span>
              <p className="text-xs text-slate-400 mt-1">Potencial económico de la cartera activa</p>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl md:text-7xl font-extrabold text-white tracking-tight">+€{recoverableValue.toLocaleString()}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
