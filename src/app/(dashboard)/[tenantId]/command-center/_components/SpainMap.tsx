"use client";

import React from 'react';
import { MapPin } from 'lucide-react';

export function SpainMap() {
  // Mock coordinates relative to a container for a stylized map of Spain
  const nodes = [
    { id: 1, name: 'Madrid', top: '45%', left: '45%', active: true, size: 'w-4 h-4' },
    { id: 2, name: 'Barcelona', top: '25%', left: '80%', active: true, size: 'w-5 h-5' },
    { id: 3, name: 'Valencia', top: '50%', left: '70%', active: true, size: 'w-3 h-3' },
    { id: 4, name: 'Sevilla', top: '75%', left: '30%', active: false, size: 'w-4 h-4' },
    { id: 5, name: 'Bilbao', top: '15%', left: '45%', active: true, size: 'w-3 h-3' },
  ];

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 h-full flex flex-col relative overflow-hidden">
      <h3 className="text-xl font-bold text-white mb-2">Monitorización Geográfica</h3>
      <p className="text-sm text-slate-400">Latencia y estado de Nodos (Región EU-West)</p>
      
      <div className="flex-1 relative mt-4 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden">
        {/* Radar effect */}
        <div className="absolute w-[400px] h-[400px] rounded-full border border-indigo-500/20" />
        <div className="absolute w-[250px] h-[250px] rounded-full border border-indigo-500/30" />
        <div className="absolute w-[100px] h-[100px] rounded-full border border-indigo-500/40" />

        {/* Nodes */}
        {nodes.map(node => (
          <div 
            key={node.id} 
            className="absolute group cursor-pointer"
            style={{ top: node.top, left: node.left }}
          >
            <div className={`relative ${node.size}`}>
              {node.active && (
                <div className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                  node.id === 4 ? 'bg-red-500' : 'bg-emerald-500'
                }`} />
              )}
              <div className={`relative w-full h-full rounded-full border-2 border-slate-900 ${
                node.active ? 'bg-emerald-500' : 'bg-red-500'
              }`} />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {node.name}
              <div className="text-[10px] text-slate-400 font-normal">Ping: {Math.floor(Math.random() * 30 + 10)}ms</div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-4 left-4 flex gap-4 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Operativo</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500" /> Degradado</div>
        </div>
      </div>
    </div>
  );
}
