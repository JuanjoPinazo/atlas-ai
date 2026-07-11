"use client";

import React, { useState } from 'react';
import { DiscoveryWizard } from './views/DiscoveryWizard';
import { DiscoveryDashboard } from './views/DiscoveryDashboard';
import { DiscoveryResult } from '@/lib/schemas/discovery';
import { processDiscoveryForm } from '@/app/actions/discovery';
import { Plus, Search, FileText, ClipboardList, PieChart, Users, MessageSquare, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createInterviewAction, createDemoInterviewAction } from '@/app/actions/interview';

type Tab = 'PROSPECTOS' | 'ENTREVISTAS' | 'ASSESSMENTS' | 'INFORMES';

export function DiscoveryClient({ tenantId }: { tenantId: string }) {
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('ENTREVISTAS');
  const [isCreatingInterview, setIsCreatingInterview] = useState(false);
  const router = useRouter();

  const handleWizardComplete = async (data: any) => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500));
    const response = await processDiscoveryForm(data);
    if (response.success && response.data) {
      setResult(response.data);
    }
    setIsProcessing(false);
  };

  const handleNewInterview = async () => {
    try {
      setIsCreatingInterview(true);
      const interview = await createInterviewAction(tenantId);
      router.push(`/${tenantId}/discovery/interview/${interview.id}`);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Error al crear la entrevista");
      setIsCreatingInterview(false);
    }
  };

  const handleDemoInterview = async () => {
    try {
      setIsCreatingInterview(true);
      const interview = await createDemoInterviewAction(tenantId);
      router.push(`/${tenantId}/discovery/interview/${interview.id}`);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Error al generar la demo");
      setIsCreatingInterview(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-full bg-slate-950 flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">Motor de Diagnóstico Activo</h2>
        <p className="text-slate-400">Analizando madurez digital y calculando el Business Value latente...</p>
      </div>
    );
  }

  // Si hay un resultado del discovery antiguo, mostramos el dashboard antiguo (opcional, o podemos ocultarlo tras las tabs)
  if (result) {
    return (
      <div className="min-h-full bg-slate-950 p-4 md:p-8 relative overflow-x-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none print:hidden" />
        <div className="relative z-10 w-full">
          <DiscoveryDashboard result={result} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 lg:mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <Search className="w-8 h-8 lg:w-10 lg:h-10 text-indigo-500" />
              Atlas Discovery
            </h1>
            <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Centro de exploración y entrevistas cualitativas para el sector dental.
            </p>
          </div>
          
          <div>
            <button
              onClick={handleNewInterview}
              disabled={isCreatingInterview}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              Nueva entrevista estratégica
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto hide-scrollbar">
          <button
            onClick={() => setActiveTab('PROSPECTOS')}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'PROSPECTOS' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
            Prospectos
          </button>
          <button
            onClick={() => setActiveTab('ENTREVISTAS')}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'ENTREVISTAS' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Entrevistas
          </button>
          <button
            onClick={() => setActiveTab('ASSESSMENTS')}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'ASSESSMENTS' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Assessments
          </button>
          <button
            onClick={() => setActiveTab('INFORMES')}
            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === 'INFORMES' 
                ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <PieChart className="w-4 h-4" />
            Informes
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 min-h-[400px]">
          {activeTab === 'PROSPECTOS' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 py-12">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <p>Módulo de prospectos en desarrollo...</p>
            </div>
          )}
          {activeTab === 'ENTREVISTAS' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-6 py-12">
              <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <p>No hay entrevistas finalizadas. Haz clic en "Nueva entrevista estratégica" para empezar.</p>
              <button
                onClick={handleDemoInterview}
                disabled={isCreatingInterview}
                className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircle className="w-5 h-5" />
                Generar Entrevista DEMO
              </button>
            </div>
          )}
          {activeTab === 'ASSESSMENTS' && (
            <div>
              {/* Previous Discovery Wizard for backward compatibility or integration */}
              <DiscoveryWizard onComplete={handleWizardComplete} />
            </div>
          )}
          {activeTab === 'INFORMES' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4 py-12">
              <PieChart className="w-12 h-12 text-slate-300 dark:text-slate-700" />
              <p>Módulo de informes en desarrollo...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
