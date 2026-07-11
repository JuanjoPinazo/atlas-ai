"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, MessageSquare } from 'lucide-react';
import { BusinessStudioState } from './useBusinessStudio';

export function LivePreview({ state }: { state: BusinessStudioState }) {
  
  // Simulate how the agent talks based on its tone
  const getSimulatedGreeting = () => {
    if (!state.companyName) return "Esperando configuración...";
    
    switch (state.agentTone.toLowerCase()) {
      case 'cercano':
      case 'amigable':
        return `¡Hola! Soy ${state.agentName}, tu ${state.agentRole.toLowerCase()} de ${state.companyName}. ¿En qué te puedo ayudar hoy? 😊`;
      case 'técnico':
      case 'experto':
        return `Saludos. Sistema inicializado. Soy ${state.agentName} (${state.agentRole}), preparado para asistir en consultas sobre ${state.companyName}. Protocolos listos.`;
      default:
        return `Hola, soy ${state.agentName}. Bienvenido a ${state.companyName}. Como tu ${state.agentRole.toLowerCase()}, estoy aquí para ayudarte de forma clara y eficiente.`;
    }
  };

  return (
    <div className="sticky top-8 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden min-h-[500px] flex flex-col">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-20"></div>

      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2 mb-8">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Live Preview
        </h3>

        {/* Agent Card */}
        <motion.div 
          layout
          className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center shadow-xl flex-1"
        >
          <motion.div 
            key={state.agentAvatar}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center text-4xl shadow-lg mb-4"
          >
            {state.agentAvatar || '🤖'}
          </motion.div>
          
          <h4 className="text-2xl font-bold text-white mb-1 tracking-tight">
            {state.agentName || 'Sin Nombre'}
          </h4>
          <p className="text-indigo-300 font-medium text-sm px-4 py-1 bg-indigo-500/20 rounded-full mb-6">
            {state.agentRole || 'Rol no definido'}
          </p>

          <div className="w-full bg-black/40 rounded-xl p-4 text-left relative">
            <div className="absolute -left-2 top-4 w-4 h-4 bg-black/40 rotate-45"></div>
            <p className="text-slate-300 text-sm leading-relaxed italic">
              "{getSimulatedGreeting()}"
            </p>
          </div>

          <div className="mt-auto w-full pt-6">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/5 rounded-lg p-2 text-left border border-white/5">
                <span className="block text-slate-500 mb-1">Tono</span>
                <span className="text-white font-medium">{state.agentTone || 'Estándar'}</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2 text-left border border-white/5">
                <span className="block text-slate-500 mb-1">Dominios</span>
                <span className="text-white font-medium">{state.domains.length} Activos</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
