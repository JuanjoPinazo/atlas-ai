import { fetchOrchestratorData } from '@/app/actions/orchestrator';
import { OrchestratorClient } from './OrchestratorClient';

export default async function OrchestratorPage() {
  const result = await fetchOrchestratorData();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-red-500 bg-slate-950 h-full">
        <h2>Error cargando Atlas Orchestrator</h2>
        <p>{result.error}</p>
      </div>
    );
  }

  return <OrchestratorClient events={result.data.events} services={result.data.services} />;
}
