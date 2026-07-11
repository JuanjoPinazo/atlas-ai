import Link from 'next/link';
import { BrainCircuit } from 'lucide-react';
import { BRAIN_NAVIGATION } from '@/config/navigation';

export default async function CompanyBrainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  
  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-indigo-500" />
          Cerebro de Empresa
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Gestiona el conocimiento base, reglas de negocio y automatizaciones de tu empresa.
        </p>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-800 mb-6">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {BRAIN_NAVIGATION.map((item) => (
            <Link
              key={item.name}
              href={`/${tenantId}/brain${item.href}`}
              className="group inline-flex items-center py-4 px-1 border-b-2 border-transparent font-medium text-sm text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-700 whitespace-nowrap transition-colors"
            >
              <item.icon
                className="mr-2 h-5 w-5 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300"
                aria-hidden="true"
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
