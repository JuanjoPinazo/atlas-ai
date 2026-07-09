import { Component } from 'lucide-react';

export default async function UnitsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Component className="w-6 h-6 text-indigo-500" />
            Knowledge Units
          </h2>
          <p className="text-slate-500 text-sm mt-1">Atomic, versioned chunks of knowledge used for Context Packages.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
          Add Unit
        </button>
      </div>
      
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
          <Component className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p>No knowledge units found.</p>
          <p className="text-sm mt-1">Units are automatically extracted from sources or added manually.</p>
        </div>
      </div>
    </div>
  );
}
