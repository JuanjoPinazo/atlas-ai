"use client";

import React from 'react';
import { ProactiveAlerts } from './_components/ProactiveAlerts';
import { NetworkUpdates } from './_components/NetworkUpdates';
import { Benchmarking } from './_components/Benchmarking';
import { LearningEvolution } from './_components/LearningEvolution';
import { Radar } from 'lucide-react';

export default function IntelligenceCenterPage() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-10 flex items-start gap-4">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 flex-shrink-0">
            <Radar className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
              Centro de Inteligencia
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-sm md:text-base">
              Monitoriza la salud, evolución y madurez de tu infraestructura Atlas. Conecta con la Atlas Intelligence Network para mantener tu sistema siempre actualizado.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* Top Row: Proactive Alerts */}
          <ProactiveAlerts />

          {/* Middle Row: Network & Benchmarking */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4 min-h-[350px]">
              <NetworkUpdates />
            </div>
            <div className="xl:col-span-8 min-h-[350px]">
              <Benchmarking />
            </div>
          </div>

          {/* Bottom Row: Evolution */}
          <div>
            <LearningEvolution />
          </div>
        </div>
        
      </div>
    </div>
  );
}
