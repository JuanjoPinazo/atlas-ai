import { Component } from 'lucide-react';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';

export default async function UnitsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Component className="w-6 h-6 text-indigo-500" />
            Unidades de Conocimiento
          </h2>
          <p className="text-slate-500 text-sm mt-1">Reglas de negocio y conceptos específicos.</p>
        </div>
      </div>
      
      <PageHelpPanel 
        title="¿Qué son las Unidades?" 
        description="Son piezas de información muy concretas, como una política de devoluciones, un precio o una regla de atención al cliente. Al definirlas, te aseguras de que tus Empleados Digitales sigan las normas al pie de la letra."
      />

      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
        <p className="text-slate-500 dark:text-slate-400 text-center py-12">Lista de unidades de conocimiento aparecerá aquí...</p>
      </div>
    </div>
  );
}
