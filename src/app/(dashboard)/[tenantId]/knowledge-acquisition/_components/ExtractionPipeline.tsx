"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ScanText, GripHorizontal, Cpu, CheckCircle } from 'lucide-react';
import { PipelineStatus } from './useKnowledgeAcquisition';

interface Props {
  status: PipelineStatus;
  progress: number;
}

export function ExtractionPipeline({ status, progress }: Props) {
  if (status === 'idle') return null;

  const steps = [
    { id: 'uploading', icon: <ScanText className="w-5 h-5" />, label: 'Leyendo Documento' },
    { id: 'ocr', icon: <ScanText className="w-5 h-5" />, label: 'Extracción OCR' },
    { id: 'chunking', icon: <GripHorizontal className="w-5 h-5" />, label: 'Fragmentación Semántica' },
    { id: 'proposing', icon: <Cpu className="w-5 h-5" />, label: 'Generando Propuestas' },
  ];

  const getStepState = (stepId: string) => {
    const order = ['uploading', 'ocr', 'chunking', 'proposing', 'done'];
    const currentIndex = order.indexOf(status);
    const stepIndex = order.indexOf(stepId);

    if (currentIndex > stepIndex) return 'completed';
    if (currentIndex === stepIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
      <h3 className="font-bold text-slate-900 dark:text-white mb-6">Pipeline de Ingesta</h3>
      
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-5 left-6 right-6 h-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-5 left-6 h-1 bg-indigo-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `calc(${progress}% - 3rem)` }}
        />

        <div className="flex justify-between relative z-10">
          {steps.map((step) => {
            const state = getStepState(step.id);
            return (
              <div key={step.id} className="flex flex-col items-center gap-3">
                <motion.div 
                  initial={false}
                  animate={{
                    backgroundColor: state === 'completed' ? '#22c55e' : state === 'active' ? '#6366f1' : '#f1f5f9',
                    borderColor: state === 'active' ? '#818cf8' : 'transparent',
                    scale: state === 'active' ? 1.1 : 1,
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 text-white shadow-sm
                    ${state === 'pending' ? 'text-slate-400 dark:bg-slate-800' : ''}
                  `}
                >
                  {state === 'completed' ? <CheckCircle className="w-5 h-5 text-white" /> : step.icon}
                </motion.div>
                <span className={`text-xs font-semibold ${
                  state === 'active' ? 'text-indigo-600 dark:text-indigo-400' :
                  state === 'completed' ? 'text-slate-700 dark:text-slate-300' :
                  'text-slate-400'
                }`}>
                  {step.label}
                </span>
                
                {state === 'active' && (
                  <motion.div 
                    layoutId="pulse"
                    className="absolute -bottom-6 flex items-center gap-1 text-[10px] text-indigo-500 font-bold uppercase tracking-wider"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                    Procesando...
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
