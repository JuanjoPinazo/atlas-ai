import { Inbox } from 'lucide-react';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';

export default async function SourcesPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Inbox className="w-6 h-6 text-indigo-500" />
            Fuentes de Conocimiento
          </h2>
          <p className="text-slate-500 text-sm mt-1">Conecta documentos, carpetas o aplicaciones.</p>
        </div>
      </div>
      
      <PageHelpPanel 
        title="¿Qué son las Fuentes?" 
        description="Son los lugares de donde extraemos el conocimiento. Puedes subir PDFs, conectar tu Google Drive o enlazar tu página web. Nosotros nos encargamos de leerlos automáticamente para enseñárselos a tus Empleados Digitales."
      />

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <p className="text-slate-500 dark:text-slate-400 text-center py-12">Lista de fuentes aparecerá aquí...</p>
      </div>
    </div>
  );
}
