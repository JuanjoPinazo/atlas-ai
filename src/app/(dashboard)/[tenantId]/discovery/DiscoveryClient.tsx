"use client";

import React, { useState } from 'react';
import { DiscoveryWizard } from './views/DiscoveryWizard';
import { DiscoveryDashboard } from './views/DiscoveryDashboard';
import { DiscoveryResult } from '@/lib/schemas/discovery';
import { processDiscoveryForm } from '@/app/actions/discovery';

export function DiscoveryClient() {
  const [result, setResult] = useState<DiscoveryResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWizardComplete = async (data: any) => {
    setIsProcessing(true);
    // Simulate thinking time to impress the client
    await new Promise(r => setTimeout(r, 1500));
    
    const response = await processDiscoveryForm(data);
    if (response.success && response.data) {
      setResult(response.data);
    }
    setIsProcessing(false);
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

  return (
    <div className="min-h-full bg-slate-950 p-4 md:p-8 relative overflow-x-hidden">
      {/* Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none print:hidden" />

      <div className="relative z-10 w-full">
        {!result ? (
          <DiscoveryWizard onComplete={handleWizardComplete} />
        ) : (
          <DiscoveryDashboard result={result} />
        )}
      </div>
    </div>
  );
}
