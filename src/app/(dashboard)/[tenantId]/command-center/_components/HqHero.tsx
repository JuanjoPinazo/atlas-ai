"use client";

import React from 'react';
import { ClientNode } from '@/lib/schemas/command-center';
import { Building2, Activity, Zap, Euro } from 'lucide-react';

interface Props {
  clients: ClientNode[];
}

export function HqHero({ clients }: Props) {
  const activeClients = clients.length;
  const avgHealth = Math.round(clients.reduce((acc, c) => acc + c.health_score, 0) / clients.length);
  const totalTokens = clients.reduce((acc, c) => acc + c.ai_consumption_tokens, 0);
  const totalRoi = clients.reduce((acc, c) => acc + c.roi_generated, 0);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const metrics = [
    { label: 'Clínicas Conectadas', value: activeClients, icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { label: 'Health Score Global', value: `${avgHealth}/100`, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    { label: 'Consumo IA (Tokens/mes)', value: formatNumber(totalTokens), icon: Zap, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { label: 'Valor Generado (MRR B2B)', value: `€${formatNumber(totalRoi)}`, icon: Euro, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 animate-in fade-in slide-in-from-bottom-4">
      {metrics.map((m, i) => {
        const Icon = m.icon;
        return (
          <div key={i} className={`bg-slate-900/50 border ${m.border} backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden group`}>
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] opacity-20 ${m.bg} group-hover:opacity-40 transition-opacity`} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg} ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{m.label}</h3>
              </div>
              <p className="text-3xl font-extrabold text-white">{m.value}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
