"use client";

import React, { useState } from 'react';
import { HelpCircle, X, Lightbulb, Target, TrendingUp, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpData {
  what: string;
  why: string;
  value: string;
  sales: string;
  setup: string;
  roi: string;
}

interface Props {
  data: HelpData;
}

export function FrameworkHelp({ data }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 text-white transition-all shadow-lg shadow-white/5"
      >
        <HelpCircle className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Lightbulb className="text-amber-400 w-6 h-6" />
                  Guía de Inteligencia Comercial
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-wider flex items-center gap-2">¿Qué hace?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.what}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-400 mb-2 uppercase tracking-wider flex items-center gap-2">¿Por qué existe?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.why}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider flex items-center gap-2"><Target className="w-4 h-4"/> ¿Qué valor aporta?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.value}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <h4 className="text-sm font-bold text-amber-400 mb-2 uppercase tracking-wider flex items-center gap-2">¿Cómo venderlo?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed italic">"{data.sales}"</p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
                    <h4 className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-wider flex items-center gap-2"><TrendingUp className="w-4 h-4"/> ¿Qué ROI genera?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.roi}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2"><Settings className="w-4 h-4"/> ¿Cómo configurarlo?</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">{data.setup}</p>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
