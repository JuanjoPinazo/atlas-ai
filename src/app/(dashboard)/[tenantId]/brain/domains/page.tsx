import { Layers } from 'lucide-react';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';

export default async function DomainsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            Dominios
          </h2>
          <p className="text-slate-500 text-sm mt-1">Organiza el conocimiento por departamentos o áreas.</p>
        </div>
      </div>
      
      <PageHelpPanel 
        title="¿Qué son los Dominios?" 
        description="Son como las carpetas o departamentos de tu empresa (Ej: 'Recursos Humanos', 'Ventas', 'Atención al Cliente'). Te permiten organizar la información para que sea más fácil de mantener."
      />

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <p className="text-slate-500 dark:text-slate-400 text-center py-12">Lista de dominios aparecerá aquí...</p>
      </div>
    </div>
  );
}
