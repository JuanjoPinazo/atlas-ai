"use client";

import React from 'react';
import { ValueOpportunity } from '@/lib/schemas/business-value';
import { Target, ArrowRight } from 'lucide-react';

interface Props {
  opportunities: ValueOpportunity[];
}

export function TopOpportunities({ opportunities }: Props) {
  const top10 = [...opportunities].sort((a, b) => b.potential_roi - a.potential_roi).slice(0, 10);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <Target className="w-5 h-5 text-amber-500" />
        Ranking de Oportunidades (Top 10)
      </h3>
      <p className="text-sm text-slate-400 mb-6">Acciones con mayor potencial de recuperación inmediata.</p>
      
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
        {top10.map((op, index) => (
          <div key={op.id} className="group bg-slate-900 border border-slate-700 hover:border-slate-500 p-4 rounded-xl transition-all cursor-pointer flex gap-4 items-center">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-400 text-sm group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-white text-sm">{op.title}</h4>
                <span className="text-emerald-400 font-bold text-sm">€{op.potential_roi}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{op.commercial_explanation}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}
