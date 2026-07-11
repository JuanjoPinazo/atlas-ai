"use client";

import React, { useState } from 'react';
import { FrameworkEngine } from '@/lib/schemas/framework';
import { EnginesList } from './_components/EnginesList';
import { FrameworkHelp } from './_components/FrameworkHelp';
import { GenericEngineView } from './engines/GenericEngineView';
import { ExplainabilityEngine } from './engines/ExplainabilityEngine';
import { ExecutiveCopilot } from './engines/ExecutiveCopilot';
import { AtlasMaturity } from './engines/AtlasMaturity';

interface Props {
  engines: FrameworkEngine[];
}

export function FrameworkClient({ engines }: Props) {
  const [selectedEngineId, setSelectedEngineId] = useState<string | null>(null);

  const selectedEngine = engines.find(e => e.id === selectedEngineId);

  const getHelpData = (engineId: string | null) => {
    if (!engineId) {
      return {
        what: 'El Atlas Intelligence Framework Center es la matriz visual de los 10 motores cognitivos de Atlas.',
        why: 'Para demostrar que Atlas no es un "chatbot GPT wrapper", sino una arquitectura compleja de toma de decisiones empresariales.',
        value: 'Aporta transparencia total (Explainability) y genera confianza en la dirección ejecutiva.',
        sales: 'Mientras otros te venden un bot que responde preguntas, nosotros te instalamos 10 motores que auditan, deciden y ejecutan para proteger tu rentabilidad.',
        setup: 'No requiere configuración activa, refleja el estado en tiempo real del Company Brain y el Decision Engine.',
        roi: 'Acelera el ciclo de ventas B2B al eliminar el miedo a la "caja negra" de la IA.'
      };
    }
    
    // Simplificado para la demo
    return {
      what: `El motor ${selectedEngine?.name} gestiona aspectos específicos de la inteligencia.`,
      why: 'Necesario para separar responsabilidades dentro de la arquitectura.',
      value: 'Especialización y precisión.',
      sales: 'Es un módulo hiper-especializado que garantiza resultados.',
      setup: 'Se nutre del Business DNA automáticamente.',
      roi: 'Reducción de riesgos o aumento de captación, según el caso.'
    };
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 md:p-8 relative overflow-hidden">
      
      {/* Premium Dark Theme Background with Blur Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full relative z-10">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4">
              Cognitive Core
            </h1>
            <p className="text-slate-400 max-w-2xl text-base md:text-lg">
              Explora los 10 motores de inteligencia artificial que orquestan las decisiones operativas, evalúan riesgos y protegen el ADN de la compañía.
            </p>
          </div>
          <FrameworkHelp data={getHelpData(selectedEngineId)} />
        </div>

        <div className="flex-1">
          {!selectedEngineId ? (
            <EnginesList engines={engines} onSelect={setSelectedEngineId} />
          ) : (
            <GenericEngineView engine={selectedEngine!} onBack={() => setSelectedEngineId(null)}>
              {selectedEngineId === 'explainability' && <ExplainabilityEngine />}
              {selectedEngineId === 'copilot' && <ExecutiveCopilot />}
              {selectedEngineId === 'maturity' && <AtlasMaturity />}
              {/* For others, the GenericEngineView shows a placeholder */}
            </GenericEngineView>
          )}
        </div>

      </div>
    </div>
  );
}
