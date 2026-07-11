import { HelpCircle } from 'lucide-react';

export function HelpTooltip({ text }: { text: string }) {
  return (
    <div className="group relative inline-flex items-center justify-center">
      <HelpCircle className="w-4 h-4 text-slate-400 hover:text-indigo-500 cursor-help transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs z-50">
        <div className="bg-slate-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg">
          {text}
        </div>
        <div className="w-2 h-2 bg-slate-900 transform rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
      </div>
    </div>
  );
}
