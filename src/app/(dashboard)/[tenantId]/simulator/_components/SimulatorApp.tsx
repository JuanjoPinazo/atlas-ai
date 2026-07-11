"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles, Filter, Database, FileText, BarChart, HardDrive, Package, Terminal } from 'lucide-react';
import { 
  StepFilters, 
  StepSources, 
  StepUnits, 
  StepRanking, 
  StepTokenBudget, 
  StepContextPackage, 
  StepRetrievalEvent 
} from './Steps';

const STEPS = [
  { id: 'filters', label: '1. Filtros Aplicados', icon: Filter },
  { id: 'sources', label: '2. Fuentes Consultadas', icon: Database },
  { id: 'units', label: '3. Unidades Recuperadas', icon: FileText },
  { id: 'ranking', label: '4. Ranking de Relevancia', icon: BarChart },
  { id: 'tokens', label: '5. Presupuesto de Tokens', icon: HardDrive },
  { id: 'package', label: '6. ContextPackage', icon: Package },
  { id: 'event', label: '7. Evento Registrado', icon: Terminal },
];

export function SimulatorApp() {
  const [intent, setIntent] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const handleSimulate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!intent.trim()) return;

    setIsSimulating(true);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
  };

  useEffect(() => {
    if (isSimulating && currentStepIndex < STEPS.length) {
      const timer = setTimeout(() => {
        setCompletedSteps(prev => [...prev, STEPS[currentStepIndex].id]);
        if (currentStepIndex + 1 < STEPS.length) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsSimulating(false);
        }
      }, 1500); // 1.5 seconds per step
      return () => clearTimeout(timer);
    }
  }, [isSimulating, currentStepIndex]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      {/* Search Input Area */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
        <form 
          onSubmit={handleSimulate}
          className="relative flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl p-2 shadow-2xl"
        >
          <div className="pl-4">
            <Search className="text-indigo-500 w-6 h-6" />
          </div>
          <input
            type="text"
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            disabled={isSimulating}
            placeholder="Ej: Quiero saber la política de devoluciones..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-lg md:text-xl text-slate-900 dark:text-white placeholder-slate-400 px-4 py-3 md:py-4 outline-none"
          />
          <button
            type="submit"
            disabled={isSimulating || !intent.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed text-white px-6 py-3 md:py-4 rounded-xl font-semibold flex items-center gap-2 transition-colors"
          >
            {isSimulating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            <span className="hidden sm:inline">{isSimulating ? 'Procesando...' : 'Simular'}</span>
          </button>
        </form>
      </div>

      {/* Pipeline Visualizer */}
      <AnimatePresence>
        {(currentStepIndex >= 0 || completedSteps.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6"
          >
            {STEPS.map((step, index) => {
              const isActive = currentStepIndex === index;
              const isCompleted = completedSteps.includes(step.id);
              const isVisible = isActive || isCompleted;

              if (!isVisible) return null;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`border rounded-2xl p-6 ${
                    isActive 
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800 ring-2 ring-indigo-500/20 shadow-lg'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                  } transition-all duration-500`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isActive 
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <h3 className={`text-lg font-bold ${
                      isActive ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {step.label}
                    </h3>
                    {isActive && (
                      <span className="ml-auto text-xs font-semibold uppercase tracking-wider text-indigo-500 bg-indigo-100 dark:bg-indigo-900/50 px-2 py-1 rounded-full animate-pulse">
                        En proceso
                      </span>
                    )}
                  </div>
                  
                  <div className="pl-14">
                    {/* Render corresponding step component */}
                    {step.id === 'filters' && <StepFilters intent={intent} isComplete={isCompleted} />}
                    {step.id === 'sources' && <StepSources isComplete={isCompleted} />}
                    {step.id === 'units' && <StepUnits isComplete={isCompleted} />}
                    {step.id === 'ranking' && <StepRanking isComplete={isCompleted} />}
                    {step.id === 'tokens' && <StepTokenBudget isComplete={isCompleted} />}
                    {step.id === 'package' && <StepContextPackage isComplete={isCompleted} />}
                    {step.id === 'event' && <StepRetrievalEvent isComplete={isCompleted} />}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
