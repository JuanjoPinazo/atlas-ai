"use client";

import React from 'react';
import { FrameworkEngine } from '@/lib/schemas/framework';
import { Brain, ShieldAlert, Target, TrendingUp, Scale, Workflow, Lightbulb, Users, Network, Command } from 'lucide-react';

interface Props {
  engines: FrameworkEngine[];
  onSelect: (id: string) => void;
}

const ICONS: Record<string, any> = {
  opportunity: Target,
  risk: ShieldAlert,
  recommendation: Lightbulb,
  roi: TrendingUp,
  confidence: Scale,
  explainability: Workflow,
  copilot: Users,
  principles: Command,
  maturity: Network,
  decision: Brain
};

export function EnginesList({ engines, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {engines.map(engine => {
        const Icon = ICONS[engine.id] || Brain;
        return (
          <div 
            key={engine.id}
            onClick={() => onSelect(engine.id)}
            className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/30 rounded-3xl p-6 cursor-pointer transition-all duration-300 overflow-hidden"
          >
            {/* Glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 text-indigo-300 group-hover:text-indigo-200 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${
                    engine.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                    engine.status === 'learning' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                    'bg-slate-500/10 border-slate-500/30 text-slate-400'
                  }`}>
                    {engine.status}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{engine.name}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 h-10 mb-6">{engine.description}</p>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/10">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Autonomía</div>
                  <div className="text-white font-bold">{engine.autonomy}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Confianza</div>
                  <div className="text-white font-bold">{engine.confidence}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Evolución</div>
                  <div className="text-emerald-400 font-bold">+{engine.evolution}%</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
