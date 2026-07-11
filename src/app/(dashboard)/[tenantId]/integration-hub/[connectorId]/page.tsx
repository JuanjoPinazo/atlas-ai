import { getInstalledConnectors } from '@/app/actions/integrations';
import { ConnectorRegistry } from '@/lib/connectors/core/ConnectorRegistry';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';
import { ArrowLeft, Network } from 'lucide-react';
import Link from 'next/link';
import { ConnectorDetailClient } from './ConnectorDetailClient';

export default async function ConnectorDetailPage({ params }: { params: { tenantId: string, connectorId: string } }) {
  const res = await getInstalledConnectors();
  const connector = (res.data || []).find(c => c.id === params.connectorId);
  
  if (!connector) {
    return <div className="p-12 text-center text-white">Conector no encontrado</div>;
  }

  const info = ConnectorRegistry.getConnectorInfo(connector.connector_type);

  return (
    <div className="flex flex-col min-h-screen relative max-w-7xl mx-auto py-8 px-6 pb-24 font-sans text-slate-100">
      <Link href={`/${params.tenantId}/integration-hub`} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 w-fit transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Volver al Hub
      </Link>

      <header className="mb-8 relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
            <Network className="w-8 h-8 text-indigo-400" />
            {info?.name || connector.connector_type}
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light">
            Versión del adaptador: v{info?.version || '1.0'}
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${
          connector.status === 'CONNECTED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
          connector.status === 'ERROR' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
          'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }`}>
          {connector.status}
        </div>
      </header>

      <ConnectorDetailClient connector={connector} info={info} />

      <PageHelpPanel 
        pageId="integration_detail"
        title={`Conector: ${info?.name}`}
        description={info?.description || 'Gestiona la conexión individual de esta herramienta.'}
        roiImpact="Mantener la latencia por debajo de 200ms garantiza que el Motor de Decisiones actúe en tiempo real (ej. enviando un WA justo al terminar una cita)."
        docsLink="https://docs.atlas.ai/connectors"
      />
    </div>
  );
}
