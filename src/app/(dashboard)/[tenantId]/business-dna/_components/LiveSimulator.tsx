"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Send, Sparkles, CheckCircle2, ShieldOff, AlertTriangle } from 'lucide-react';
import { useBusinessDNA } from './useBusinessDNA';
import { DecisionState } from '@/types/decision';

export function LiveSimulator() {
  const { state } = useBusinessDNA();
  const [selectedScenario, setSelectedScenario] = useState('discount');
  const [isSimulating, setIsSimulating] = useState(false);
  const [response, setResponse] = useState<any>(null);

  const scenarios = [
    { id: 'discount', label: 'Cliente pide gran descuento (20%)', text: "Llevo 5 años con vosotros. ¿Me hacéis un 20% de descuento en la renovación o me voy a la competencia?" },
    { id: 'refund', label: 'Cliente exige reembolso sin ticket', text: "He perdido el ticket de compra pero el producto está defectuoso, quiero mi dinero ya." },
    { id: 'angry', label: 'Cliente muy enfadado', text: "¡Llevo 2 horas esperando y nadie me responde! Sois un desastre." }
  ];

  const handleSimulate = async () => {
    setIsSimulating(true);
    setResponse(null);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate LLM + Decision Engine

    const activeLimits = state.rules.filter(r => r.category === 'limit' && r.active).map(r => r.content.toLowerCase());
    const activeExceptions = state.rules.filter(r => r.category === 'exception' && r.active).map(r => r.content.toLowerCase());
    const activePriorities = state.rules.filter(r => r.category === 'priority' && r.active).map(r => r.content.toLowerCase());

    let finalResponse = "";
    let finalState = DecisionState.COMPLETED;
    let appliedRule = "Comportamiento Estándar";

    if (selectedScenario === 'discount') {
      const hasDiscountLimit = activeLimits.some(l => l.includes('descuento') && l.includes('10'));
      if (hasDiscountLimit) {
        finalResponse = `Entiendo perfectamente tu situación y agradezco mucho tu lealtad estos 5 años. Sin embargo, por política de la empresa, el descuento máximo que puedo ofrecerte es del 10%. ¿Te gustaría que apliquemos ese 10%?`;
        finalState = DecisionState.POLICY_CONFLICT;
        appliedRule = "Límite: No ofrecer descuentos > 10%";
      } else {
        finalResponse = `¡Claro que sí! Valoramos mucho tu lealtad de 5 años. He aplicado un 20% de descuento a tu renovación.`;
      }
    } else if (selectedScenario === 'refund') {
      const allowsRefundException = activeExceptions.some(e => e.includes('ticket') && e.includes('vip'));
      if (allowsRefundException) {
        finalResponse = `Normalmente no podemos hacer reembolsos sin ticket, pero veo que eres un cliente muy especial para nosotros. Haremos una excepción y procesaré el reembolso inmediatamente.`;
        appliedRule = "Excepción: Devoluciones sin ticket para VIP";
      } else {
        finalResponse = `Siento mucho que el producto esté defectuoso. Lamentablemente, sin el ticket de compra no puedo procesar un reembolso directamente. Sin embargo, voy a pasar tu caso a un agente humano para que revise si hay alguna alternativa.`;
        finalState = DecisionState.HUMAN_APPROVAL;
        appliedRule = "Protocolo: Escalar casos sin ticket";
      }
    } else {
      const valuesSpeed = activePriorities.some(p => p.includes('velocidad'));
      if (valuesSpeed) {
        finalResponse = `¡Siento mucho la demora! Estoy revisando tu caso ahora mismo y te lo soluciono en el acto.`;
      } else {
        finalResponse = `Lamento sinceramente que hayas tenido que esperar. Entiendo tu frustración. Voy a revisar detalladamente el historial de tu caso para darte la mejor solución posible. Dame un momento, por favor.`;
      }
    }

    setResponse({ text: finalResponse, state: finalState, rule: appliedRule });
    setIsSimulating(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col h-[700px] sticky top-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

      <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        Live Simulator
      </h3>

      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">Escenario de Prueba</label>
        <select 
          value={selectedScenario}
          onChange={(e) => { setSelectedScenario(e.target.value); setResponse(null); }}
          className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {scenarios.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        
        <div className="mt-4 bg-slate-800/50 p-4 rounded-xl text-slate-300 italic text-sm">
          "{scenarios.find(s => s.id === selectedScenario)?.text}"
        </div>
      </div>

      <button 
        onClick={handleSimulate}
        disabled={isSimulating}
        className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mb-6 shadow-lg shadow-indigo-500/20"
      >
        <Send className="w-4 h-4" />
        {isSimulating ? 'Simulando Comportamiento...' : 'Probar Reacción del ADN'}
      </button>

      <div className="flex-1 bg-black/40 rounded-2xl border border-slate-800 p-4 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          {response && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl relative">
                <div className="absolute -left-2 top-4 w-4 h-4 bg-slate-900 border-l border-t border-slate-700 rotate-[-45deg]"></div>
                <p className="text-slate-300 text-sm leading-relaxed">{response.text}</p>
              </div>

              <div className="bg-indigo-950/30 border border-indigo-900/50 p-4 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-2">
                  <ShieldAlert className="w-4 h-4" /> Reporte de Motores
                </div>
                
                <div className="flex justify-between items-center bg-black/30 p-2 rounded text-sm">
                  <span className="text-slate-400">Decision State</span>
                  <span className={`font-bold flex items-center gap-1 ${
                    response.state === DecisionState.COMPLETED ? 'text-green-400' :
                    response.state === DecisionState.POLICY_CONFLICT ? 'text-amber-400' :
                    'text-purple-400'
                  }`}>
                    {response.state === DecisionState.COMPLETED ? <CheckCircle2 className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4" />}
                    {response.state}
                  </span>
                </div>

                <div className="flex justify-between items-center bg-black/30 p-2 rounded text-sm">
                  <span className="text-slate-400">Regla / ADN Activo</span>
                  <span className="text-slate-200 text-right max-w-[60%] truncate" title={response.rule}>{response.rule}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
