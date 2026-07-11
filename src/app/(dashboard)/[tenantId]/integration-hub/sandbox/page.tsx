import { getInstalledConnectors } from '@/app/actions/integrations';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';
import { Settings, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { SandboxClient } from './SandboxClient';

export default async function IntegrationSandboxPage({ params }: { params: { tenantId: string } }) {
  const res = await getInstalledConnectors();
  const installed = res.data || [];

  return (
    <div className="flex flex-col min-h-screen relative max-w-7xl mx-auto py-8 px-6 pb-24 font-sans text-slate-100">
      <Link href={`/${params.tenantId}/integration-hub`} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 w-fit transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Volver al Hub
      </Link>

      <header className="mb-8 relative z-10">
        <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-indigo-400" />
          Sandbox & Testing
        </h1>
        <p className="text-slate-400 mt-2 text-lg font-light max-w-2xl">
          Dispara sincronizaciones manuales o simula eventos entrantes para probar la robustez de los conectores en un entorno controlado sin afectar al Event Bus principal.
        </p>
      </header>

      <SandboxClient installedConnectors={installed} />

      <PageHelpPanel 
        pageId="integration_sandbox"
        title="Testing de Conectores"
        description="Utiliza esta herramienta para verificar que Atlas AI puede leer correctamente la estructura de datos del proveedor (ej. Gesden) tras una instalación."
        roiImpact="Diagnosticar rápidamente problemas de conexión aquí evita que la operativa diaria se paralice, garantizando que el ROI de las automatizaciones siga sumando."
        docsLink="https://docs.atlas.ai/sandbox"
      />
    </div>
  );
}
