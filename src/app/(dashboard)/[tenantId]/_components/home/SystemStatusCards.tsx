"use client";

import React, { useEffect, useState } from 'react';
import { Dna, BrainCircuit, Bot } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

export function SystemStatusCards() {
  const router = useRouter();
  const params = useParams();

  const [dnaRulesCount, setDnaRulesCount] = useState(0);
  const [agentName, setAgentName] = useState('Atlas Bot');

  useEffect(() => {
    try {
      const dnaState = localStorage.getItem('atlas_business_dna_state');
      if (dnaState) {
        const parsed = JSON.parse(dnaState);
        if (parsed.rules) {
          setDnaRulesCount(parsed.rules.filter((r: any) => r.active).length);
        }
      } else {
        setDnaRulesCount(4); // Default mock
      }

      const studioState = localStorage.getItem('atlas_business_studio_state');
      if (studioState) {
        const parsed = JSON.parse(studioState);
        if (parsed.agentName) setAgentName(parsed.agentName);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {/* Business DNA */}
      <div 
        onClick={() => router.push(`/${params.tenantId}/business-dna`)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group"
      >
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
          <Dna className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-0.5">Business DNA</p>
          <p className="font-bold text-slate-900 dark:text-white">{dnaRulesCount} Reglas Activas</p>
        </div>
      </div>

      {/* Company Brain */}
      <div 
        onClick={() => router.push(`/${params.tenantId}/brain`)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-purple-300 dark:hover:border-purple-700 transition-colors group"
      >
        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-0.5">Company Brain</p>
          <p className="font-bold text-slate-900 dark:text-white">1,240 Unidades Indexadas</p>
        </div>
      </div>

      {/* Digital Employees */}
      <div 
        onClick={() => router.push(`/${params.tenantId}/business-studio`)}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm flex items-center gap-4 cursor-pointer hover:border-cyan-300 dark:hover:border-cyan-700 transition-colors group"
      >
        <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-500 group-hover:scale-110 transition-transform">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mb-0.5">Empleados Digitales</p>
          <p className="font-bold text-slate-900 dark:text-white">1 Activo ({agentName})</p>
        </div>
      </div>
    </div>
  );
}
