export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  
  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Welcome to the control panel for tenant <span className="font-semibold text-indigo-600 dark:text-indigo-400">{tenantId}</span>.
        </p>
        
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Placeholder for dashboard widgets */}
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="bg-white dark:bg-slate-900 overflow-hidden shadow-sm rounded-xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
                <div className="w-5 h-5 bg-indigo-500 dark:bg-indigo-400 rounded-full opacity-50" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">Metric {i}</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">--</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
