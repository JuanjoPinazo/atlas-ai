"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BusinessStudioState } from '../useBusinessStudio';

interface StepProps {
  state: BusinessStudioState;
  updateState: (updates: Partial<BusinessStudioState>) => void;
  onNext: () => void;
  onPrev: () => void;
  isLast?: boolean;
}

const slideVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export function Step1Company({ state, updateState, onNext }: StepProps) {
  return (
    <motion.div 
      variants={slideVariants} initial="hidden" animate="visible" exit="exit"
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sobre tu Empresa</h2>
        <p className="text-slate-500">Comencemos con los detalles básicos para que Atlas empiece a conocerte.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre de la Empresa</label>
          <input 
            type="text" 
            value={state.companyName}
            onChange={e => updateState({ companyName: e.target.value })}
            placeholder="Ej. Acme Corp"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sector / Industria</label>
          <select 
            value={state.industry}
            onChange={e => updateState({ industry: e.target.value })}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Selecciona un sector...</option>
            <option value="ecommerce">E-commerce / Retail</option>
            <option value="saas">Software / SaaS</option>
            <option value="health">Salud / Medicina</option>
            <option value="legal">Servicios Legales</option>
            <option value="other">Otro</option>
          </select>
        </div>
      </div>

      <div className="pt-6 flex justify-end">
        <button 
          onClick={onNext}
          disabled={!state.companyName || !state.industry}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Continuar
        </button>
      </div>
    </motion.div>
  );
}

export function Step2Domains({ state, updateState, onNext, onPrev }: StepProps) {
  const availableDomains = ["Atención al Cliente", "Ventas", "Recursos Humanos", "Soporte IT", "Legal & Compliance"];
  
  const toggleDomain = (domain: string) => {
    if (state.domains.includes(domain)) {
      updateState({ domains: state.domains.filter(d => d !== domain) });
    } else {
      updateState({ domains: [...state.domains, domain] });
    }
  };

  return (
    <motion.div variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dominios de Conocimiento</h2>
        <p className="text-slate-500">¿Sobre qué áreas debería tener conocimiento profundo tu Empleado Digital?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableDomains.map(domain => {
          const isSelected = state.domains.includes(domain);
          return (
            <button
              key={domain}
              onClick={() => toggleDomain(domain)}
              className={`p-4 rounded-xl border text-left transition-all ${
                isSelected 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
              }`}
            >
              <div className={`font-semibold ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-300'}`}>
                {domain}
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-6 flex justify-between">
        <button onClick={onPrev} className="text-slate-600 dark:text-slate-400 font-medium px-6 py-3 hover:text-slate-900 dark:hover:text-white">Atrás</button>
        <button 
          onClick={onNext}
          disabled={state.domains.length === 0}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Continuar
        </button>
      </div>
    </motion.div>
  );
}

export function Step3Policies({ state, updateState, onNext, onPrev }: StepProps) {
  const availablePolicies = [
    { id: "pol_1", title: "Escalado Automático", desc: "Escalar a un humano si el sentimiento es negativo." },
    { id: "pol_2", title: "Estricta Privacidad", desc: "Bloquear peticiones que soliciten datos sensibles." },
    { id: "pol_3", title: "Verificación de Identidad", desc: "Exigir email/DNI antes de procesos críticos." }
  ];

  const togglePolicy = (id: string) => {
    if (state.policies.includes(id)) {
      updateState({ policies: state.policies.filter(p => p !== id) });
    } else {
      updateState({ policies: [...state.policies, id] });
    }
  };

  return (
    <motion.div variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Reglas de Decisión</h2>
        <p className="text-slate-500">Configura los límites (Decision Engine) para tu Empleado Digital.</p>
      </div>

      <div className="space-y-3">
        {availablePolicies.map(policy => {
          const isSelected = state.policies.includes(policy.id);
          return (
            <div key={policy.id} className="flex items-start gap-3 p-4 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <input 
                type="checkbox" 
                checked={isSelected}
                onChange={() => togglePolicy(policy.id)}
                className="mt-1 w-5 h-5 text-indigo-600 rounded border-slate-300"
              />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{policy.title}</p>
                <p className="text-sm text-slate-500">{policy.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-6 flex justify-between">
        <button onClick={onPrev} className="text-slate-600 dark:text-slate-400 font-medium px-6 py-3 hover:text-slate-900 dark:hover:text-white">Atrás</button>
        <button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-8 py-3 rounded-xl transition-colors">
          Continuar
        </button>
      </div>
    </motion.div>
  );
}

export function Step4Agent({ state, updateState, onNext, onPrev }: StepProps) {
  return (
    <motion.div variants={slideVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tu Empleado Digital</h2>
        <p className="text-slate-500">Dale personalidad. Mira a la derecha para ver cómo reacciona en tiempo real.</p>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre</label>
            <input 
              type="text" 
              value={state.agentName}
              onChange={e => updateState({ agentName: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Avatar</label>
            <input 
              type="text" 
              value={state.agentAvatar}
              onChange={e => updateState({ agentAvatar: e.target.value })}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-center text-xl focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Rol principal</label>
          <input 
            type="text" 
            value={state.agentRole}
            onChange={e => updateState({ agentRole: e.target.value })}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tono de Voz</label>
          <div className="grid grid-cols-3 gap-3">
            {['Profesional', 'Amigable', 'Técnico'].map(tone => (
              <button
                key={tone}
                onClick={() => updateState({ agentTone: tone })}
                className={`py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  state.agentTone === tone 
                    ? 'bg-indigo-100 dark:bg-indigo-900/40 border-indigo-500 text-indigo-700 dark:text-indigo-300' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 flex justify-between">
        <button onClick={onPrev} className="text-slate-600 dark:text-slate-400 font-medium px-6 py-3 hover:text-slate-900 dark:hover:text-white">Atrás</button>
        <button onClick={onNext} className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white font-medium px-8 py-3 rounded-xl transition-opacity shadow-lg shadow-indigo-500/30">
          Finalizar Configuración
        </button>
      </div>
    </motion.div>
  );
}
