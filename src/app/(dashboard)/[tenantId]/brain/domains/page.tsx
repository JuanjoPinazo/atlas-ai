import { Layers } from 'lucide-react';

export default async function DomainsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-indigo-500" />
            Knowledge Domains
          </h2>
          <p className="text-slate-500 text-sm mt-1">Hierarchical functional areas of the company.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          Add Domain
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
          <Layers className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p>No domains configured yet.</p>
          <p className="text-sm mt-1">Create domains like 'Sales', 'HR', or 'Legal' to categorize knowledge.</p>
        </div>
      </div>
    </div>
  );
}
