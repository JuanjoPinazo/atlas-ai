"use client";

import React from 'react';
import { ServiceStatus } from '@/lib/schemas/orchestrator';
import { Server, Activity, ArrowRightLeft } from 'lucide-react';

interface Props {
  services: ServiceStatus[];
}

export function ServiceStatusGrid({ services }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-3 mb-8">
        <Server className="w-8 h-8 text-indigo-400" />
        <div>
          <h2 className="text-2xl font-bold text-white">Estado de Motores Atlas</h2>
          <p className="text-slate-400 text-sm">Monitorización de latencias y suscripciones al Event Bus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((svc, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors">
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <h3 className="font-bold text-white text-sm">{svc.name}</h3>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full animate-pulse ${
                  svc.status === 'online' ? 'bg-emerald-500' : 
                  svc.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
                }`} />
                <span className="text-[10px] text-slate-400 uppercase font-bold">{svc.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
              <div>
                <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1 mb-1">
                  <Activity className="w-3 h-3" /> Latencia
                </span>
                <span className={`text-lg font-bold font-mono ${svc.latency_ms > 500 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {svc.latency_ms}ms
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase flex items-center gap-1 mb-1">
                  <ArrowRightLeft className="w-3 h-3" /> Eventos
                </span>
                <span className="text-lg font-bold text-white font-mono">
                  {(svc.events_processed / 1000).toFixed(1)}k
                </span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-4 relative z-10">
              <span className="text-[10px] text-slate-500 uppercase block mb-2">Suscrito a:</span>
              <div className="flex flex-wrap gap-1">
                {svc.subscriptions.map((sub, j) => (
                  <span key={j} className="text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            {/* Hover Glow */}
            <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
