import { fetchBusinessValueData } from '@/app/actions/business-value';
import { BusinessValueClient } from './BusinessValueClient';

export default async function BusinessValuePage() {
  const result = await fetchBusinessValueData();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-red-500 bg-slate-950 h-full">
        <h2>Error cargando Business Value Center</h2>
        <p>{result.error}</p>
      </div>
    );
  }

  return <BusinessValueClient opportunities={result.data.opportunities} />;
}
