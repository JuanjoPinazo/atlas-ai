"use client";

import React, { useState } from 'react';
import { ArrowRight, ChevronLeft, Building2, TrendingDown, Cpu } from 'lucide-react';
import { FrameworkHelp } from '../../framework/_components/FrameworkHelp';

interface Props {
  onComplete: (data: any) => void;
}

export function DiscoveryWizard({ onComplete }: Props) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    clinicName: '',
    revenue: '',
    cancellations: '',
    currentSoftware: ''
  });

  const handleNext = () => {
    if (step < 3) setStep(s => s + 1);
    else onComplete(data);
  };

  const helpData = [
    {
      what: 'Evaluación de Facturación',
      why: 'Para dimensionar el ticket medio y el ROI potencial.',
      value: 'Sitúa al cliente en un benchmark nacional.',
      sales: 'Cuanto más facturan, más duele un 1% de pérdida. Esa es tu palanca.',
      setup: 'No requiere configuración, es puro análisis cualitativo.',
      roi: 'Ayuda a calcular la Propuesta Económica final.'
    },
    {
      what: 'Análisis de Fugas (Puntos de Dolor)',
      why: 'Para encontrar dónde "sangra" la clínica económicamente.',
      value: 'Mapea problemas directos con soluciones de Empleados Digitales Atlas.',
      sales: '"¿Cuánto te cuesta una silla vacía por una cancelación de última hora?"',
      setup: 'Configura las prioridades del Business DNA automáticamente.',
      roi: 'Aquí es donde encontramos los 10K€ - 30K€ de ROI latente.'
    },
    {
      what: 'Nivel de Madurez Digital',
      why: 'Para evaluar si están preparados para IA Autónoma.',
      value: 'Define la curva de aprendizaje y el plan de implantación.',
      sales: '"No importa si usas Excel o el mejor CRM, Atlas se conecta por encima para ejecutar acciones, no para almacenar datos."',
      setup: 'Modifica la duración del Plan de Implantación (Fases).',
      roi: 'Reduce los costes de adopción si ya están digitalizados.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Discovery Center</h2>
        <FrameworkHelp data={helpData[step - 1]} />
      </div>

      <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step >= i ? 'bg-indigo-500' : 'bg-slate-800'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6 text-indigo-400">
              <Building2 className="w-8 h-8" />
              <h3 className="text-2xl font-bold text-white">Perfil de la Clínica</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Nombre de la Clínica</label>
                <input 
                  type="text" 
                  value={data.clinicName}
                  onChange={e => setData({...data, clinicName: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Facturación Anual Estimada</label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                  <option>&lt; 500.000€</option>
                  <option>500.000€ - 1.000.000€</option>
                  <option>&gt; 1.000.000€</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6 text-red-400">
              <TrendingDown className="w-8 h-8" />
              <h3 className="text-2xl font-bold text-white">Análisis de Fugas</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">¿Cuál es el mayor cuello de botella actual?</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Cancelaciones', 'Presupuestos Rechazados', 'Llamadas Perdidas', 'Gestión de Citas'].map(opt => (
                    <button key={opt} className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-left text-slate-300 hover:border-indigo-500 hover:bg-indigo-500/10 transition-colors">
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center gap-3 mb-6 text-emerald-400">
              <Cpu className="w-8 h-8" />
              <h3 className="text-2xl font-bold text-white">Madurez Digital</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">¿Utilizan algún software de gestión (PMS)?</label>
                <input type="text" placeholder="Ej. Gesden, Nemotec..." className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-8 flex items-start gap-4">
                <div className="w-3 h-3 mt-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm text-emerald-200">El Motor de Atlas está listo para procesar los datos y generar el Reporte Ejecutivo.</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-slate-700/50 flex justify-between">
          <button 
            onClick={() => setStep(s => Math.max(1, s - 1))}
            className={`px-6 py-2 rounded-xl font-bold transition-colors ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <span className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> Atrás</span>
          </button>
          
          <button 
            onClick={handleNext}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-500 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {step === 3 ? 'Generar Diagnóstico' : 'Siguiente'}
            {step < 3 && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
}
