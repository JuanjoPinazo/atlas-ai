import { getInstalledConnectors } from '@/app/actions/integrations';
import { ConnectorRegistry } from '@/lib/connectors/core/ConnectorRegistry';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';
import { Network, Store, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { MarketplaceClient } from './MarketplaceClient';

export default async function IntegrationMarketplacePage({ params }: { params: { tenantId: string } }) {
  const res = await getInstalledConnectors();
  const installedIds = (res.data || []).map(c => c.connector_type);
  const registry = ConnectorRegistry.getAvailableConnectors();

  return (
    <div className="flex flex-col min-h-screen relative max-w-7xl mx-auto py-8 px-6 pb-24 font-sans text-slate-100">
      <Link href={`/${params.tenantId}/integration-hub`} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 w-fit transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Volver al Hub
      </Link>

      <header className="mb-8 relative z-10">
        <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
          <Store className="w-8 h-8 text-indigo-400" />
          Marketplace de Conectores
        </h1>
        <p className="text-slate-400 mt-2 text-lg font-light max-w-2xl">
          Instala nuevas integraciones para conectar Atlas AI con tus sistemas actuales. Las instalaciones se realizan a nivel de tu organización de forma segura y aislada.
        </p>
      </header>

      <MarketplaceClient registry={registry} installedIds={installedIds} />

      {/* HELP PANEL */}
      <PageHelpPanel 
        pageId="integration_marketplace"
        title="Catálogo de Conectores"
        description="Explora e instala las herramientas soportadas oficialmente por Atlas AI. Al instalar, creas un canal seguro por donde la inteligencia artificial puede actuar sobre los datos."
        roiImpact="Integrar un PMS como Gesden automatiza todo el volcado de presupuestos, lo cual permite al Event Bus procesar inmediatamente recordatorios sin fricción manual."
        docsLink="https://docs.atlas.ai/marketplace"
      />
    </div>
  );
}
