"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Save, CheckCircle2, RefreshCw } from 'lucide-react';
import { DiscoveryInterviewAnswer } from '@/lib/schemas/interview';

// Re-using QuestionItem locally to avoid DB dependencies
function DemoQuestionItem({ 
  title, 
  placeholder, 
  value, 
  onChange,
  whyPrompt 
}: { 
  title: string; 
  placeholder?: string; 
  value: string; 
  onChange: (val: string) => void;
  whyPrompt?: string;
}) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{title}</label>
      {whyPrompt && <p className="text-xs text-slate-500 mb-2 italic">Por qué preguntamos esto: {whyPrompt}</p>}
      <textarea 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[100px] p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
      />
    </div>
  );
}

export function DemoInterviewWizardClient() {
  const [activeBlock, setActiveBlock] = useState<string>('HEADER');
  const [headerData, setHeaderData] = useState<any>({
    clinic_name: 'Clínica Demo',
    interviewee_name: 'Dr. Ejemplo',
    interviewee_role: 'Director Médico',
    consultant_name: 'Consultor VELSORA'
  });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedHeader = localStorage.getItem('demo_header');
    const savedAnswers = localStorage.getItem('demo_answers');
    if (savedHeader) setHeaderData(JSON.parse(savedHeader));
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
  }, []);

  const saveToStorage = (newHeader: any, newAnswers: any) => {
    setIsSaving(true);
    localStorage.setItem('demo_header', JSON.stringify(newHeader));
    localStorage.setItem('demo_answers', JSON.stringify(newAnswers));
    setTimeout(() => setIsSaving(false), 500);
  };

  const updateHeader = (updates: any) => {
    const newHeader = { ...headerData, ...updates };
    setHeaderData(newHeader);
    saveToStorage(newHeader, answers);
  };

  const updateAnswer = (key: string, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    saveToStorage(headerData, newAnswers);
  };

  const restartDemo = () => {
    if (window.confirm("¿Seguro que quieres reiniciar la entrevista de demostración? Se perderán todos los datos.")) {
      localStorage.removeItem('demo_header');
      localStorage.removeItem('demo_answers');
      window.location.reload();
    }
  };

  if (!isMounted) return null;

  const blocks = [
    { id: 'HEADER', title: 'Cabecera' },
    { id: 'BLOCK_1', title: '1. La Clínica' },
    { id: 'BLOCK_2', title: '2. Un Día Normal' },
    { id: 'BLOCK_3', title: '3. Problemas' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button 
          onClick={restartDemo}
          className="text-red-500 hover:text-red-700 flex items-center gap-2 px-4 py-2 border border-red-200 bg-red-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          Reiniciar entrevista demo
        </button>
        <div className="flex items-center gap-4">
          {isSaving ? (
            <span className="flex items-center gap-2 text-sm text-slate-500"><Save className="w-4 h-4 animate-pulse" /> Guardando local...</span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-emerald-500"><CheckCircle2 className="w-4 h-4" /> Autoguardado local activo</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map(block => {
          const isOpen = activeBlock === block.id;
          return (
            <div key={block.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all print:border-none print:shadow-none">
              
              <button 
                onClick={() => setActiveBlock(isOpen ? '' : block.id)}
                className={`w-full flex items-center justify-between p-6 text-left transition-colors print:hidden ${isOpen ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <h3 className={`text-xl font-bold ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {block.title}
                </h3>
                {isOpen ? <ChevronDown className="w-6 h-6 text-indigo-500" /> : <ChevronRight className="w-6 h-6 text-slate-400" />}
              </button>

              <div className={`p-6 md:p-8 border-t border-slate-200 dark:border-slate-800 print:border-none print:block ${isOpen ? 'block' : 'hidden'}`}>
                  
                  {block.id === 'HEADER' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre clínica</label>
                        <input type="text" value={headerData.clinic_name || ''} onChange={e => updateHeader({clinic_name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Persona entrevistada</label>
                        <input type="text" value={headerData.interviewee_name || ''} onChange={e => updateHeader({interviewee_name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cargo</label>
                        <input type="text" value={headerData.interviewee_role || ''} onChange={e => updateHeader({interviewee_role: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Consultor</label>
                        <input type="text" value={headerData.consultant_name || ''} onChange={e => updateHeader({consultant_name: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg" />
                      </div>
                    </div>
                  )}

                  {block.id === 'BLOCK_1' && (
                    <div>
                      <DemoQuestionItem 
                        value={answers['q1_datos'] || ''} onChange={v => updateAnswer('q1_datos', v)}
                        title="Datos Cuantitativos"
                        placeholder="Nº Clínicas, Gabinetes, Especialidades, Doctores, Higienistas, Pacientes/día..."
                        whyPrompt="Necesitamos dimensionar el tamaño real del negocio."
                      />
                      <DemoQuestionItem 
                        value={answers['q1_software'] || ''} onChange={v => updateAnswer('q1_software', v)}
                        title="Software Utilizado"
                        placeholder="PMS, Rx, Escáner, Financiación..."
                      />
                    </div>
                  )}

                  {block.id === 'BLOCK_2' && (
                    <DemoQuestionItem 
                      value={answers['q2_dia'] || ''} onChange={v => updateAnswer('q2_dia', v)}
                      title="Cuéntame cómo transcurre un día normal desde que abrís hasta que cerráis"
                      placeholder="Texto, observaciones e ideas detectadas..."
                    />
                  )}

                  {block.id === 'BLOCK_3' && (
                    <div>
                       <DemoQuestionItem 
                        value={answers['q3_dinero'] || ''} onChange={v => updateAnswer('q3_dinero', v)}
                        title="¿Qué os hace perder más dinero?"
                      />
                      <DemoQuestionItem 
                        value={answers['q3_repetitivas'] || ''} onChange={v => updateAnswer('q3_repetitivas', v)}
                        title="¿Qué tareas repetitivas odiáis?"
                      />
                    </div>
                  )}

                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800/50 print:hidden">
                    <button 
                      onClick={() => {
                        const currentIndex = blocks.findIndex(b => b.id === activeBlock);
                        if (currentIndex > 0) setActiveBlock(blocks[currentIndex - 1].id);
                      }}
                      disabled={blocks.findIndex(b => b.id === activeBlock) === 0}
                      className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Bloque Anterior
                    </button>
                    <button 
                      onClick={() => {
                        const currentIndex = blocks.findIndex(b => b.id === activeBlock);
                        if (currentIndex < blocks.length - 1) setActiveBlock(blocks[currentIndex + 1].id);
                      }}
                      disabled={blocks.findIndex(b => b.id === activeBlock) === blocks.length - 1}
                      className="px-6 py-2 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Siguiente Bloque →
                    </button>
                  </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
