"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, BrainCircuit, ShieldCheck, Component, Sparkles, Building2, Play } from 'lucide-react';
import { useBusinessStudio } from '../_components/useBusinessStudio';
import { useRouter, useParams } from 'next/navigation';

export default function BusinessStudioSuccessPage() {
  const { state, isLoaded } = useBusinessStudio();
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isLoaded || !mounted) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      
      {/* Confetti or glow effect behind */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 text-center"
      >
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
          Tu empresa ya está preparada.
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Hemos inicializado toda la infraestructura de IA para <strong>{state.companyName || 'tu empresa'}</strong> basándonos en tu configuración.
        </p>

        {/* Summary Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 text-left">
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <Building2 className="w-6 h-6 text-indigo-500 mb-2" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">1</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Tenant</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <BrainCircuit className="w-6 h-6 text-purple-500 mb-2" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">1</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Brain</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <Component className="w-6 h-6 text-cyan-500 mb-2" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{Math.max(1, state.domains.length)}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Dominios</span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-amber-500 mb-2" />
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{Math.max(1, state.policies.length)}</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Reglas</span>
          </div>
        </div>

        {/* Primary Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => alert('¡Próximamente! En el siguiente sprint conectaremos el chat/voz real.')}
          className="w-full relative group overflow-hidden bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg px-8 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all"
        >
          {/* Shine effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <Sparkles className="w-6 h-6" />
          Probar mi Empleado Digital
          <Play className="w-5 h-5 ml-2" />
        </motion.button>
        
        <button 
          onClick={() => router.push(`/${params.tenantId}/brain`)}
          className="mt-6 text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium underline underline-offset-4 transition-colors"
        >
          Ir al Cerebro de Empresa
        </button>

      </motion.div>
    </div>
  );
}
