import { Info } from 'lucide-react';
import React from 'react';

interface PageHelpPanelProps {
  title: string;
  description: string;
  roiImpact?: string;
  docsLink?: string;
  pageId?: string;
}

export function PageHelpPanel({ title, description, roiImpact, docsLink }: PageHelpPanelProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-6 flex gap-4">
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Info className="w-5 h-5" />
        </div>
      </div>
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {description}
        </p>
        {roiImpact && (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-2">
            ROI Impact: {roiImpact}
          </p>
        )}
        {docsLink && (
          <a href={docsLink} target="_blank" rel="noreferrer" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mt-2 inline-block hover:underline">
            Ver Documentación
          </a>
        )}
      </div>
    </div>
  );
}
