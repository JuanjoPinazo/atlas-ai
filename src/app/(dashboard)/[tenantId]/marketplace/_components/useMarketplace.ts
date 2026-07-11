"use client";

import { useState } from 'react';
import { KnowledgePack } from '@/lib/data/knowledge-packs';
import { useRouter } from 'next/navigation';

export function useMarketplace(tenantId: string) {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<KnowledgePack | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [installStep, setInstallStep] = useState('');

  const installPack = async (pack: KnowledgePack) => {
    setIsInstalling(true);
    setInstallProgress(0);

    const steps = [
      { msg: 'Inicializando Company Brain...', delay: 1000 },
      { msg: 'Inyectando Business DNA...', delay: 2000 },
      { msg: 'Configurando Decision Rules...', delay: 3000 },
      { msg: 'Entrenando Empleado Digital...', delay: 4500 },
      { msg: 'Completado', delay: 5500 }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      await new Promise(resolve => setTimeout(resolve, step.delay - (i > 0 ? steps[i-1].delay : 0)));
      setInstallStep(step.msg);
      setInstallProgress(((i + 1) / steps.length) * 100);
    }

    // Mutate localStorage to simulate real database changes across the app
    try {
      // Set DNA state
      localStorage.setItem('atlas_business_dna_state', JSON.stringify({
        rules: pack.includes.dnaRules
      }));

      // Set Studio State
      localStorage.setItem('atlas_business_studio_state', JSON.stringify({
        companyName: pack.includes.companyName,
        agentName: pack.includes.agentName,
        agentRole: pack.includes.agentRole,
        welcomeMessage: 'Hola, ¿en qué puedo ayudarte hoy?',
        isComplete: true
      }));

      // Set conversational history reset (clear past chats if any, or keep them)
      localStorage.removeItem('atlas_conversations');
    } catch (e) {
      console.error(e);
    }

    setTimeout(() => {
      setIsInstalling(false);
      setSelectedPack(null);
      // Redirect to home to see the changes
      router.push(`/${tenantId}`);
    }, 1000);
  };

  return {
    selectedPack,
    setSelectedPack,
    isInstalling,
    installProgress,
    installStep,
    installPack
  };
}
