"use client";

import React, { useState } from 'react';
import { DiscoveryInterview, DiscoveryInterviewAnswer } from '@/lib/schemas/interview';
import { useInterviewHeader } from './useInterviewHooks';
import { ChevronDown, ChevronRight, Save, CheckCircle2, ArrowLeft, Printer } from 'lucide-react';
import { QuestionItem } from './QuestionItem';
import { Block10Summary } from './Block10Summary';
import { useRouter } from 'next/navigation';

export function InterviewWizardClient({
  tenantId,
  interviewId,
  initialInterview,
  initialAnswers
}: {
  tenantId: string;
  interviewId: string;
  initialInterview: DiscoveryInterview;
  initialAnswers: DiscoveryInterviewAnswer[];
}) {
  const router = useRouter();
  const { headerData, isSaving, updateHeader } = useInterviewHeader(interviewId, initialInterview);
  const [activeBlock, setActiveBlock] = useState<string>('HEADER');
  const [status, setStatus] = useState<string>(initialInterview.status || 'PENDING');

  const getAnswer = (blockId: string, questionKey: string) => {
    return initialAnswers.find(a => a.block_id === blockId && a.question_key === questionKey);
  };

  const blocks = [
    { id: 'HEADER', title: 'Cabecera' },
    { id: 'BLOCK_1', title: '1. La Clínica' },
    { id: 'BLOCK_2', title: '2. Un Día Normal' },
    { id: 'BLOCK_3', title: '3. Problemas' },
    { id: 'BLOCK_4', title: '4. Recorrido del Paciente' },
    { id: 'BLOCK_5', title: '5. Recepción' },
    { id: 'BLOCK_6', title: '6. Coordinadora' },
    { id: 'BLOCK_7', title: '7. Laboratorios' },
    { id: 'BLOCK_8', title: '8. Stock' },
    { id: 'BLOCK_9', title: '9. Tecnología' },
    { id: 'BLOCK_10', title: '10. Futuro y Resumen' },
  ];

  return (
    <div className="max-w-5xl mx-auto pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-8 print:hidden">
        <button 
          onClick={() => router.push(`/${tenantId}/discovery`)}
          className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a Discovery
        </button>
        <div className="flex items-center gap-4">
          {isSaving ? (
            <span className="flex items-center gap-2 text-sm text-slate-500"><Save className="w-4 h-4 animate-pulse" /> Guardando...</span>
          ) : (
            <span className="flex items-center gap-2 text-sm text-emerald-500"><CheckCircle2 className="w-4 h-4" /> Autoguardado activo</span>
          )}
          <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-slate-600 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <Printer className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {blocks.map(block => {
          const isOpen = activeBlock === block.id;
          return (
            <div key={block.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all print:border-none print:shadow-none">
              
              {/* Accordion Header */}
              <button 
                onClick={() => setActiveBlock(isOpen ? '' : block.id)}
                className={`w-full flex items-center justify-between p-6 text-left transition-colors print:hidden ${isOpen ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <h3 className={`text-xl font-bold ${isOpen ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                  {block.title}
                </h3>
                {isOpen ? <ChevronDown className="w-6 h-6 text-indigo-500" /> : <ChevronRight className="w-6 h-6 text-slate-400" />}
              </button>

              {/* Contenido Impresión Título (solo se ve al imprimir) */}
              <div className="hidden print:block mb-4 border-b pb-2">
                <h3 className="text-xl font-bold">{block.title}</h3>
              </div>

              {/* Accordion Content */}
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
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notas generales</label>
                        <textarea value={headerData.general_notes || ''} onChange={e => updateHeader({general_notes: e.target.value})} className="w-full min-h-[100px] p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg" />
                      </div>
                    </div>
                  )}

                  {block.id === 'BLOCK_1' && (
                    <div>
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q1_datos" 
                        initialData={getAnswer(block.id, 'q1_datos')}
                        title="Datos Cuantitativos"
                        placeholder="Nº Clínicas, Gabinetes, Especialidades, Doctores, Higienistas, Pacientes/día..."
                        whyPrompt="Necesitamos dimensionar el tamaño real del negocio para calcular el volumen de licencias y el impacto económico base."
                      />
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q1_software" 
                        initialData={getAnswer(block.id, 'q1_software')}
                        title="Software Utilizado"
                        placeholder="PMS, Rx, Escáner, Financiación..."
                        whyPrompt="Identifica la viabilidad técnica de integraciones a través del Integration Hub de Atlas."
                      />
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q1_abierta" 
                        initialData={getAnswer(block.id, 'q1_abierta')}
                        title="Describe brevemente cómo funciona vuestra clínica"
                      />
                    </div>
                  )}

                  {block.id === 'BLOCK_2' && (
                    <QuestionItem 
                      interviewId={interviewId} blockId={block.id} questionKey="q2_dia" 
                      initialData={getAnswer(block.id, 'q2_dia')}
                      title="Cuéntame cómo transcurre un día normal desde que abrís hasta que cerráis"
                      placeholder="Texto, observaciones e ideas detectadas..."
                    />
                  )}

                  {block.id === 'BLOCK_3' && (
                    <div>
                       <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q3_dinero" 
                        initialData={getAnswer(block.id, 'q3_dinero')}
                        title="¿Qué os hace perder más dinero?"
                        whyPrompt="Esta respuesta alimenta el Business Value Engine y nos permite estimar el ROI potencial de Atlas."
                      />
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q3_repetitivas" 
                        initialData={getAnswer(block.id, 'q3_repetitivas')}
                        title="¿Qué tareas repetitivas odiáis?"
                      />
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q3_errores" 
                        initialData={getAnswer(block.id, 'q3_errores')}
                        title="¿Qué errores ocurren con frecuencia y procesos se olvidan?"
                      />
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q3_magia" 
                        initialData={getAnswer(block.id, 'q3_magia')}
                        title="Si pudieras eliminar un problema mañana mismo... ¿Cuál sería?"
                      />
                    </div>
                  )}

                  {block.id === 'BLOCK_4' && (
                    <QuestionItem 
                      interviewId={interviewId} blockId={block.id} questionKey="q4_recorrido" 
                      initialData={getAnswer(block.id, 'q4_recorrido')}
                      title="Recorrido del Paciente"
                      placeholder="Fases: Primera llamada -> Primera visita -> Diagnóstico -> Presupuesto -> Financiación -> Tratamiento -> Revisiones -> Recall. ¿Cómo trabajáis? ¿Qué problemas hay? ¿Qué automatizaríais?"
                    />
                  )}

                  {block.id === 'BLOCK_5' && (
                    <QuestionItem 
                      interviewId={interviewId} blockId={block.id} questionKey="q5_recepcion" 
                      initialData={getAnswer(block.id, 'q5_recepcion')}
                      title="Recepción"
                      placeholder="Llamadas atendidas/perdidas, confirmación citas, urgencias..."
                    />
                  )}

                  {block.id === 'BLOCK_6' && (
                    <QuestionItem 
                      interviewId={interviewId} blockId={block.id} questionKey="q6_coordinadora" 
                      initialData={getAnswer(block.id, 'q6_coordinadora')}
                      title="Coordinadora"
                      placeholder="Presentación presupuestos, seguimiento, financiación..."
                    />
                  )}

                  {block.id === 'BLOCK_7' && (
                    <QuestionItem 
                      interviewId={interviewId} blockId={block.id} questionKey="q7_labs" 
                      initialData={getAnswer(block.id, 'q7_labs')}
                      title="Laboratorios"
                      placeholder="Control de envíos, entregas, retrasos..."
                    />
                  )}

                  {block.id === 'BLOCK_8' && (
                    <QuestionItem 
                      interviewId={interviewId} blockId={block.id} questionKey="q8_stock" 
                      initialData={getAnswer(block.id, 'q8_stock')}
                      title="Stock"
                      placeholder="Pedidos, inventario, caducidades..."
                    />
                  )}

                  {block.id === 'BLOCK_9' && (
                    <QuestionItem 
                      interviewId={interviewId} blockId={block.id} questionKey="q9_tech" 
                      initialData={getAnswer(block.id, 'q9_tech')}
                      title="Tecnología Actual"
                      placeholder="¿Qué software usan? ¿Qué les gusta? ¿Qué odian? ¿Qué integrarían?"
                    />
                  )}

                  {block.id === 'BLOCK_10' && (
                    <div>
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q10_atlas" 
                        initialData={getAnswer(block.id, 'q10_atlas')}
                        title="Si Atlas pudiera hacer cualquier cosa... ¿Qué le pedirías?"
                        whyPrompt="Permite descubrir features de producto que los clientes realmente valoran."
                      />
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q10_precio" 
                        initialData={getAnswer(block.id, 'q10_precio')}
                        title="¿Por qué pagarías 500 €/mes?"
                      />
                      <QuestionItem 
                        interviewId={interviewId} blockId={block.id} questionKey="q10_cambio" 
                        initialData={getAnswer(block.id, 'q10_cambio')}
                        title="¿Qué cambiaría completamente vuestra forma de trabajar?"
                      />

                      {/* Resumen Final Agregado (UI funcional sin IA) */}
                      <Block10Summary 
                        answers={initialAnswers}
                        interviewId={interviewId}
                        status={status}
                        onStatusChange={setStatus}
                      />
                    </div>
                  )}

                  {/* Block Navigation */}
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
