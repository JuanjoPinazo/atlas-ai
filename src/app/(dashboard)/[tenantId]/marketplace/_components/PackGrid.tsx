"use client";

import React from 'react';
import { KnowledgePack } from '@/lib/data/knowledge-packs';
import * as Icons from 'lucide-react';

interface Props {
  packs: KnowledgePack[];
  onSelectPack: (pack: KnowledgePack) => void;
}

export function PackGrid({ packs, onSelectPack }: Props) {
  if (packs.length === 0) {
    return (
      <div className="text-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <p className="text-slate-500">No hay Knowledge Packs disponibles para esta vertical todavía.</p>
      </div>
    );
  }

  const colorMap: Record<string, { bg: string, text: string }> = {
    emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
    slate: { bg: 'bg-slate-100 dark:bg-slate-900/30', text: 'text-slate-600 dark:text-slate-400' },
    indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packs.map(pack => {
        // @ts-ignore
        const Icon = Icons[pack.icon] || Icons.Box;
        const colors = colorMap[pack.color] || colorMap.indigo;

        return (
          <div 
            key={pack.id}
            onClick={() => onSelectPack(pack)}
            className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform`}>
                <Icon className="w-7 h-7" />
              </div>
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                {pack.vertical}
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pack.name}</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 flex-1 line-clamp-3">
              {pack.description}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-center">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Reglas DNA</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{pack.metrics.rules}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Docs</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{pack.metrics.documents}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Agentes</p>
                <p className="font-bold text-slate-700 dark:text-slate-300">{pack.metrics.agents}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
