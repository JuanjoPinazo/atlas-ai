"use client";

import React, { useState } from 'react';
import { UserPlus, Sparkles, Database, Settings } from 'lucide-react';

export function WizardView() {
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-3xl mx-auto mt-10 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Step Indicator */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
        <div className="absolute top-1/2 left-0 right-1/2 h-1 bg-indigo-500 -translate-y-1/2 z-0 transition-all" style={{ width: `${((step - 1) / 3) * 100}%` }} />
        
        {[
          { id: 1, icon: UserPlus, label: 'Perfil' },
          { id: 2, icon: Sparkles, label: 'ADN' },
          { id: 3, icon: Database, label: 'Conocimiento' },
          { id: 4, icon: Settings, label: 'Permisos' }
        ].map(s => {
          const active = step >= s.id;
          const current = step === s.id;
          const Icon = s.icon;
          return (
            <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                active ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-500'
              } ${current ? 'ring-4 ring-indigo-500/30' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${active ? 'text-indigo-400' : 'text-slate-500'}`}>{s.label}</span>
            </div>
          )
        })}
      </div>

      {/* Form Content */}
      <div className="bg-slate-900/80 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-10 pointer-events-none" />

        {step === 1 && (
          <div className="space-y-6 relative z-10">
            <h3 className="text-xl font-bold text-white mb-4">Paso 1: Perfil y Rol</h3>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Nombre del Empleado Digital</label>
              <input type="text" placeholder="Ej. Dra. Aida" className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Misión Principal</label>
              <textarea placeholder="¿Cuál es su objetivo en la clínica?" rows={3} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
            </div>
          </div>
        )}

        {step > 1 && (
          <div className="flex items-center justify-center h-48 relative z-10 text-slate-400 text-center">
            <p>Sección simulada para fines de demostración.<br/>En producción aquí se conectaría con {step === 2 ? 'Business DNA' : step === 3 ? 'Knowledge Studio' : 'IAM'}.</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-800 relative z-10">
          <button 
            disabled={step === 1}
            onClick={() => setStep(s => s - 1)}
            className="px-6 py-2 rounded-xl text-slate-400 font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            Atrás
          </button>
          
          {step < 4 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Siguiente
            </button>
          ) : (
            <button className="bg-emerald-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20">
              Contratar Empleado
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
