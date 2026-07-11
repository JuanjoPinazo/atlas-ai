"use client";

import React from 'react';
import { DragDropZone } from './_components/DragDropZone';
import { ExtractionPipeline } from './_components/ExtractionPipeline';
import { ProposalReviewer } from './_components/ProposalReviewer';
import { LearningTimeline } from './_components/LearningTimeline';
import { useKnowledgeAcquisition } from './_components/useKnowledgeAcquisition';

export default function KnowledgeAcquisitionPage() {
  const { 
    pipelineStatus, 
    progress, 
    proposals, 
    timeline, 
    simulateUpload, 
    handleProposalAction 
  } = useKnowledgeAcquisition();

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            Knowledge Studio
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Alimenta el Company Brain. Sube documentos para que Atlas extraiga y asimile nuevo conocimiento de forma segura.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Left Column (70%) */}
          <div className="xl:col-span-8 flex flex-col gap-8">
            <DragDropZone 
              onDrop={simulateUpload} 
              status={pipelineStatus} 
            />
            
            <ExtractionPipeline 
              status={pipelineStatus} 
              progress={progress} 
            />
            
            <ProposalReviewer 
              proposals={proposals} 
              onAction={handleProposalAction} 
            />
          </div>

          {/* Right Sidebar (30%) */}
          <div className="xl:col-span-4 h-full min-h-[500px]">
            <LearningTimeline events={timeline} />
          </div>
          
        </div>
      </div>
    </div>
  );
}
