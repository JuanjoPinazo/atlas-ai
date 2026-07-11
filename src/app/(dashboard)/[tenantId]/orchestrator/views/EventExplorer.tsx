"use client";

import React, { useState } from 'react';
import { AtlasEvent } from '@/lib/schemas/orchestrator';
import { Activity, Clock } from 'lucide-react';
import { EventInspector } from './EventInspector';

interface Props {
  events: AtlasEvent[];
}

export function EventExplorer({ events }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<AtlasEvent | null>(events[0] || null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px] animate-in fade-in slide-in-from-bottom-4">
      
      {/* Event Timeline (Left Column) */}
      <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-6 text-white border-b border-slate-800 pb-4">
          <Activity className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-lg">Event Timeline (Live)</h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2">
          {events.map(evt => (
            <div 
              key={evt.id} 
              onClick={() => setSelectedEvent(evt)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedEvent?.id === evt.id 
                  ? 'bg-indigo-600/20 border-indigo-500' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-300">{evt.type}</span>
                  {evt.source === 'Real_EventBus' && (
                    <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-emerald-500/30">
                      Real Data
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {new Date(evt.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Source: {evt.source}</span>
                <span className="bg-slate-900 px-2 py-1 rounded text-emerald-400 font-mono">{evt.processing_time_ms}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Inspector (Right Column) */}
      <div className="h-full">
        <EventInspector event={selectedEvent} />
      </div>

    </div>
  );
}
