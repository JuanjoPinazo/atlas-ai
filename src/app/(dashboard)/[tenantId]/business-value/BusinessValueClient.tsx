"use client";

import React from 'react';
import { ValueOpportunity } from '@/lib/schemas/business-value';
import { ValueHero } from './_components/ValueHero';
import { OpportunityKanban } from './_components/OpportunityKanban';
import { HeatmapLosses } from './_components/HeatmapLosses';
import { ImpactSimulator } from './_components/ImpactSimulator';
import { TopOpportunities } from './_components/TopOpportunities';
import { FrameworkHelp } from '../framework/_components/FrameworkHelp';

interface Props {
  opportunities: ValueOpportunity[];
}

export function BusinessValueClient({ opportunities }: Props) {
  const helpData = {
    what: 'El Business Value Center es el traductor financiero de Atlas. Convierte las alertas del Opportunity Engine en euros tangibles.',
    why: 'Para demostrar a la Alta Dirección que el sistema se paga solo (y con creces). Visualiza el coste de la inacción.',
    value: 'Genera un tablero Kanban con impacto económico, donde Atlas recupera proactivamente presupuestos y pacientes perdidos.',
    sales: '"Atlas ha detectado que estás perdiendo 15,000€ al mes por seguimientos no hechos. Dale al botón y deja que Atlas los recupere hoy mismo."',
    setup: 'Se alimenta automáticamente de las reglas configuradas en el Decision Engine y el CRM conectado.',
    roi: 'Retorno inmediato. Verás el valor recuperado moverse de la columna "Detectadas" a "Recuperado" semana a semana.'
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 md:p-8 relative overflow-hidden">
      
      {/* Dark Premium Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full relative z-10">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4">
              Business Value Center
            </h1>
            <p className="text-slate-400 max-w-2xl text-base md:text-lg">
              Visualiza y captura el valor económico latente de tu clínica. Atlas detecta fugas de capital y ejecuta acciones para recuperarlas.
            </p>
          </div>
          <FrameworkHelp data={helpData} />
        </div>

        {/* Hero: Cost of Inaction & Recoverable Value */}
        <ValueHero opportunities={opportunities} />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-6">
          {/* Top Opportunities Ranking */}
          <div className="xl:col-span-8">
            <OpportunityKanban opportunities={opportunities} />
          </div>
          {/* Heatmap */}
          <div className="xl:col-span-4 min-h-[350px]">
            <HeatmapLosses />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Simulator */}
          <div className="xl:col-span-4 min-h-[350px]">
            <ImpactSimulator />
          </div>
          {/* Top 10 List */}
          <div className="xl:col-span-8 min-h-[350px]">
            <TopOpportunities opportunities={opportunities} />
          </div>
        </div>

      </div>
    </div>
  );
}
