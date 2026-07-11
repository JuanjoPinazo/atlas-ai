"use client";

import React, { useState } from 'react';
import { VerticalFilter } from './_components/VerticalFilter';
import { PackGrid } from './_components/PackGrid';
import { PackPreviewModal } from './_components/PackPreviewModal';
import { InstallationProgress } from './_components/InstallationProgress';
import { useMarketplace } from './_components/useMarketplace';
import { KNOWLEDGE_PACKS } from '@/lib/data/knowledge-packs';

export default function MarketplacePage({ params }: { params: Promise<{ tenantId: string }> }) {
  // We need to unwrap params to pass tenantId to the hook, but for ease we can use `useParams` inside the hook.
  // Actually, we'll just handle tenantId inside a client component wrapper or fetch it here.
  const [tenantId, setTenantId] = useState<string>('');
  const [selectedVertical, setSelectedVertical] = useState('Todos');
  const [previewPackId, setPreviewPackId] = useState<string | null>(null);

  React.useEffect(() => {
    params.then(p => setTenantId(p.tenantId));
  }, [params]);

  const {
    isInstalling,
    installProgress,
    installStep,
    installPack
  } = useMarketplace(tenantId);

  const filteredPacks = selectedVertical === 'Todos' 
    ? KNOWLEDGE_PACKS 
    : KNOWLEDGE_PACKS.filter(p => p.vertical === selectedVertical);

  const previewPack = KNOWLEDGE_PACKS.find(p => p.id === previewPackId) || null;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8 relative">
      {isInstalling && (
        <InstallationProgress progress={installProgress} currentStep={installStep} />
      )}

      <PackPreviewModal 
        pack={previewPack} 
        onClose={() => setPreviewPackId(null)}
        onInstall={(pack) => {
          setPreviewPackId(null);
          installPack(pack);
        }}
      />

      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Atlas Marketplace
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Acelera tu integración instalando Knowledge Packs. Cada paquete preconfigura el Company Brain, Reglas de Decisión y Empleados Digitales para tu industria específica.
          </p>
        </div>

        <VerticalFilter 
          selectedVertical={selectedVertical}
          onSelect={setSelectedVertical}
        />

        <PackGrid 
          packs={filteredPacks}
          onSelectPack={(pack) => setPreviewPackId(pack.id)}
        />
      </div>
    </div>
  );
}
