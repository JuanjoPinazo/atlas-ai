"use client";

import React, { useState } from 'react';
import { DownloadCloud, CheckCircle2, Loader2, Network } from 'lucide-react';

export function NetworkUpdates() {
  const [status, setStatus] = useState<'available' | 'updating' | 'updated'>('available');

  const handleUpdate = () => {
    setStatus('updating');
    setTimeout(() => {
      setStatus('updated');
    }, 2500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black border border-indigo-900/50 rounded-3xl p-8 relative overflow-hidden h-full flex flex-col justify-between">
      
      {/* Glow Effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Atlas Intelligence Network</h3>
              <p className="text-xs text-indigo-300">Conectado a la red global</p>
            </div>
          </div>
          {status === 'available' && (
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              1 Actualización Disponible
            </span>
          )}
        </div>

        <div className="bg-black/40 border border-white/10 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-white font-bold text-lg">Atlas Dental Intelligence</h4>
              <p className="text-sm text-slate-400">Versión 1.1 <span className="mx-2">→</span> <span className="text-indigo-400 font-bold">Versión 1.2</span></p>
            </div>
          </div>
          <ul className="text-sm text-slate-300 space-y-2 mt-4">
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Nuevas políticas de cancelación 2026.</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Mejora en detección de urgencias dentales.</li>
            <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> +15% de eficiencia en validaciones.</li>
          </ul>
        </div>
      </div>

      <div className="relative z-10">
        {status === 'available' ? (
          <button 
            onClick={handleUpdate}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/25"
          >
            <DownloadCloud className="w-5 h-5" /> Integrar Actualización al ADN
          </button>
        ) : status === 'updating' ? (
          <button 
            disabled
            className="w-full py-3 bg-indigo-600/50 text-white rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" /> Sincronizando con la red...
          </button>
        ) : (
          <button 
            disabled
            className="w-full py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" /> Pack Actualizado Correctamente
          </button>
        )}
      </div>

    </div>
  );
}
