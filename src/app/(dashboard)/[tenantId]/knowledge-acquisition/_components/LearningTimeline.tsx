"use client";

import React from 'react';
import { TimelineEvent } from './useKnowledgeAcquisition';
import { Activity, BrainCircuit } from 'lucide-react';

interface Props {
  events: TimelineEvent[];
}

export function LearningTimeline({ events }: Props) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 flex items-center justify-center">
          <BrainCircuit className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">Learning Timeline</h3>
          <p className="text-xs text-slate-500 font-medium">Historial de asimilación del cerebro</p>
        </div>
      </div>
      
      <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 space-y-8 flex-1 overflow-y-auto custom-scrollbar pr-2">
        {events.map((event, index) => (
          <div key={event.id} className="relative pl-6">
            <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${
              index === 0 ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'
            }`}></div>
            
            <div>
              <div className="flex flex-col mb-1">
                <span className={`font-bold ${index === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                  {event.title}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
                  {event.date.toLocaleDateString()} {event.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                {event.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
