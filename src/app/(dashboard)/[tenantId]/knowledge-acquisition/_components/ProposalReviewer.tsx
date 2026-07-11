"use client";

import React, { useState } from 'react';
import { Proposal } from './useKnowledgeAcquisition';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, GitMerge, FileDiff, ArrowRight } from 'lucide-react';

interface Props {
  proposals: Proposal[];
  onAction: (id: string, action: 'accepted' | 'rejected' | 'merged') => void;
}

export function ProposalReviewer({ proposals, onAction }: Props) {
  const pendingProposals = proposals.filter(p => p.status === 'pending');

  if (pendingProposals.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h3 className="font-bold text-xl text-slate-900 dark:text-white">Propuestas de Aprendizaje</h3>
        <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400 py-0.5 px-2.5 rounded-full text-xs font-bold">
          {pendingProposals.length} Pendientes
        </span>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {pendingProposals.map((proposal) => (
            <motion.div 
              key={proposal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2 text-sm">
                  <FileDiff className="w-4 h-4 text-slate-500" />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Fuente: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{proposal.source}</span></span>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">
                  {proposal.type === 'addition' ? 'Nueva Unidad' : 'Modificación'}
                </div>
              </div>

              {/* Diff Viewer */}
              <div className="p-0 flex flex-col md:flex-row">
                {proposal.oldText && (
                  <div className="flex-1 p-6 bg-red-50/30 dark:bg-red-900/5 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-3">Conocimiento Anterior</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 line-through decoration-red-400/50 leading-relaxed">
                      {proposal.oldText}
                    </p>
                  </div>
                )}
                
                <div className={`flex-1 p-6 bg-green-50/30 dark:bg-green-900/5 ${!proposal.oldText ? 'md:col-span-2' : ''}`}>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3">
                    {proposal.oldText ? 'Nuevo Conocimiento Propuesto' : 'Conocimiento Extraído'}
                  </p>
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    {proposal.newText}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                <button 
                  onClick={() => onAction(proposal.id, 'rejected')}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Rechazar
                </button>
                
                {proposal.oldText && (
                  <button 
                    onClick={() => onAction(proposal.id, 'merged')}
                    className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 rounded-xl shadow-sm transition-colors flex items-center gap-2"
                  >
                    <GitMerge className="w-4 h-4 text-purple-500" /> Fusionar
                  </button>
                )}

                <button 
                  onClick={() => onAction(proposal.id, 'accepted')}
                  className="px-6 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Aceptar
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
