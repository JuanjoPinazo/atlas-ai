"use client";

import { useState, useMemo, useEffect } from 'react';
import { AssessmentQuestion, AssessmentAnswer, AssessmentBranchRule } from '@/lib/schemas/assessment';
import { saveAnswer, finishAssessment, getAssessmentAnswers } from '@/app/actions/assessment';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';
import { ChevronRight, ChevronLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AssessmentEngine } from '@/lib/assessment/AssessmentEngine';

export function WizardClient({ 
  tenantId, 
  assessmentId, 
  initialAnswers, 
  allQuestions,
  rules
}: { 
  tenantId: string, 
  assessmentId: string, 
  initialAnswers: AssessmentAnswer[], 
  allQuestions: AssessmentQuestion[],
  rules: AssessmentBranchRule[]
}) {
  const router = useRouter();
  const [answers, setAnswers] = useState<AssessmentAnswer[]>(initialAnswers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load actual answers
  useEffect(() => {
    getAssessmentAnswers(assessmentId).then(res => {
      if (res.data) setAnswers(res.data);
      setLoading(false);
    });
  }, [assessmentId]);

  // Compute visible questions dynamically based on current answers
  const visibleQuestions = useMemo(() => {
    return AssessmentEngine.evaluateBranching(allQuestions, answers, rules);
  }, [allQuestions, answers, rules]);

  if (loading) {
    return <div className="p-12 text-center text-white"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  }

  // Ensure index is within bounds of visible questions
  const safeIndex = Math.min(currentIndex, Math.max(0, visibleQuestions.length - 1));
  const question = visibleQuestions[safeIndex];

  if (!question) {
    return <div className="text-white">No questions available.</div>;
  }

  const isLast = safeIndex === visibleQuestions.length - 1;
  const currentAnswer = answers.find(a => a.question_id === question.id);
  const canContinue = !!currentAnswer && currentAnswer.selected_option_ids.length > 0;

  const handleSelect = (optionId: string) => {
    const newAnswer: AssessmentAnswer = {
      id: crypto.randomUUID(),
      session_id: assessmentId,
      question_id: question.id,
      selected_option_ids: [optionId],
      confidence_score: question.help_context.confianza || 1,
      skipped: false
    };

    setAnswers(prev => {
      const filtered = prev.filter(a => a.question_id !== question.id);
      return [...filtered, newAnswer];
    });
  };

  const handleNext = async () => {
    if (!currentAnswer) return;
    
    setSaving(true);
    // Persist answer immediately
    await saveAnswer({
      session_id: currentAnswer.session_id,
      question_id: currentAnswer.question_id,
      selected_option_ids: currentAnswer.selected_option_ids,
      confidence_score: currentAnswer.confidence_score,
      skipped: currentAnswer.skipped
    });
    
    if (isLast) {
      const res = await finishAssessment(assessmentId);
      if (res.data) {
        router.push(`/${tenantId}/assessment/results/${assessmentId}`);
      }
    } else {
      setCurrentIndex(safeIndex + 1);
    }
    setSaving(false);
  };

  const handlePrev = () => {
    setCurrentIndex(Math.max(0, safeIndex - 1));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${((safeIndex + 1) / visibleQuestions.length) * 100}%` }}></div>
          </div>
          <span className="text-sm font-medium text-slate-400">
            {safeIndex + 1} de {visibleQuestions.length}
          </span>
        </div>

        {/* Question Panel */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-2xl flex flex-col min-h-[400px]">
          <h2 className="text-2xl font-light text-white mb-8">{question.text}</h2>
          
          <div className="space-y-4 flex-1">
            {question.options.map(opt => {
              const isSelected = currentAnswer?.selected_option_ids.includes(opt.id);
              return (
                <label 
                  key={opt.id} 
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                  onClick={() => handleSelect(opt.id)}
                >
                  <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-indigo-400 bg-indigo-500/20' : 'border-slate-600'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-indigo-400"></div>}
                  </div>
                  <span className="text-lg font-light leading-snug">{opt.label}</span>
                </label>
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800/50">
            <button 
              onClick={handlePrev}
              disabled={safeIndex === 0 || saving}
              className="px-5 py-2.5 rounded-lg text-slate-400 hover:text-white font-medium flex items-center gap-2 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Anterior
            </button>
            <button 
              onClick={handleNext}
              disabled={!canContinue || saving}
              className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
                canContinue && !saving
                  ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : isLast ? 'Finalizar Evaluación' : 'Siguiente Pregunta'}
              {!saving && (isLast ? <CheckCircle className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />)}
            </button>
          </div>
        </div>

      </div>

      <div className="lg:col-span-1 flex flex-col gap-6">
        <PageHelpPanel 
          pageId="wizard_help"
          title={`Diagnóstico`}
          description={question.help_context.reason || 'Análisis de componente.'}
          roiImpact={question.help_context.economic_impact || 'Detectando fugas de rentabilidad.'}
        />
        
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Problema Detectado</h4>
          <p className="text-sm text-slate-300 font-light mb-6">{question.help_context.problem || 'Validación de estado.'}</p>
        </div>
      </div>
    </div>
  );
}
