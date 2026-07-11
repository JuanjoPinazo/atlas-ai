import { Info } from 'lucide-react';
import React from 'react';

interface InfoCalloutProps {
  title: string;
  children: React.ReactNode;
}

export function InfoCallout({ title, children }: InfoCalloutProps) {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4 flex gap-4 my-4">
      <div className="flex-shrink-0 mt-0.5">
        <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
          {title}
        </h4>
        <div className="text-sm text-indigo-700 dark:text-indigo-400/80 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}
