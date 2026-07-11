"use client";

import React, { useState, useEffect } from 'react';
import { fetchBudgetDetail, simulateAction } from '@/app/actions/budget';
import { ChevronLeft, BrainCircuit, Activity, CheckCircle2, XCircle, Send } from 'lucide-react';

export function BudgetDetail({ id, onBack }: { id: string; onBack: () => void }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchBudgetDetail(id);
    if (res.success) setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleAction = async (action: string) => {
    await simulateAction(action, id);
    loadData();
  };

  if (loading || !data) return <div className="text-white p-8">Cargando...</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      
      <button onClick={onBack} className="text-slate-400 hover:text-white flex items-center gap-2 mb-6 font-bold transition-colors">
        <ChevronLeft className="w-5 h-5" /> Volver al listado
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Detalles */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-extrabold text-white mb-2">{data.patient?.name}</h2>
                <p className="text-slate-400 text-lg">{data.treatment}</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-black text-indigo-400 block font-mono">€{data.amount.toLocaleString()}</span>
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 block border border-slate-700 px-2 py-1 rounded">
                  {data.status}
                </span>
              </div>
            </div>

            {/* Simulación de Controles */}
            {data.status === 'PENDING_DECISION' && data.opportunity && (
              <div className="mt-8 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BrainCircuit className="w-6 h-6 text-indigo-400" />
                  <h3 className="font-bold text-white">Decision Engine: Aprobación Requerida</h3>
                </div>
                <p className="text-sm text-indigo-200 mb-6">
                  Se ha detectado una oportunidad de seguimiento (ABVL-01). El presupuesto lleva más de 14 días parado. 
                  ¿Autorizas a Dra. Aida a enviar un WhatsApp de rescate?
                </p>
                <button 
                  onClick={() => handleAction('APPROVE_FOLLOW_UP')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold w-full transition-colors flex justify-center items-center gap-2"
                >
                  <Send className="w-5 h-5" /> Autorizar Envío (Simular WhatsApp)
                </button>
              </div>
            )}

            {data.status === 'FOLLOW_UP_SCHEDULED' && (
              <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="font-bold text-white mb-4">Simular Respuesta del Paciente</h3>
                <div className="flex gap-4">
                  <button 
                    onClick={() => handleAction('ACCEPT_BUDGET')}
                    className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/30 px-4 py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Acepta el tratamiento
                  </button>
                  <button 
                    onClick={() => handleAction('REJECT_BUDGET')}
                    className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 px-4 py-3 rounded-xl font-bold transition-colors flex justify-center items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" /> Lo rechaza
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Explainability (Eventos) */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <Activity className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-white">Event Timeline</h3>
            </div>
            
            <div className="space-y-4">
              {data.history.length === 0 && <p className="text-sm text-slate-500">No hay eventos recientes.</p>}
              {data.history.map((evt: any, i: number) => (
                <div key={i} className="relative pl-6 border-l-2 border-slate-800 pb-4 last:border-0 last:pb-0">
                  <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-indigo-500" />
                  <div className="text-[10px] text-slate-500 mb-1">{new Date(evt.timestamp).toLocaleString()}</div>
                  <div className="text-xs font-bold text-indigo-300 font-mono mb-1">{evt.type}</div>
                  <pre className="text-[10px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 overflow-x-auto">
                    {JSON.stringify(evt.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>

            {data.status === 'ACCEPTED' && data.history.some((e: any) => e.type === 'BudgetFollowUpDue') && (
              <div className="mt-8 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                <span className="text-xs text-emerald-400 uppercase font-bold tracking-widest block mb-1">ROI Atribuido (ABVL-01)</span>
                <span className="text-2xl font-black text-emerald-400 block font-mono">€{data.amount.toLocaleString()}</span>
                <p className="text-[10px] text-emerald-200 mt-2">Valor recuperado íntegramente gracias al motor de seguimiento autónomo.</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
