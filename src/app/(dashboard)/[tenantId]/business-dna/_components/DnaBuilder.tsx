"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Tag, ShieldAlert, Zap, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { useBusinessDNA, DNARule } from './useBusinessDNA';
import { motion, AnimatePresence } from 'framer-motion';

export function DnaBuilder() {
  const { state, updateState, addRule, removeRule, toggleRule } = useBusinessDNA();
  const [activeTab, setActiveTab] = useState<'value' | 'priority' | 'limit' | 'exception'>('limit');
  const [newRuleContent, setNewRuleContent] = useState('');

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleContent.trim()) return;
    addRule({ category: activeTab, content: newRuleContent, active: true });
    setNewRuleContent('');
  };

  const getIconForCategory = (cat: string) => {
    switch(cat) {
      case 'value': return <Tag className="w-4 h-4" />;
      case 'priority': return <Zap className="w-4 h-4" />;
      case 'limit': return <ShieldAlert className="w-4 h-4" />;
      case 'exception': return <AlertOctagon className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  const getTitleForCategory = (cat: string) => {
    switch(cat) {
      case 'value': return 'Valores Corporativos';
      case 'priority': return 'Prioridades';
      case 'limit': return 'Límites Estrictos';
      case 'exception': return 'Excepciones Permitidas';
      default: return 'Reglas';
    }
  };

  const getBadgeColor = (cat: string) => {
    switch(cat) {
      case 'value': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'priority': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'limit': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'exception': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[700px]">
      
      {/* Header */}
      <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">Constructor de ADN</h2>
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {(['limit', 'exception', 'priority', 'value'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab 
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {getIconForCategory(tab)}
              <span className="capitalize">{tab}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-6 md:p-8 overflow-hidden bg-slate-50 dark:bg-slate-950/50">
        
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{getTitleForCategory(activeTab)}</h3>
          <p className="text-sm text-slate-500">
            {activeTab === 'limit' && 'Define restricciones claras que el Agente no puede saltarse.'}
            {activeTab === 'exception' && 'Escenarios específicos donde los límites pueden ser ignorados.'}
            {activeTab === 'priority' && 'Cuando hay conflicto de objetivos, ¿qué importa más?'}
            {activeTab === 'value' && 'Principios inmutables que deben reflejarse en cada respuesta.'}
          </p>
        </div>

        {/* Rule List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          <AnimatePresence>
            {state.rules.filter(r => r.category === activeTab).map(rule => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-4 rounded-xl border flex items-start gap-4 transition-colors ${
                  rule.active 
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800' 
                    : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60 grayscale'
                }`}
              >
                <button 
                  onClick={() => toggleRule(rule.id)}
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                    rule.active ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {rule.active && <CheckCircle2 className="w-3 h-3" />}
                </button>
                <div className="flex-1">
                  <p className={`text-sm ${rule.active ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 line-through'}`}>
                    {rule.content}
                  </p>
                </div>
                <button 
                  onClick={() => removeRule(rule.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {state.rules.filter(r => r.category === activeTab).length === 0 && (
            <div className="text-center py-10 text-slate-500 text-sm italic">
              No hay elementos configurados en esta categoría.
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddRule} className="mt-6">
          <div className="relative">
            <input 
              type="text"
              value={newRuleContent}
              onChange={(e) => setNewRuleContent(e.target.value)}
              placeholder={`Añadir nuevo ${activeTab}...`}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-12 py-4 outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <button 
              type="submit"
              disabled={!newRuleContent.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
