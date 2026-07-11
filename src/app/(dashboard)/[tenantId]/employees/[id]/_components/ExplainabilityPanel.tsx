"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExplainabilityTrace } from '@/lib/services/llm/llm-provider.interface';
import { BookOpen, GitMerge, ShieldCheck, FileCode2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export function ExplainabilityPanel({ trace }: { trace?: ExplainabilityTrace }) {
  if (!trace) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Explainability Panel</h3>
        <p className="text-sm text-slate-500 max-w-[250px]">
          Selecciona un mensaje del asistente para ver exactamente qué contexto y reglas guiaron su respuesta.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900/50 border-l border-slate-200 dark:border-slate-800 overflow-y-auto custom-scrollbar">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/80 sticky top-0 backdrop-blur-md z-10">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Trace Report</h3>
        <p className="text-xs text-slate-500">Transparencia de decisión del modelo</p>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Context Engine */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Context Engine (Retrieval)
          </h4>
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
            {trace.contextSources.length > 0 ? (
              <ul className="space-y-2">
                {trace.contextSources.map((source, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 flex-shrink-0"></span>
                    {source}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No se utilizó contexto extra del Brain.</p>
            )}
          </div>
        </div>

        {/* Decision Engine */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <GitMerge className="w-4 h-4 text-amber-500" />
            Decision Engine (DNA)
          </h4>
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Estado Final:</span>
              <span className={`text-xs font-bold flex items-center gap-1 px-2 py-1 rounded-full ${
                trace.decisionState === 'COMPLETED' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                trace.decisionState === 'POLICY_CONFLICT' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
              }`}>
                {trace.decisionState === 'COMPLETED' ? <CheckCircle2 className="w-3 h-3"/> : <AlertTriangle className="w-3 h-3" />}
                {trace.decisionState}
              </span>
            </div>
            
            {trace.appliedRules.length > 0 && (
              <div>
                <span className="text-xs font-medium text-slate-500 mb-1 block">Reglas Aplicadas:</span>
                <ul className="space-y-1">
                  {trace.appliedRules.map((rule, i) => (
                    <li key={i} className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-1.5 rounded-md border border-amber-100 dark:border-amber-900/50">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Validation Engine */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Validation Engine
          </h4>
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Filtro Antialucinaciones:</span>
            {trace.validationPassed ? (
              <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> PASSED
              </span>
            ) : (
              <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> FAILED
              </span>
            )}
          </div>
        </div>

        {/* Final Prompt Builder */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 uppercase tracking-wider">
            <FileCode2 className="w-4 h-4 text-cyan-500" />
            Prompt Builder
          </h4>
          <div className="bg-slate-900 rounded-xl p-3 border border-slate-800">
            <pre className="text-[10px] text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
              {trace.finalPrompt || "// No prompt preview available"}
            </pre>
          </div>
        </div>

        {/* Tokens */}
        {trace.tokenUsage && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-500 font-mono">
            <span>P: {trace.tokenUsage.promptTokens}</span>
            <span>C: {trace.tokenUsage.completionTokens}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">Total: {trace.tokenUsage.totalTokens}</span>
          </div>
        )}

      </div>
    </div>
  );
}
