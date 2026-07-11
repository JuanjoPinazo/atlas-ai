"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Dna, BrainCircuit, Bot, CheckCircle2 } from 'lucide-react';

interface Props {
  progress: number;
  currentStep: string;
}

export function InstallationProgress({ progress, currentStep }: Props) {
  const isDone = progress >= 100;

  return (
    <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
      >
        {isDone && (
          <div className="absolute inset-0 bg-green-500/10 pointer-events-none" />
        )}

        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-slate-100 dark:text-slate-800 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
              />
              <motion.circle
                className={`${isDone ? 'text-green-500' : 'text-indigo-500'} stroke-current transition-colors duration-300`}
                strokeWidth="8"
                strokeLinecap="round"
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                initial={{ strokeDasharray: "251.2", strokeDashoffset: "251.2" }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * progress) / 100 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {isDone ? (
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              ) : (
                <span className="text-xl font-bold text-slate-700 dark:text-slate-300">{Math.round(progress)}%</span>
              )}
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isDone ? '¡Pack Instalado con Éxito!' : 'Instalando Knowledge Pack...'}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium h-5">
            {currentStep}
          </p>
        </div>

        {/* Decorative elements showing what's being initialized */}
        <div className="grid grid-cols-4 gap-2 opacity-50">
          <div className={`h-1 rounded-full ${progress > 20 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1 rounded-full ${progress > 40 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1 rounded-full ${progress > 60 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`h-1 rounded-full ${progress > 80 ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
        </div>
      </motion.div>
    </div>
  );
}
