import { BrainCircuit } from 'lucide-react';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';

export default async function BrainOverviewPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-indigo-500" />
            Resumen del Cerebro
          </h2>
          <p className="text-slate-500 text-sm mt-1">Visión general del conocimiento y reglas de tu empresa.</p>
        </div>
      </div>
      
      <PageHelpPanel 
        title="¿Qué es el Cerebro de Empresa?" 
        description="Es el lugar donde centralizas todo el conocimiento de tu negocio. Al conectar tus fuentes (documentos, webs, herramientas), los Empleados Digitales aprenden de ti y pueden tomar decisiones, responder preguntas y automatizar tareas siguiendo tus reglas exactas."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Placeholder stats */}
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Dominios</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Fuentes Activas</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Propuestas Pendientes</p>
          <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">0</p>
        </div>
      </div>
    </div>
  );
}
