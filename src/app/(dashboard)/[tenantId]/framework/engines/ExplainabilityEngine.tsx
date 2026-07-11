"use client";

import React from 'react';
import { Database, Filter, Dna, BrainCircuit, CheckCircle2, ArrowRight } from 'lucide-react';

export function ExplainabilityEngine() {
  const steps = [
    { id: 1, name: 'Datos', icon: Database, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 2, name: 'Reglas', icon: Filter, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 3, name: 'Business DNA', icon: Dna, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 4, name: 'Decision Engine', icon: BrainCircuit, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { id: 5, name: 'Resultado', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-400/10' }
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-8">Pipeline de Explicabilidad</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
        
        {/* Background connecting line */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-white/10 -translate-y-1/2 z-0" />

        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-20 h-20 rounded-2xl ${step.bg} border border-white/10 backdrop-blur-md flex items-center justify-center ${step.color} shadow-xl mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className="text-white font-bold text-sm">{step.name}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden md:flex text-white/30 z-10">
                  <ArrowRight className="w-6 h-6 animate-pulse" />
                </div>
              )}
            </React.Fragment>
          );
        })}

      </div>

      <div className="mt-16 bg-white/5 border border-white/10 rounded-3xl p-6">
        <h3 className="text-white font-bold mb-4">Ejemplo en Tiempo Real</h3>
        <div className="font-mono text-xs text-slate-300 space-y-2">
          <p>[DATOS] Paciente solicita cancelar cita por WhatsApp.</p>
          <p>[REGLAS] Cita en menos de 24h {'->'} Bloquear cancelación automática.</p>
          <p>[ADN] Tono: Empático. Excepción: VIP.</p>
          <p>[DECISION] Evaluar VIP (Falso). Generar respuesta persuasiva para retener.</p>
          <p className="text-emerald-400 font-bold">[RESULTADO] Mensaje enviado: "Entiendo la situación. ¿Te parece si en lugar de cancelar la posponemos a mañana por la tarde que nos queda un hueco?"</p>
        </div>
      </div>
    </div>
  );
}
