import { fetchFrameworkEngines } from '@/app/actions/framework';
import { FrameworkClient } from './FrameworkClient';

export default async function FrameworkPage() {
  const result = await fetchFrameworkEngines();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-red-500 bg-slate-950 h-full">
        <h2>Error cargando Atlas Intelligence Framework</h2>
        <p>{result.error}</p>
      </div>
    );
  }

  return <FrameworkClient engines={result.data} />;
}
