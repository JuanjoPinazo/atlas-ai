"use client";

import React from 'react';
import { VERTICALS } from '@/lib/data/knowledge-packs';

interface Props {
  selectedVertical: string;
  onSelect: (vertical: string) => void;
}

export function VerticalFilter({ selectedVertical, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {VERTICALS.map(vertical => (
        <button
          key={vertical}
          onClick={() => onSelect(vertical)}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
            selectedVertical === vertical 
              ? 'bg-indigo-600 text-white shadow-md scale-105' 
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700'
          }`}
        >
          {vertical}
        </button>
      ))}
    </div>
  );
}
