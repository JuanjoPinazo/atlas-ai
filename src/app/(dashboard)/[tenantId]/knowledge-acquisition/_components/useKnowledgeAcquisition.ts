"use client";

import { useState } from 'react';

export type PipelineStatus = 'idle' | 'uploading' | 'ocr' | 'chunking' | 'proposing' | 'done';

export interface Proposal {
  id: string;
  source: string;
  oldText: string | null;
  newText: string;
  type: 'addition' | 'modification';
  status: 'pending' | 'accepted' | 'rejected' | 'merged';
}

export interface TimelineEvent {
  id: string;
  date: Date;
  title: string;
  description: string;
}

export function useKnowledgeAcquisition() {
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([
    {
      id: '1',
      date: new Date(Date.now() - 86400000), // Yesterday
      title: 'Creación del Cerebro',
      description: 'El Company Brain fue inicializado a través del Business Studio.',
    }
  ]);

  const simulateUpload = (fileName: string) => {
    setPipelineStatus('uploading');
    setProgress(0);
    setProposals([]);

    const steps = [
      { status: 'ocr', progress: 25, delay: 1500 },
      { status: 'chunking', progress: 60, delay: 3000 },
      { status: 'proposing', progress: 90, delay: 4500 },
      { status: 'done', progress: 100, delay: 6000 },
    ] as const;

    steps.forEach(({ status, progress: p, delay }) => {
      setTimeout(() => {
        setPipelineStatus(status);
        setProgress(p);

        if (status === 'done') {
          // Generate mock proposals when done
          setProposals([
            {
              id: 'p1',
              source: fileName,
              oldText: null,
              newText: 'Nuestra política de devoluciones premium ahora incluye envíos gratuitos en los primeros 30 días para todos los clientes VIP.',
              type: 'addition',
              status: 'pending'
            },
            {
              id: 'p2',
              source: fileName,
              oldText: 'El horario de soporte técnico es de Lunes a Viernes de 9:00 a 18:00.',
              newText: 'El horario de soporte técnico es 24/7 mediante el Empleado Digital, y de Lunes a Sábado de 8:00 a 20:00 para atención humana.',
              type: 'modification',
              status: 'pending'
            }
          ]);
        }
      }, delay);
    });
  };

  const handleProposalAction = (id: string, action: 'accepted' | 'rejected' | 'merged') => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, status: action } : p));
    
    const prop = proposals.find(p => p.id === id);
    if (prop && action === 'accepted') {
      setTimeline(prev => [{
        id: Math.random().toString(),
        date: new Date(),
        title: 'Conocimiento Integrado',
        description: `Se asimiló una nueva regla de ${prop.source}.`
      }, ...prev]);
    }
  };

  return {
    pipelineStatus,
    progress,
    proposals,
    timeline,
    simulateUpload,
    handleProposalAction
  };
}
