"use client";

import React, { useState } from 'react';
import { DentalItem, DentalCommercialBenefit, DentalImplementationQuestion, DentalAutomationBlueprint } from '@/lib/schemas/dental-knowledge';
import { ContextualHelp } from '../_components/ContextualHelp';
import { ShieldCheck, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';

interface Props {
  item: DentalItem;
  benefits: DentalCommercialBenefit[];
  questions: DentalImplementationQuestion[];
  automations: DentalAutomationBlueprint[];
}

export function ItemDetailView({ item, benefits, questions, automations }: Props) {
  const [activeTab, setActiveTab] = useState<'info' | 'commercial' | 'implementation' | 'automations'>('info');

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                item.status === 'aprobado' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' :
                item.status === 'borrador' ? 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:border-slate-700' :
                'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800'
              }`}>
                {item.status}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800">
                {item.priority}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {item.title}
              <ContextualHelp text="Esta unidad de conocimiento formará parte del ADN base si es MVP." />
            </h2>
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
              <User className="w-3 h-3" /> {item.responsible}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" /> Revisado: {item.last_review_date ? new Date(item.last_review_date).toLocaleDateString() : 'N/A'}
            </div>
            <div className="mt-2 text-xs font-bold text-indigo-500">v{item.version}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-slate-200 dark:border-slate-800 -mb-6">
          {[
            { id: 'info', label: 'Conocimiento Core' },
            { id: 'commercial', label: 'Ventas (Beneficios)' },
            { id: 'implementation', label: 'Setup (Preguntas)' },
            { id: 'automations', label: 'Blueprints' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-sm font-bold transition-colors relative ${
                activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 bg-slate-50 dark:bg-slate-950/50">
        
        {activeTab === 'info' && (
          <div className="space-y-6 animate-in fade-in">
            <section>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">Descripción General</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                {item.description}
              </p>
            </section>

            <div className="grid grid-cols-2 gap-6">
              <section>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                  Proceso Actual <ContextualHelp text="Cómo lo hacen las clínicas normalmente sin IA." />
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                  {item.current_process}
                </p>
              </section>
              <section>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                  Propuesta Atlas <ContextualHelp text="Cómo la IA transforma este proceso." />
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                  {item.atlas_proposal}
                </p>
              </section>
            </div>

            <section>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Ejemplo Práctico</h3>
              <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-sm font-mono border border-slate-800">
                {item.example}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'commercial' && (
          <div className="space-y-4 animate-in fade-in">
            {benefits.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No hay argumentos comerciales definidos.</p>
            ) : benefits.map(b => (
              <div key={b.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold px-2 py-1 rounded uppercase">Target: {b.target_role}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">Impacto: {b.economic_impact_expected}</span>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <strong className="text-slate-700 dark:text-slate-300 block mb-1">Dolor (Problema):</strong>
                    <p className="text-slate-600 dark:text-slate-400">{b.problem}</p>
                  </div>
                  <div>
                    <strong className="text-slate-700 dark:text-slate-300 block mb-1">Solución Atlas:</strong>
                    <p className="text-slate-600 dark:text-slate-400">{b.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'implementation' && (
          <div className="space-y-4 animate-in fade-in">
            <p className="text-sm text-slate-500 mb-4">Preguntas a realizar durante el Onboarding de la clínica para configurar esta regla.</p>
            {questions.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No hay preguntas de implementación.</p>
            ) : questions.map(q => (
              <div key={q.id} className="flex gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <FileText className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{q.question_text}</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase">Categoría: {q.category}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'automations' && (
          <div className="space-y-4 animate-in fade-in">
            {automations.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No hay blueprints de automatización.</p>
            ) : automations.map(a => (
              <div key={a.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{a.trigger_event}</span>
                  </div>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded dark:bg-slate-800 dark:text-slate-400">Canal: {a.channel}</span>
                </div>
                <div className="text-sm">
                  <p><strong className="text-slate-700 dark:text-slate-300">Condición:</strong> <span className="text-slate-600 dark:text-slate-400">{a.conditions}</span></p>
                  <p className="mt-2"><strong className="text-slate-700 dark:text-slate-300">Acción:</strong> <span className="text-indigo-600 dark:text-indigo-400 font-medium">{a.action}</span></p>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Agente: {a.responsible_agent}</span>
                  {a.requires_approval && <span className="text-amber-500 font-bold flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Requiere aprobación humana</span>}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
