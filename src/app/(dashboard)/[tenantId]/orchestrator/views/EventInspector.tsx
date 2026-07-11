"use client";

import React from 'react';
import { AtlasEvent } from '@/lib/schemas/orchestrator';
import { Code2, Hash } from 'lucide-react';

interface Props {
  event: AtlasEvent | null;
}

export function EventInspector({ event }: Props) {
  if (!event) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 h-full flex items-center justify-center text-slate-500">
        Selecciona un evento para inspeccionar el payload.
      </div>
    );
  }

  return (
    <div className="bg-[#0D1117] border border-slate-700/50 rounded-3xl p-6 h-full flex flex-col font-mono shadow-2xl relative overflow-hidden">
      
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

      <div className="flex items-center gap-2 mb-6 text-slate-300 border-b border-slate-800 pb-4">
        <Code2 className="w-5 h-5 text-indigo-400" />
        <h3 className="font-bold text-sm tracking-widest">Event Inspector</h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 border-b border-slate-800 pb-6">
        <div>
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Event ID</span>
          <span className="text-xs text-white flex items-center gap-1">
            <Hash className="w-3 h-3 text-indigo-400" /> {event.id}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-500 uppercase block mb-1">Status</span>
          <span className="text-xs text-emerald-400">{event.status}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase block mb-2">Payload (JSON)</span>
        <pre className="text-xs text-green-400 whitespace-pre-wrap">
          {JSON.stringify(event.payload, null, 2)}
        </pre>
      </div>

    </div>
  );
}
