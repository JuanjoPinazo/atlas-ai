"use client";

import React, { useState } from 'react';
import { OverviewView } from './views/OverviewView';
import { KnowledgeTree } from './views/KnowledgeTree';
import { LayoutGrid, Network, ListChecks, DollarSign, Wand2 } from 'lucide-react';
import { ContextualHelp } from './_components/ContextualHelp';

interface Props {
  data: any;
}

type TabType = 'overview' | 'tree' | 'implementation' | 'commercial' | 'pack';

export function DentalManagerClient({ data }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const renderTab = () => {
    switch(activeTab) {
      case 'overview':
        return <OverviewView items={data.items} domains={data.domains} />;
      case 'tree':
        return <KnowledgeTree 
          domains={data.domains} 
          categories={data.categories} 
          items={data.items}
          allBenefits={data.benefits}
          allQuestions={data.questions}
          allAutomations={data.automations}
        />;
      case 'implementation':
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Preguntas de Implantación</h2>
            <p className="text-sm text-slate-500 mb-6">Filtra las preguntas necesarias para el Onboarding.</p>
            {data.questions.map((q: any) => (
              <div key={q.id} className="p-4 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold uppercase text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded">{q.category}</span>
                <p className="mt-2 font-medium text-slate-800 dark:text-slate-200">{q.question_text}</p>
              </div>
            ))}
          </div>
        );
      case 'commercial':
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Ventajas Comerciales</h2>
            <p className="text-sm text-slate-500 mb-6">Argumentario de ventas extraído del conocimiento validado.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.benefits.map((b: any) => (
                <div key={b.id} className="p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Target: {b.target_role}</span>
                    <span className="text-emerald-500 font-bold">{b.economic_impact_expected}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400"><strong>Dolor:</strong> {b.problem}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1"><strong>Solución:</strong> {b.solution}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'pack':
        return (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm text-center">
            <Wand2 className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Generador de Knowledge Pack</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-lg mx-auto">Selecciona las unidades de conocimiento validadas para empaquetarlas en un nuevo producto instalable por las clínicas.</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
              Generar Atlas Dental Premium
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8 flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto flex-1 flex flex-col">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 flex items-center gap-2">
            Dental Knowledge Manager
            <ContextualHelp text="Herramienta interna para estructurar el cerebro maestro dental." />
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
            Administra, revisa y convierte el conocimiento clínico en reglas operativas para los Empleados Digitales.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-px mb-8 overflow-x-auto custom-scrollbar">
          {[
            { id: 'overview', label: 'Vista General', icon: LayoutGrid },
            { id: 'tree', label: 'Árbol de Conocimiento', icon: Network },
            { id: 'implementation', label: 'Implantación', icon: ListChecks },
            { id: 'commercial', label: 'Ventas', icon: DollarSign },
            { id: 'pack', label: 'Pack Generator', icon: Wand2 }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-bold transition-colors whitespace-nowrap rounded-t-lg ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900 border-t border-l border-r border-slate-200 dark:border-slate-800' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Content */}
        <div className="flex-1">
          {renderTab()}
        </div>

      </div>
    </div>
  );
}
