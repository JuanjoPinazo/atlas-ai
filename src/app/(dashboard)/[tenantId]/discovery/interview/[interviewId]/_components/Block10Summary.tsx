import React, { useState } from 'react';
import { DiscoveryInterviewAnswer } from '@/lib/schemas/interview';
import { CheckCircle2, AlertTriangle, Lightbulb, Activity, Save, HelpCircle, DollarSign, Plug, Zap } from 'lucide-react';
import { updateInterviewAction } from '@/app/actions/interview';

export function Block10Summary({ 
  answers,
  interviewId,
  status,
  onStatusChange
}: { 
  answers: DiscoveryInterviewAnswer[];
  interviewId: string;
  status: string;
  onStatusChange: (status: string) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);

  // Grouping logic based on Sprint 20.3 requirements
  const criticalProblems = answers.filter(a => (a.intelligence?.pain_level || 0) >= 4 && a.answer_text?.trim());
  const repetitiveTasks = answers.filter(a => a.question_key === 'q3_repetitivas' && a.answer_text?.trim());
  const forgottenProcesses = answers.filter(a => a.question_key === 'q3_errores' && a.answer_text?.trim());
  
  const opportunities = answers.filter(a => 
    (a.intelligence?.ideas?.trim() || a.question_key === 'q10_atlas') && a.answer_text?.trim()
  );
  
  const integrations = answers.filter(a => a.question_key === 'q9_tech' && a.answer_text?.trim());
  const deepDive = answers.filter(a => a.intelligence?.needs_deep_dive && a.answer_text?.trim());
  const essentialFeatures = answers.filter(a => a.question_key === 'q10_cambio' && a.answer_text?.trim());
  const wtp = answers.filter(a => a.question_key === 'q10_precio' && a.answer_text?.trim());

  const handleUpdateStatus = async (newStatus: string) => {
    setIsSaving(true);
    try {
      await updateInterviewAction(interviewId, { status: newStatus as any });
      onStatusChange(newStatus);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSection = (title: string, icon: React.ReactNode, items: DiscoveryInterviewAnswer[], showIntelligence = false) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-8 page-break-inside-avoid">
        <h5 className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-4 flex items-center gap-2">
          {icon}
          {title}
        </h5>
        <ul className="space-y-4">
          {items.map(ans => (
            <li key={ans.id} className="bg-white dark:bg-slate-900 p-4 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 break-inside-avoid">
              <p className="font-medium text-slate-800 dark:text-slate-200 mb-2 whitespace-pre-wrap">{ans.answer_text}</p>
              
              {ans.intelligence?.literal_quotes && (
                <p className="italic text-slate-600 dark:text-slate-400 border-l-2 border-slate-200 dark:border-slate-700 pl-3 my-3">
                  "{ans.intelligence.literal_quotes}"
                </p>
              )}

              {showIntelligence && ans.intelligence?.ideas && (
                <p className="text-indigo-600 dark:text-indigo-400 text-sm mt-2 flex gap-1">
                  <span className="font-bold">Idea:</span> {ans.intelligence.ideas}
                </p>
              )}

              {showIntelligence && (ans.intelligence?.pain_level || ans.intelligence?.economic_impact) && (
                <div className="flex gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  {ans.intelligence?.pain_level && <span className="text-red-500 font-bold">Dolor: {ans.intelligence.pain_level}/5</span>}
                  {ans.intelligence?.economic_impact && <span>Impacto: {ans.intelligence.economic_impact}</span>}
                  <span>Bloque: {ans.block_id}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mt-12 pt-8 border-t-2 border-slate-200 dark:border-slate-800">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          Resumen Estructurado (Automático)
        </h4>
        <div className="flex items-center gap-2 print:hidden">
           <span className={`px-3 py-1 rounded-full text-xs font-bold ${
             status === 'REVIEWED' ? 'bg-emerald-100 text-emerald-800' :
             status === 'COMPLETED' ? 'bg-amber-100 text-amber-800' :
             'bg-indigo-100 text-indigo-800'
           }`}>
             {status}
           </span>
        </div>
      </div>
      
      <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 print:border-none print:p-0 print:bg-transparent">
        <p className="mb-6 text-slate-500 print:hidden">
          Este resumen agrupa automáticamente las prioridades marcadas durante la entrevista. 
          Al editar las respuestas en los bloques anteriores, este resumen se actualizará la próxima vez que cargues la página.
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-8">
            {renderSection("Problemas Críticos (Dolor Alto)", <AlertTriangle className="w-5 h-5 text-red-500" />, criticalProblems, true)}
            {renderSection("Tareas Repetitivas (Cuellos de botella)", <Activity className="w-5 h-5 text-orange-500" />, repetitiveTasks, true)}
            {renderSection("Procesos Olvidados o Errores Frecuentes", <Activity className="w-5 h-5 text-amber-500" />, forgottenProcesses, true)}
            {renderSection("Pendiente de Profundizar", <HelpCircle className="w-5 h-5 text-blue-500" />, deepDive, true)}
          </div>
          <div className="space-y-8">
            {renderSection("Oportunidades & Ideas Atlas", <Lightbulb className="w-5 h-5 text-yellow-500" />, opportunities, true)}
            {renderSection("Integraciones Tecnológicas", <Plug className="w-5 h-5 text-indigo-500" />, integrations, true)}
            {renderSection("Funcionalidades Imprescindibles", <Zap className="w-5 h-5 text-emerald-500" />, essentialFeatures, true)}
            {renderSection("Disposición a Pagar (WTP)", <DollarSign className="w-5 h-5 text-green-600" />, wtp, true)}
          </div>
        </div>

        {/* Acciones Finales */}
        <div className="mt-12 flex justify-end gap-4 print:hidden border-t border-slate-200 dark:border-slate-800 pt-6">
           <button 
             onClick={() => handleUpdateStatus('COMPLETED')}
             disabled={isSaving}
             className="px-6 py-3 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/50 rounded-lg font-medium transition-colors"
           >
             Marcar como Pendiente de Revisión
           </button>
           <button 
             onClick={() => handleUpdateStatus('REVIEWED')}
             disabled={isSaving}
             className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2"
           >
             {isSaving ? <Save className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
             Finalizar y Revisado
           </button>
        </div>
      </div>
    </div>
  );
}
