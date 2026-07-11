"use client";

import React, { useState, useEffect } from 'react';
import { CircleDollarSign, Clock, TrendingUp } from 'lucide-react';
import { fetchROIMetrics } from '@/app/actions/roi';

export function FinancialHero() {
  const [data, setData] = useState({ totalGenerated: 42850, realGenerated: 0, realEventsCount: 0 });

  useEffect(() => {
    fetchROIMetrics().then(res => {
      if (res.success && res.data) setData(res.data);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      
      {/* Generated Value */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 border border-emerald-500 rounded-3xl p-8 shadow-2xl shadow-emerald-500/20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                <CircleDollarSign className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-emerald-100 uppercase tracking-widest text-sm">Valor Generado (YTD)</span>
            </div>
            {data.realGenerated > 0 && (
              <span className="bg-emerald-400 text-emerald-950 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                REAL DATA +€{data.realGenerated.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-extrabold tracking-tight">€{data.totalGenerated.toLocaleString()}</span>
            <span className="text-emerald-300 font-bold text-lg">+14%</span>
          </div>
        </div>
      </div>

      {/* Hours Saved */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Clock className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm">Horas Humanas Ahorradas</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">1,240</span>
          <span className="text-slate-500 dark:text-slate-400 font-medium text-lg">h</span>
        </div>
        <p className="text-sm text-slate-500 mt-2">Equivalente a ~0.8 FTE (Full-Time Equivalent)</p>
      </div>

      {/* Accumulated ROI */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm">ROI Acumulado</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">345</span>
          <span className="text-blue-500 font-bold text-lg">%</span>
        </div>
        <p className="text-sm text-slate-500 mt-2">Retorno sobre la inversión de licencias</p>
      </div>

    </div>
  );
}
