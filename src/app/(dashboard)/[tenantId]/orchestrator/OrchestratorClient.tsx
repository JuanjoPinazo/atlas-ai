"use client";

import React, { useState } from 'react';
import { AtlasEvent, ServiceStatus } from '@/lib/schemas/orchestrator';
import { EventFlowVisualizer } from './views/EventFlowVisualizer';
import { EventExplorer } from './views/EventExplorer';
import { ServiceStatusGrid } from './views/ServiceStatusGrid';
import { FrameworkHelp } from '../framework/_components/FrameworkHelp';
import { Share2, ListTree, ActivitySquare } from 'lucide-react';

interface Props {
  events: AtlasEvent[];
  services: ServiceStatus[];
}

type Tab = 'flow' | 'explorer' | 'services';

export function OrchestratorClient({ events, services }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('flow');

  const helpData = {
    what: 'Atlas Orchestrator es el sistema nervioso central. Un Event Bus que comunica todos los motores de Inteligencia Artificial.',
    why: 'Para demostrar a perfiles técnicos (CTOs, IT) que Atlas es una arquitectura robusta multi-agente, no un simple "wrapper" de ChatGPT.',
    value: 'Garantiza la trazabilidad. Muestra cómo un evento simple del PMS dispara decisiones complejas y asíncronas.',
    sales: 'Usa la pestaña "Event Flow" y dale a Simular Evento. Di: "Mira cómo una cancelación de cita entra al sistema, la procesa el Context Engine, decide el Decision Engine, y la Dra. Aida manda un WhatsApp automáticamente".',
    setup: 'Esta vista es de solo lectura (telemetría pura).',
    roi: 'Reduce el TCO (Total Cost of Ownership) al no requerir que la clínica mantenga integraciones punto a punto complejas.'
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full relative z-10">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-400 tracking-tight mb-4">
              Atlas Orchestrator
            </h1>
            <p className="text-slate-400 max-w-2xl text-base md:text-lg">
              Sistema nervioso central. Visualización del Event Bus, trazabilidad de flujos y latencias de Swarm Intelligence.
            </p>
          </div>
          <FrameworkHelp data={helpData} />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-800 pb-px mb-8">
          <button
            onClick={() => setActiveTab('flow')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all rounded-t-xl ${
              activeTab === 'flow' 
                ? 'bg-slate-900/80 border-t border-l border-r border-slate-700 text-indigo-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Share2 className="w-5 h-5" /> Event Flow
          </button>
          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all rounded-t-xl ${
              activeTab === 'explorer' 
                ? 'bg-slate-900/80 border-t border-l border-r border-slate-700 text-purple-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ListTree className="w-5 h-5" /> Event Explorer
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all rounded-t-xl ${
              activeTab === 'services' 
                ? 'bg-slate-900/80 border-t border-l border-r border-slate-700 text-emerald-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <ActivitySquare className="w-5 h-5" /> Motores y Latencias
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'flow' && <EventFlowVisualizer />}
          {activeTab === 'explorer' && <EventExplorer events={events} />}
          {activeTab === 'services' && <ServiceStatusGrid services={services} />}
        </div>

      </div>
    </div>
  );
}
