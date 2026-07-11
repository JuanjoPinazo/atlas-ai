"use client";

import React from 'react';
import { FrameworkEngine } from '@/lib/schemas/framework';
import { ArrowLeft } from 'lucide-react';

interface Props {
  engine: FrameworkEngine;
  onBack: () => void;
  children?: React.ReactNode;
}

export function GenericEngineView({ engine, onBack, children }: Props) {
  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">{engine.name}</h2>
          <p className="text-slate-400">{engine.description}</p>
        </div>
      </div>

      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl relative">
        {children || (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            <p className="text-lg">Simulador interactivo en construcción para {engine.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
