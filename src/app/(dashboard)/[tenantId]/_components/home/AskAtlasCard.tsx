"use client";

import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AskAtlasCard() {
  const [query, setQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSubmitting(true);
    // Simulate thinking delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowComingSoon(true);
      setTimeout(() => setShowComingSoon(false), 3000);
      setQuery('');
    }, 1500);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-black rounded-3xl p-6 border border-slate-800 shadow-xl relative overflow-hidden group">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-48 h-48 bg-indigo-500 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity"></div>
      
      <div className="relative z-10">
        <h3 className="text-white font-bold text-lg flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Pregunta a Atlas
        </h3>
        <p className="text-indigo-200/60 text-sm mb-6">
          Consulta cualquier dato de tu empresa. Conectado al Company Brain.
        </p>

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: ¿Cuántos clientes pidieron devoluciones ayer?"
            className="w-full bg-black/40 text-white placeholder-slate-500 border border-slate-700/50 rounded-2xl p-4 pr-12 resize-none h-24 outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
          />
          <button 
            type="submit"
            disabled={!query.trim() || isSubmitting}
            className="absolute bottom-3 right-3 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg flex items-center justify-center transition-colors"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>

        <AnimatePresence>
          {showComingSoon && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 text-xs p-3 rounded-xl text-center"
            >
              ¡Interacción real en el próximo Sprint!
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
