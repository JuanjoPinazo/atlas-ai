import React from 'react';
import { EmployeeCopilotApp } from './_components/EmployeeCopilotApp';
import { Bot, Info } from 'lucide-react';

export default async function EmployeeCopilotPage({
  params,
}: {
  params: Promise<{ tenantId: string; id: string }>;
}) {
  const { tenantId, id } = await params;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* Top Bar for the Employee */}
      <div className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white leading-tight">Atlas AI (Demo)</h2>
            <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              En línea - Mock Provider Activo
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-900/50">
            <Info className="w-4 h-4" />
            Haz clic en los mensajes del asistente para ver el reporte de explicabilidad.
          </div>
        </div>
      </div>

      {/* Main Copilot App */}
      <div className="flex-1 overflow-hidden relative">
        <EmployeeCopilotApp />
      </div>

    </div>
  );
}
