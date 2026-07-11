import { FileText } from 'lucide-react';
import { EmptyState } from '@/components/ui/help/EmptyState';

export default async function ProposalsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500" />
            Propuestas
          </h2>
          <p className="text-slate-500 text-sm mt-1">Revisa las propuestas de conocimiento pendientes.</p>
        </div>
      </div>
      
      <EmptyState
        title="Todo revisado"
        description="No hay propuestas pendientes. Cuando un empleado digital detecte nuevo conocimiento útil, aparecerá aquí para que puedas aprobarlo."
        icon={FileText}
        action={
          <button className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Crear propuesta manual
          </button>
        }
      />
    </div>
  );
}
