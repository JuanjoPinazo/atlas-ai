"use client";

import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

export function EventFlowVisualizer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const simulateFlow = () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Step 1: Incoming Event (0ms)
    setActiveNode('source');
    
    // Step 2: Context Engine (800ms)
    setTimeout(() => setActiveNode('context'), 800);
    
    // Step 3: Decision Engine (1600ms)
    setTimeout(() => setActiveNode('decision'), 1600);
    
    // Step 4: Digital Agent (2400ms)
    setTimeout(() => setActiveNode('agent'), 2400);
    
    // Step 5: ROI Engine (3200ms)
    setTimeout(() => setActiveNode('roi'), 3200);
    
    // Reset (4000ms)
    setTimeout(() => {
      setActiveNode(null);
      setIsPlaying(false);
    }, 4500);
  };

  const getNodeClass = (node: string) => {
    return activeNode === node 
      ? 'border-indigo-500 bg-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.5)]' 
      : 'border-slate-700 bg-slate-800/50';
  };

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col items-center">
      
      <div className="flex justify-between w-full mb-8">
        <div>
          <h3 className="text-2xl font-bold text-white">Event Flow Visualizer</h3>
          <p className="text-slate-400 text-sm">Observe cómo un solo evento dispara el enjambre de Inteligencia Artificial.</p>
        </div>
        <button 
          onClick={simulateFlow} 
          disabled={isPlaying}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2"
        >
          <Play className="w-4 h-4" /> Simular Evento
        </button>
      </div>

      {/* SVG Canvas for lines */}
      <div className="relative w-full max-w-4xl h-[400px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {/* Main Bus Line */}
          <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#334155" strokeWidth="4" strokeDasharray="8 8" />
          
          {/* If playing, animate the main pulse */}
          {isPlaying && (
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#6366f1" strokeWidth="4" strokeLinecap="round">
              <animate attributeName="stroke-dasharray" values="0, 1000; 1000, 0" dur="4s" fill="freeze" />
            </line>
          )}
          
          {/* Connecting lines */}
          <path d="M 30% 50% L 30% 25%" stroke="#334155" strokeWidth="2" />
          <path d="M 50% 50% L 50% 75%" stroke="#334155" strokeWidth="2" />
          <path d="M 70% 50% L 70% 25%" stroke="#334155" strokeWidth="2" />
          <path d="M 90% 50% L 90% 75%" stroke="#334155" strokeWidth="2" />
        </svg>

        {/* Nodes */}
        {/* Source Node */}
        <div className={`absolute top-1/2 left-[10%] -translate-x-1/2 -translate-y-1/2 w-32 p-3 rounded-xl border-2 transition-all duration-300 text-center z-10 ${getNodeClass('source')}`}>
          <span className="text-xs font-bold text-white block">PMS</span>
          <span className="text-[10px] text-slate-400">Cancelación Cita</span>
        </div>

        {/* Context Engine */}
        <div className={`absolute top-[25%] left-[30%] -translate-x-1/2 -translate-y-1/2 w-40 p-3 rounded-xl border-2 transition-all duration-300 text-center z-10 ${getNodeClass('context')}`}>
          <span className="text-sm font-bold text-indigo-400 block">Context Engine</span>
          <span className="text-[10px] text-slate-400">Enriqueciendo datos...</span>
        </div>

        {/* Decision Engine */}
        <div className={`absolute top-[75%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-40 p-3 rounded-xl border-2 transition-all duration-300 text-center z-10 ${getNodeClass('decision')}`}>
          <span className="text-sm font-bold text-purple-400 block">Decision Engine</span>
          <span className="text-[10px] text-slate-400">Aplicando Business DNA</span>
        </div>

        {/* Digital Agent */}
        <div className={`absolute top-[25%] left-[70%] -translate-x-1/2 -translate-y-1/2 w-40 p-3 rounded-xl border-2 transition-all duration-300 text-center z-10 ${getNodeClass('agent')}`}>
          <span className="text-sm font-bold text-emerald-400 block">Dra. Aida (IA)</span>
          <span className="text-[10px] text-slate-400">Ejecutando rescate</span>
        </div>

        {/* ROI Engine */}
        <div className={`absolute top-[75%] left-[90%] -translate-x-1/2 -translate-y-1/2 w-40 p-3 rounded-xl border-2 transition-all duration-300 text-center z-10 ${getNodeClass('roi')}`}>
          <span className="text-sm font-bold text-amber-400 block">ROI Engine</span>
          <span className="text-[10px] text-slate-400">Registrando Valor</span>
        </div>

      </div>

    </div>
  );
}
