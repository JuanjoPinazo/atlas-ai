"use client";

import React from 'react';
import { KnowledgePack } from '@/lib/data/knowledge-packs';
import { X, Dna, BrainCircuit, Bot, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';

interface Props {
  pack: KnowledgePack | null;
  onClose: () => void;
  onInstall: (pack: KnowledgePack) => void;
}

export function PackPreviewModal({ pack, onClose, onInstall }: Props) {
  if (!pack) return null;

  const colorMap: Record<string, { bgGroup: string, btn: string, text: string }> = {
    emerald: { bgGroup: 'bg-gradient-to-r from-emerald-600 to-emerald-800', btn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25', text: 'text-emerald-500' },
    slate: { bgGroup: 'bg-gradient-to-r from-slate-600 to-slate-800', btn: 'bg-slate-600 hover:bg-slate-500 shadow-slate-500/25', text: 'text-slate-500' },
    indigo: { bgGroup: 'bg-gradient-to-r from-indigo-600 to-indigo-800', btn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25', text: 'text-indigo-500' },
  };

  // @ts-ignore
  const Icon = Icons[pack.icon] || Icons.Box;
  const colors = colorMap[pack.color] || colorMap.indigo;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className={`${colors.bgGroup} p-8 relative flex-shrink-0`}>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 text-white shadow-lg">
                <Icon className="w-10 h-10" />
              </div>
              <div className="text-white">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block border border-white/10">
                  {pack.vertical}
                </span>
                <h2 className="text-3xl font-extrabold mb-2">{pack.name}</h2>
                <p className="text-white/80 max-w-lg leading-relaxed text-sm">{pack.description}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-950 flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Contenido del Knowledge Pack</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
                <Dna className={`w-6 h-6 ${colors.text} mb-3`} />
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{pack.metrics.rules}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Reglas de ADN</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
                <BrainCircuit className={`w-6 h-6 ${colors.text} mb-3`} />
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{pack.metrics.documents}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Documentos Base</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl">
                <Bot className={`w-6 h-6 ${colors.text} mb-3`} />
                <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{pack.metrics.agents}</p>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Empleados Digitales</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-indigo-500" />
                Ejemplo de Reglas Incluidas
              </h4>
              <ul className="space-y-3">
                {pack.includes.dnaRules.slice(0, 3).map((rule, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${rule.category === 'limit' ? 'bg-red-400' : 'bg-indigo-400'}`} />
                    {rule.content}
                  </li>
                ))}
                {pack.includes.dnaRules.length > 3 && (
                  <li className="text-xs text-center text-slate-400 font-medium italic mt-2">
                    + {pack.includes.dnaRules.length - 3} reglas más...
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-4 flex-shrink-0">
            <button 
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => onInstall(pack)}
              className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 ${colors.btn}`}
            >
              Instalar Pack
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
