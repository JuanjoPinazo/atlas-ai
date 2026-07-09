import { BrainCircuit, Database, GitMerge, FileText } from 'lucide-react';

export default async function CompanyBrainOverview({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;

  const stats = [
    { name: 'Active Services', value: '12', icon: GitMerge, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { name: 'Knowledge Documents', value: '45', icon: Database, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { name: 'Active Policies', value: '8', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-4xl">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Brain Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.name} className="flex items-center p-4 border border-slate-200 dark:border-slate-800 rounded-xl">
              <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 dark:bg-slate-950/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4">Declarative Configuration Status</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">
            Your Company Brain is fully operating under the declarative paradigm. System behaviors are governed by JSON configuration rather than hardcoded rules, enabling infinite scalability for your industry.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Core Engine</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Healthy</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500">Semantic Indexes</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending Embeddings</span>
            </div>
            <div className="flex justify-between items-center text-sm pb-2">
              <span className="text-slate-500">Audit Trigger Sync</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
