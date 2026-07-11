import { fetchCommandCenterData } from '@/app/actions/command-center';
import { CommandCenterClient } from './CommandCenterClient';

export default async function CommandCenterPage() {
  const result = await fetchCommandCenterData();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-red-500 bg-slate-950 h-full">
        <h2>Error cargando Atlas Command Center</h2>
        <p>{result.error}</p>
      </div>
    );
  }

  return <CommandCenterClient clients={result.data.clients} alerts={result.data.alerts} />;
}
