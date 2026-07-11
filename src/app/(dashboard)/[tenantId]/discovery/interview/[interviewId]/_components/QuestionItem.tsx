import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { DiscoveryInterviewAnswer } from '@/lib/schemas/interview';
import { useInterviewAnswer } from './useInterviewHooks';

interface QuestionItemProps {
  interviewId: string;
  blockId: string;
  questionKey: string;
  title: string;
  placeholder?: string;
  whyPrompt?: string;
  initialData?: DiscoveryInterviewAnswer;
}

export function QuestionItem({
  interviewId,
  blockId,
  questionKey,
  title,
  placeholder,
  whyPrompt,
  initialData
}: QuestionItemProps) {
  const { answerText, intelligence, status, updateAnswerText, updateIntelligence, forceSave } = useInterviewAnswer(
    interviewId, blockId, questionKey, initialData
  );
  const [showIntelligence, setShowIntelligence] = useState(false);
  const [showWhy, setShowWhy] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    // Scroll smoothly so keyboard doesn't hide input on iPad
    if (containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  };

  return (
    <div ref={containerRef} className="mb-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          {title}
          {whyPrompt && (
            <div className="relative">
              <button 
                onClick={() => setShowWhy(!showWhy)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-amber-500 transition-colors"
                title="¿Por qué preguntamos esto?"
              >
                <Lightbulb className="w-5 h-5" />
              </button>
              {showWhy && (
                <div className="absolute left-0 top-full mt-2 w-72 p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-lg shadow-lg z-10">
                  <p className="text-sm text-amber-800 dark:text-amber-200">{whyPrompt}</p>
                </div>
              )}
            </div>
          )}
        </h4>
        <div className="flex items-center text-xs font-medium">
          {status === 'SAVING' && (
            <span className="flex items-center gap-1 text-slate-400"><Save className="w-3 h-3 animate-pulse" /> Guardando...</span>
          )}
          {status === 'SAVED' && (
            <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 className="w-3 h-3" /> Guardado</span>
          )}
          {status === 'PENDING_SYNC' && (
            <div className="flex items-center gap-2 text-amber-500">
              <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Pendiente de sincronizar</span>
              <button onClick={forceSave} className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 px-2 py-1 rounded">
                Sincronizar ahora
              </button>
            </div>
          )}
          {status === 'ERROR' && (
            <div className="flex items-center gap-2 text-red-500">
              <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Error al guardar</span>
              <button onClick={forceSave} className="flex items-center gap-1 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/50 px-2 py-1 rounded">
                <RefreshCw className="w-3 h-3" /> Reintentar
              </button>
            </div>
          )}
        </div>
      </div>
      
      <textarea
        value={answerText}
        onChange={(e) => updateAnswerText(e.target.value)}
        onFocus={handleFocus}
        placeholder={placeholder || "Escribe tu respuesta aquí..."}
        className="w-full min-h-[160px] p-5 text-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y text-slate-700 dark:text-slate-300 transition-shadow"
      />

      <div className="mt-4">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setShowIntelligence(!showIntelligence)}
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 px-2 py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            {showIntelligence ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Opciones de Inteligencia (Consultor)
          </button>
          <label className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-500 cursor-pointer p-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20">
            <input 
              type="checkbox" 
              checked={!!intelligence.needs_deep_dive}
              onChange={(e) => updateIntelligence({ needs_deep_dive: e.target.checked })}
              className="w-4 h-4 text-amber-500 border-amber-300 rounded focus:ring-amber-500"
            />
            Marcar para profundizar después
          </label>
        </div>

        {showIntelligence && (
          <div className="mt-4 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/50 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">Nivel de Dolor (1-5)</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(level => (
                  <button
                    key={level}
                    onClick={() => updateIntelligence({ pain_level: level })}
                    className={`flex-1 h-12 rounded-lg font-bold text-lg flex items-center justify-center transition-all ${
                      intelligence.pain_level === level
                        ? 'bg-red-500 text-white shadow-md scale-105'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-red-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3">Impacto Económico</label>
              <select
                value={intelligence.economic_impact || ''}
                onChange={(e) => updateIntelligence({ economic_impact: e.target.value as any })}
                className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-base"
              >
                <option value="">Seleccionar...</option>
                <option value="LOW">Bajo</option>
                <option value="MEDIUM">Medio</option>
                <option value="HIGH">Alto</option>
                <option value="VERY_HIGH">Muy Alto</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Área Afectada</label>
              <input
                type="text"
                value={intelligence.affected_area || ''}
                onChange={(e) => updateIntelligence({ affected_area: e.target.value })}
                onFocus={handleFocus}
                placeholder="Ej. Recepción, Gabinetes, Facturación..."
                className="w-full h-12 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Frase Literal (Cita textual del cliente)</label>
              <textarea
                value={intelligence.literal_quotes || ''}
                onChange={(e) => updateIntelligence({ literal_quotes: e.target.value })}
                onFocus={handleFocus}
                placeholder='"Exactamente lo que dijo el cliente..."'
                className="w-full min-h-[80px] p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm italic"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Observaciones</label>
              <textarea
                value={intelligence.observations || ''}
                onChange={(e) => updateIntelligence({ observations: e.target.value })}
                onFocus={handleFocus}
                placeholder="Notas internas del consultor..."
                className="w-full min-h-[80px] p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-2">Ideas para Atlas</label>
              <textarea
                value={intelligence.ideas || ''}
                onChange={(e) => updateIntelligence({ ideas: e.target.value })}
                onFocus={handleFocus}
                placeholder="Ideas de automatización o integración..."
                className="w-full min-h-[80px] p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
