"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { Building2, CheckCircle } from 'lucide-react';
import { useBusinessStudio } from './useBusinessStudio';
import { LivePreview } from './LivePreview';
import { Step1Company, Step2Domains, Step3Policies, Step4Agent } from './steps/WizardSteps';

export function BusinessStudioApp({ initialData }: { initialData?: any }) {
  const { state, isLoaded, updateState, nextStep, prevStep } = useBusinessStudio(initialData);
  const router = useRouter();
  const params = useParams();
  const [isSimulatingCreation, setIsSimulatingCreation] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  if (!isLoaded) return <div className="p-8 text-center text-slate-500 animate-pulse">Cargando estado guardado...</div>;

  const handleFinish = async () => {
    setIsSimulatingCreation(true);
    setLoadingText('Creando Company Brain...');
    await new Promise(r => setTimeout(r, 1200));
    setLoadingText('Configurando Dominios de Conocimiento...');
    await new Promise(r => setTimeout(r, 1000));
    setLoadingText('Estableciendo Reglas de Decisión...');
    await new Promise(r => setTimeout(r, 1000));
    setLoadingText('Inicializando Empleado Digital...');
    await new Promise(r => setTimeout(r, 1500));
    
    // Redirect to success
    router.push(`/${params.tenantId}/business-studio/success`);
  };

  const steps = [
    { title: 'Empresa', component: <Step1Company state={state} updateState={updateState} onNext={nextStep} onPrev={prevStep} /> },
    { title: 'Dominios', component: <Step2Domains state={state} updateState={updateState} onNext={nextStep} onPrev={prevStep} /> },
    { title: 'Reglas', component: <Step3Policies state={state} updateState={updateState} onNext={nextStep} onPrev={prevStep} /> },
    { title: 'Empleado Digital', component: <Step4Agent state={state} updateState={updateState} onNext={handleFinish} onPrev={prevStep} isLast /> },
  ];

  if (isSimulatingCreation) {
    return (
      <div className="min-h-[600px] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[50px] opacity-50 animate-pulse"></div>
          <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center relative z-10 animate-bounce shadow-2xl">
            <Building2 className="w-10 h-10 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white animate-pulse">
          {loadingText}
        </h2>
        <p className="text-slate-500">No cierres esta ventana...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full max-w-7xl mx-auto">
      
      {/* Left Column: Form */}
      <div className="flex-1 lg:max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">
              Paso {state.currentStep} de {steps.length}
            </span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round((state.currentStep / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${(state.currentStep / steps.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mt-4">
            {steps.map((s, i) => {
              const isPast = state.currentStep > i + 1;
              const isCurrent = state.currentStep === i + 1;
              return (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors ${
                    isPast ? 'bg-indigo-600 text-white' : 
                    isCurrent ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500' : 
                    'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle className="w-3 h-3" /> : i + 1}
                  </div>
                  <span className={`text-xs hidden sm:block ${isCurrent ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
          <AnimatePresence mode="wait">
            {steps[state.currentStep - 1].component}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Live Preview */}
      <div className="w-full lg:w-[400px]">
        <LivePreview state={state} />
      </div>
    </div>
  );
}
