import { fetchDentalKnowledgeData } from '@/app/actions/dental-knowledge';
import { DentalManagerClient } from './DentalManagerClient';

export default async function DentalManagerPage({ params }: { params: { tenantId: string } }) {
  const result = await fetchDentalKnowledgeData(params.tenantId);

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2>Error cargando el Atlas Dental Knowledge Blueprint</h2>
        <p>{result.error}</p>
      </div>
    );
  }

  return <DentalManagerClient data={result.data} />;
}
