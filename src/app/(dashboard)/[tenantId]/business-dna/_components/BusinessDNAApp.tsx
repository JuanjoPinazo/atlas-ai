"use client";

import React from 'react';
import { DnaBuilder } from './DnaBuilder';
import { LiveSimulator } from './LiveSimulator';
import { useBusinessDNA } from './useBusinessDNA';
import { Settings2 } from 'lucide-react';

export function BusinessDNAApp() {
  const { state, isLoaded, updateState } = useBusinessDNA();

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando genoma corporativo...</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 w-full">
      
      {/* Left Column: DNA Builder */}
      <div className="flex-1 lg:max-w-[55%] flex flex-col gap-6">
        
        {/* Basic Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-indigo-500" />
            Personalidad Base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">Tono de Comunicación</label>
              <input 
                type="text" 
                value={state.tone}
                onChange={(e) => updateState({ tone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Filosofía de Atención</label>
              <input 
                type="text" 
                value={state.attentionPhilosophy}
                onChange={(e) => updateState({ attentionPhilosophy: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Declarative Rules Builder */}
        <div className="flex-1">
          <DnaBuilder />
        </div>
      </div>

      {/* Right Column: Live Preview / Simulator */}
      <div className="w-full lg:flex-1">
        <LiveSimulator />
      </div>
      
    </div>
  );
}
