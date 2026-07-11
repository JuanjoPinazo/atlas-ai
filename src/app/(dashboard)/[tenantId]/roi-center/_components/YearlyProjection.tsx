"use client";

import React from 'react';
import { LineChart } from 'lucide-react';

export function YearlyProjection() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-sm h-full flex flex-col relative overflow-hidden">
      {/* Background abstract shape */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 pointer-events-none" />

      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
          <LineChart className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-white text-xl">Proyección Anual</h3>
          <p className="text-xs text-slate-400 font-medium">Estimación a 12 meses vista</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10">
        <div className="flex items-baseline gap-2 mb-8">
          <span className="text-6xl font-extrabold text-white tracking-tight">€125K</span>
          <span className="text-emerald-400 font-bold text-xl">Proyectado</span>
        </div>

        {/* CSS-only Line Chart Mockup */}
        <div className="relative h-32 w-full border-b border-l border-slate-700">
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Area Fill */}
            <path d="M0,100 L0,70 Q25,60 50,40 T100,10 L100,100 Z" fill="url(#gradient)" opacity="0.3" />
            {/* Line */}
            <path d="M0,70 Q25,60 50,40 T100,10" fill="none" stroke="#10b981" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="1" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Points */}
          <div className="absolute left-0 bottom-[30%] w-3 h-3 bg-white border-2 border-emerald-500 rounded-full transform -translate-x-1.5 translate-y-1.5" />
          <div className="absolute left-[50%] bottom-[60%] w-3 h-3 bg-white border-2 border-emerald-500 rounded-full transform -translate-x-1.5 translate-y-1.5" />
          <div className="absolute right-0 top-[10%] w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)] transform translate-x-2 -translate-y-2 animate-pulse" />
        </div>

        <div className="flex justify-between mt-2 text-xs text-slate-500 font-bold uppercase tracking-wider">
          <span>Hoy</span>
          <span>+6 Meses</span>
          <span>+12 Meses</span>
        </div>
      </div>
    </div>
  );
}
