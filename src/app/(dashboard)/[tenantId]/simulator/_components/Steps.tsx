"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, Database, ShieldAlert, Cpu } from 'lucide-react';

export function StepFilters({ intent, isComplete }: { intent: string; isComplete: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700">
        Idioma: Auto-detectado (ES)
      </span>
      <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-sm font-medium border border-slate-200 dark:border-slate-700">
        Dominio inferido: Atención al Cliente
      </span>
      {isComplete && (
        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-200 dark:border-green-800 flex items-center gap-1">
          <CheckCircle2 className="w-4 h-4" /> Filtros aplicados
        </span>
      )}
    </div>
  );
}

export function StepSources({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-3 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex-1">
        <Database className="w-8 h-8 text-blue-500" />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Knowledge Base</p>
          <p className="text-xs text-slate-500">Vector Search (pgvector)</p>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-white dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex-1 opacity-50">
        <ShieldAlert className="w-8 h-8 text-amber-500" />
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Reglas Estrictas</p>
          <p className="text-xs text-slate-500">Filtrado RLS Exacto</p>
        </div>
      </div>
    </div>
  );
}

export function StepUnits({ isComplete }: { isComplete: boolean }) {
  if (!isComplete) return <div className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg"></div>;
  
  return (
    <div className="space-y-3">
      <div className="bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">Regla de Negocio</span>
          <span className="text-xs text-slate-400 font-mono">ID: unit_a1b2</span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          "Las devoluciones de productos tecnológicos solo se aceptan dentro de los primeros 14 días con el embalaje original intacto."
        </p>
      </div>
    </div>
  );
}

export function StepRanking({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-24 text-sm font-medium text-slate-600 dark:text-slate-400">Relevancia</div>
        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: isComplete ? '92%' : '0%' }} 
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-green-400 to-green-500"
          ></motion.div>
        </div>
        <div className="w-12 text-right text-sm font-bold text-slate-900 dark:text-white">92%</div>
      </div>
    </div>
  );
}

export function StepTokenBudget({ isComplete }: { isComplete: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-slate-700 dark:text-slate-300">Uso de Ventana de Contexto</span>
        <span className="text-slate-500 font-mono">342 / 8192 tokens</span>
      </div>
      <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
        <motion.div 
          initial={{ width: 0 }} 
          animate={{ width: isComplete ? '4%' : '0%' }} 
          transition={{ duration: 0.5 }}
          className="h-full bg-indigo-500"
        ></motion.div>
      </div>
    </div>
  );
}

export function StepContextPackage({ isComplete }: { isComplete: boolean }) {
  if (!isComplete) return <div className="h-32 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg"></div>;
  
  const mockJson = {
    "intent": "policy_inquiry",
    "retrieved_context": [
      {
        "content": "Las devoluciones de productos tecnológicos solo se aceptan dentro de los primeros 14 días con el embalaje original intacto.",
        "type": "strict_rule",
        "confidence": 0.92
      }
    ],
    "instructions": "Answer the user strictly using the retrieved context. Do not invent policies."
  };

  return (
    <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto border border-slate-700">
      <pre className="text-xs text-green-400 font-mono">
        {JSON.stringify(mockJson, null, 2)}
      </pre>
    </div>
  );
}

export function StepRetrievalEvent({ isComplete }: { isComplete: boolean }) {
  if (!isComplete) return null;
  
  return (
    <div className="bg-black rounded-lg p-4 border border-slate-800 font-mono text-xs text-slate-300">
      <div className="flex items-center gap-2 mb-2 text-slate-500">
        <Cpu className="w-4 h-4" />
        <span>System Telemetry Log</span>
      </div>
      <p><span className="text-blue-400">[INFO]</span> ContextEngine - Processing Request ID req_8f92a1</p>
      <p><span className="text-blue-400">[INFO]</span> SemanticSearch - 1 unit retrieved in 42ms</p>
      <p><span className="text-green-400">[SUCCESS]</span> ContextPackage built and sent to Agent layer</p>
    </div>
  );
}
