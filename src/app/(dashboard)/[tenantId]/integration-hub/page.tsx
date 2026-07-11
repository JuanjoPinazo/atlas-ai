import { getInstalledConnectors } from '@/app/actions/integrations';
import { ConnectorRegistry } from '@/lib/connectors/core/ConnectorRegistry';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';
import { Network, Activity, ServerCrash, Clock, Settings, Zap, ArrowRight, Puzzle } from 'lucide-react';
import Link from 'next/link';
import { ConnectorInfo } from '@/lib/schemas/integration';

export default async function IntegrationHubPage({ params }: { params: { tenantId: string } }) {
  const res = await getInstalledConnectors();
  const installed = res.data || [];
  
  const registry = ConnectorRegistry.getAvailableConnectors();
  const getInfo = (type: string) => registry.find(r => r.type === type);

  const healthy = installed.filter(c => c.health_score > 80).length;
  const warnings = installed.filter(c => c.health_score > 0 && c.health_score <= 80).length;
  const disconnected = installed.filter(c => c.status === 'DISCONNECTED' || c.status === 'ERROR').length;
  const avgLatency = installed.length ? Math.round(installed.reduce((acc, c) => acc + c.latency_ms, 0) / installed.length) : 0;

  return (
    <div className="flex flex-col min-h-screen relative max-w-7xl mx-auto py-8 px-6 pb-24 font-sans text-slate-100">
      
      {/* HEADER */}
      <header className="mb-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
            <Network className="w-8 h-8 text-emerald-400" />
            Integration Hub
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light max-w-2xl">
            Centro neurálgico de conectividad. Supervisa la salud, latencia y telemetría de todos tus sistemas externos conectados a Atlas AI.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/${params.tenantId}/integration-hub/sandbox`} className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition-all text-sm font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Sandbox
          </Link>
          <Link href={`/${params.tenantId}/integration-hub/marketplace`} className="px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all text-sm font-medium flex items-center gap-2">
            <Puzzle className="w-4 h-4" />
            Instalar Conector
          </Link>
        </div>
      </header>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Network className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Conectores Activos</span>
          </div>
          <span className="text-4xl font-light text-white">{installed.length}</span>
        </div>
        <div className="bg-emerald-900/10 backdrop-blur-xl border border-emerald-500/20 p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 text-emerald-400 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Sistemas Saludables</span>
          </div>
          <span className="text-4xl font-light text-emerald-400">{healthy}</span>
        </div>
        <div className="bg-amber-900/10 backdrop-blur-xl border border-amber-500/20 p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Latencia Media</span>
          </div>
          <span className="text-4xl font-light text-amber-400">{avgLatency}ms</span>
        </div>
        <div className="bg-rose-900/10 backdrop-blur-xl border border-rose-500/20 p-6 rounded-2xl flex flex-col">
          <div className="flex items-center gap-2 text-rose-400 mb-2">
            <ServerCrash className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Desconectados / Error</span>
          </div>
          <span className="text-4xl font-light text-rose-400">{disconnected}</span>
        </div>
      </div>

      {/* CONNECTORS LIST */}
      <h2 className="text-2xl font-light mb-6 flex items-center gap-2">
        <Zap className="w-5 h-5 text-indigo-400" />
        Topología de Integraciones
      </h2>

      {installed.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700">
            <Puzzle className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-light text-white mb-2">Tu hub está vacío</h3>
          <p className="text-slate-400 max-w-md mb-8">
            Atlas AI necesita conectarse con tu ecosistema (PMS, herramientas de marketing, calendarios) para automatizar los flujos y capturar telemetría.
          </p>
          <Link href={`/${params.tenantId}/integration-hub/marketplace`} className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium rounded-xl transition-colors flex items-center gap-2">
            Explorar Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {installed.map(conn => {
            const info = getInfo(conn.connector_type);
            const isHealthy = conn.health_score > 80;
            const isError = conn.status === 'ERROR';
            return (
              <Link href={`/${params.tenantId}/integration-hub/${conn.id}`} key={conn.id} className="group bg-slate-900/60 backdrop-blur-md border border-slate-800 hover:border-indigo-500/30 p-6 rounded-2xl transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                      <Network className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-slate-200 group-hover:text-white transition-colors">{info?.name || conn.connector_type}</h3>
                      <p className="text-sm text-slate-500">{info?.version || '1.0.0'}</p>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isHealthy ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    isError ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {conn.status}
                  </div>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Health Score</p>
                    <div className="flex items-center gap-2">
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${isHealthy ? 'bg-emerald-500' : isError ? 'bg-rose-500' : 'bg-amber-500'}`} style={{ width: `${conn.health_score}%` }}></div>
                      </div>
                      <span className="text-sm font-medium text-slate-300">{conn.health_score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Latencia</p>
                    <p className="text-sm font-medium text-slate-300">{conn.latency_ms} ms</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* HELP PANEL */}
      <PageHelpPanel 
        pageId="integration_hub"
        title="Integration Hub"
        description="Gestiona y monitoriza todas las conexiones con herramientas externas en un solo lugar. La telemetría capturada permite a la Inteligencia de Atlas detectar cuellos de botella en la clínica."
        roiImpact="La automatización cruzada (PMS + CRM + Calendarios) puede ahorrar hasta 40h mensuales de trabajo administrativo por clínica."
        docsLink="https://docs.atlas.ai/integrations"
      />
    </div>
  );
}
