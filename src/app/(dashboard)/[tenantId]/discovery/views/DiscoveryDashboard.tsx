"use client";

import React from 'react';
import { DiscoveryResult } from '@/lib/schemas/discovery';
import { MaturityRadar } from './MaturityRadar';
import { Printer, TrendingUp, Cpu, Briefcase, Zap } from 'lucide-react';
import { FrameworkHelp } from '../../framework/_components/FrameworkHelp';

interface Props {
  result: DiscoveryResult;
}

export function DiscoveryDashboard({ result }: Props) {

  const handlePrint = () => {
    window.print();
  };

  const helpData = {
    what: 'Reporte Ejecutivo de Auditoría',
    why: 'Para materializar la venta. Muestra de forma lógica y visual que el coste de Atlas es una inversión muy rentable.',
    value: 'Convierte problemas abstractos en un Plan de Implantación concreto con ROI.',
    sales: 'Repasa el Radar con ellos ("Aquí es donde estáis perdiendo pacientes"). Luego muéstrales el ROI Estimado: "Atlas os costará X, pero recuperará Y".',
    setup: 'Para exportar a PDF, pulsa el botón "Exportar PDF" que limpiará la UI e invocará la función de impresión nativa del navegador.',
    roi: 'El corazón del módulo Discovery. El cierre de la venta ocurre en esta pantalla.'
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 print:mt-0 animate-in fade-in slide-in-from-bottom-4">
      
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Propuesta Ejecutiva</h2>
          <p className="text-slate-400">Auditoría completada para {result.clinic_name}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={handlePrint} className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-xl font-bold hover:bg-slate-700 transition-colors">
            <Printer className="w-4 h-4" /> Exportar PDF
          </button>
          <FrameworkHelp data={helpData} />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none">
        
        {/* Header Print */}
        <div className="hidden print:block mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-4xl font-extrabold text-black">Atlas AI - Propuesta Ejecutiva</h1>
          <p className="text-gray-600 text-xl">Preparado para: {result.clinic_name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Col 1: Radar & Scores */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-white print:text-black mb-6">Estado de Madurez</h3>
              <MaturityRadar dimensions={result.dimensions} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 print:bg-gray-100 rounded-xl p-4 border border-slate-700 print:border-gray-200">
                <span className="text-xs text-slate-400 print:text-gray-500 uppercase font-bold tracking-widest block mb-2">Health Score</span>
                <span className="text-3xl font-bold text-indigo-400 print:text-indigo-600">{result.health_score}/100</span>
              </div>
              <div className="bg-emerald-500/10 print:bg-emerald-50 rounded-xl p-4 border border-emerald-500/30 print:border-emerald-200">
                <span className="text-xs text-emerald-400 print:text-emerald-600 uppercase font-bold tracking-widest block mb-2">Opportunity Score</span>
                <span className="text-3xl font-bold text-emerald-400 print:text-emerald-600">{result.opportunity_score}/100</span>
              </div>
            </div>
          </div>

          {/* Col 2: The Solution & ROI */}
          <div className="space-y-8">
            
            <div>
              <h3 className="text-xl font-bold text-white print:text-black flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-indigo-400" /> Solución Recomendada
              </h3>
              <div className="space-y-4">
                <div className="bg-slate-800/50 print:bg-gray-100 rounded-xl p-4 border border-slate-700 print:border-gray-200">
                  <h4 className="text-sm font-bold text-slate-300 print:text-gray-700 mb-2">Plantilla Digital (Agentes)</h4>
                  <ul className="space-y-2">
                    {result.recommended_employees.map(emp => (
                      <li key={emp.id} className="flex justify-between items-center text-sm">
                        <span className="text-white print:text-black font-bold">{emp.name}</span>
                        <span className="text-slate-400 print:text-gray-600">{emp.role}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-800/50 print:bg-gray-100 rounded-xl p-4 border border-slate-700 print:border-gray-200">
                  <h4 className="text-sm font-bold text-slate-300 print:text-gray-700 mb-2">Knowledge Packs</h4>
                  <ul className="text-sm text-slate-400 print:text-gray-600 space-y-1">
                    {result.recommended_packs.map((pack, i) => <li key={i}>• {pack}</li>)}
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white print:text-black flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-emerald-400" /> Business Value (Impacto Económico)
              </h3>
              <div className="space-y-3 mb-6">
                {result.business_value_opportunities.map((opp, i) => (
                  <div key={i} className="flex justify-between items-center text-sm border-b border-slate-800 print:border-gray-200 pb-2">
                    <span className="text-slate-300 print:text-gray-700">{opp.title}</span>
                    <span className="text-emerald-400 font-bold">+€{opp.roi_estimate.toLocaleString()}/mes</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 print:bg-gray-100 border border-emerald-500/30 print:border-gray-300 rounded-2xl p-6 flex justify-between items-center">
                <div>
                  <span className="block text-sm text-slate-400 print:text-gray-600 font-bold mb-1">ROI Proyectado</span>
                  <span className="text-4xl font-extrabold text-white print:text-black">€{(result.total_roi_estimate * 12).toLocaleString()} <span className="text-lg text-slate-400 font-normal">/año</span></span>
                </div>
                <Zap className="w-12 h-12 text-emerald-400 opacity-50" />
              </div>
            </div>

          </div>
        </div>

        {/* Implementation Plan */}
        <div className="mt-12 pt-12 border-t border-slate-800 print:border-gray-200">
          <h3 className="text-xl font-bold text-white print:text-black flex items-center gap-2 mb-6">
            <Briefcase className="w-5 h-5 text-indigo-400" /> Plan de Implantación
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.implementation_plan.map((phase, i) => (
              <div key={i} className="bg-slate-800/30 print:bg-white rounded-xl p-4 border border-slate-700 print:border-gray-300">
                <span className="text-indigo-400 print:text-indigo-600 font-bold text-sm block mb-1">{phase.phase}</span>
                <p className="text-white print:text-black font-bold mb-2">{phase.description}</p>
                <span className="text-xs text-slate-500 print:text-gray-500">{phase.weeks} semanas</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Print styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          .print\\:block { visibility: visible; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:text-black { color: black !important; }
          .print\\:border-none { border: none !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:border-gray-200 { border-color: #e5e7eb !important; }
          .print\\:text-gray-500 { color: #6b7280 !important; }
          .print\\:text-gray-600 { color: #4b5563 !important; }
          .print\\:text-gray-700 { color: #374151 !important; }
          .print\\:text-indigo-600 { color: #4f46e5 !important; }
          .print\\:text-emerald-600 { color: #059669 !important; }
          .print\\:bg-gray-100 { background-color: #f3f4f6 !important; }
          .print\\:bg-emerald-50 { background-color: #ecfdf5 !important; }
          .max-w-6xl { max-width: 100% !important; margin: 0 !important; padding: 0 !important; }
          .max-w-6xl > div:nth-child(2) { visibility: visible; position: absolute; left: 0; top: 0; width: 100%; }
          .max-w-6xl > div:nth-child(2) * { visibility: visible; }
        }
      `}} />
    </div>
  );
}
