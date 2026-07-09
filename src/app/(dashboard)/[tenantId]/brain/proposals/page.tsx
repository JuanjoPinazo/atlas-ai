import { FileText } from 'lucide-react';

export default async function ProposalsPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500" />
            Knowledge Proposals
          </h2>
          <p className="text-slate-500 text-sm mt-1">Review pending knowledge updates proposed by agents or users.</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-12 text-center text-slate-500 dark:text-slate-400">
          <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p>All caught up!</p>
          <p className="text-sm mt-1">There are no pending proposals to review.</p>
        </div>
      </div>
    </div>
  );
}
