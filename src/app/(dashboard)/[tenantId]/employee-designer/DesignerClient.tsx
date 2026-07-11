"use client";

import React, { useState } from 'react';
import { DigitalEmployeeProfile, OrgNode } from '@/lib/schemas/employee-designer';
import { OrgChartView } from './views/OrgChartView';
import { TrainingCenterView } from './views/TrainingCenterView';
import { WizardView } from './views/WizardView';
import { FrameworkHelp } from '../framework/_components/FrameworkHelp';
import { Network, GraduationCap, PlusCircle } from 'lucide-react';

interface Props {
  employees: DigitalEmployeeProfile[];
  orgChart: OrgNode;
}

type Tab = 'org' | 'training' | 'wizard';

export function DesignerClient({ employees, orgChart }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('org');

  const helpData = {
    what: 'El Atlas Employee Designer permite visualizar, gestionar y formar a la plantilla de Empleados Digitales.',
    why: 'Para humanizar la Inteligencia Artificial. Los clientes no compran "software", compran "miembros del equipo" que no duermen.',
    value: 'Integra a los agentes de IA directamente en el organigrama de la clínica junto a los humanos, mostrando KPIs de rendimiento por cada uno.',
    sales: '"Atlas no es un bot. Es la Dra. Aida y el Dr. Leo, que trabajan 24/7 en tu clínica sin pedir vacaciones, recuperando 45.000€ al mes."',
    setup: 'Se puede crear un empleado nuevo asignándole Misión, Permisos y Conocimiento desde el Wizard.',
    roi: 'Al mostrar los KPIs por agente, el cliente ve exactamente el retorno económico de cada "nómina digital".'
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1400px] w-full mx-auto flex flex-col h-full relative z-10">
        
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 tracking-tight mb-4">
              Employee Designer
            </h1>
            <p className="text-slate-400 max-w-2xl text-base md:text-lg">
              Diseña, entrena y supervisa a tu plantilla digital. Integra a Atlas en tu organigrama.
            </p>
          </div>
          <FrameworkHelp data={helpData} />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-slate-800 pb-px mb-8">
          <button
            onClick={() => setActiveTab('org')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all rounded-t-xl ${
              activeTab === 'org' 
                ? 'bg-slate-900/80 border-t border-l border-r border-slate-700 text-indigo-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Network className="w-5 h-5" /> La Plantilla
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all rounded-t-xl ${
              activeTab === 'training' 
                ? 'bg-slate-900/80 border-t border-l border-r border-slate-700 text-emerald-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-5 h-5" /> Centro de Formación
          </button>
          <button
            onClick={() => setActiveTab('wizard')}
            className={`flex items-center gap-2 px-6 py-3 font-bold transition-all rounded-t-xl ${
              activeTab === 'wizard' 
                ? 'bg-slate-900/80 border-t border-l border-r border-slate-700 text-purple-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <PlusCircle className="w-5 h-5" /> Contratar Empleado
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'org' && <OrgChartView orgChart={orgChart} employees={employees} />}
          {activeTab === 'training' && <TrainingCenterView employees={employees} />}
          {activeTab === 'wizard' && <WizardView />}
        </div>

      </div>
    </div>
  );
}
