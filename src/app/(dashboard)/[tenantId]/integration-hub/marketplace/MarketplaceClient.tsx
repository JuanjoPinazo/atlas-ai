"use client";

import { useState } from 'react';
import { ConnectorInfo, ConnectorType } from '@/lib/schemas/integration';
import { installConnector, connectConnector } from '@/app/actions/integrations';
import { Search, Loader2, CheckCircle2, ChevronRight, X, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function MarketplaceClient({ registry, installedIds }: { registry: ConnectorInfo[], installedIds: string[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [installing, setInstalling] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<ConnectorInfo | null>(null);

  const filtered = registry.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInstall = async (type: ConnectorType) => {
    setInstalling(type);
    const res = await installConnector(type);
    if (res.data) {
      setSelectedConfig(registry.find(r => r.type === type) || null);
    }
    setInstalling(null);
  };

  const handleConnect = async () => {
    if (!selectedConfig) return;
    setInstalling('CONNECTING');
    // Simulamos paso de credenciales
    await connectConnector(selectedConfig.type as ConnectorType, { token: 'simulated' });
    setInstalling(null);
    setSelectedConfig(null);
    router.refresh();
  };

  return (
    <>
      {/* Search & Filters */}
      <div className="mb-8 relative z-10">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input 
            type="text"
            placeholder="Buscar integraciones (ej. Gesden, WhatsApp, Stripe)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-indigo-500 transition-colors backdrop-blur-md"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {filtered.map(connector => {
          const isInstalled = installedIds.includes(connector.type);
          const isProcessing = installing === connector.type;

          return (
            <div key={connector.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                  <span className="text-indigo-400 font-bold text-xl">{connector.name.charAt(0)}</span>
                </div>
                {isInstalled ? (
                  <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Instalado
                  </span>
                ) : (
                  <span className="text-slate-500 text-xs font-mono bg-slate-800/50 px-2 py-1 rounded">v{connector.version}</span>
                )}
              </div>

              <h3 className="text-lg font-medium text-white mb-2">{connector.name}</h3>
              <p className="text-slate-400 text-sm mb-6 flex-grow">{connector.description}</p>

              <div className="pt-4 border-t border-slate-800/50 mt-auto">
                {isInstalled ? (
                  <button disabled className="w-full py-2.5 bg-slate-800/50 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed">
                    Ya integrado
                  </button>
                ) : (
                  <button 
                    onClick={() => handleInstall(connector.type as ConnectorType)}
                    disabled={isProcessing}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Instalar Integración'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Config Modal (Simulated) */}
      {selectedConfig && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h3 className="text-xl font-medium text-white">Configurar {selectedConfig.name}</h3>
              <button onClick={() => setSelectedConfig(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mb-6 flex gap-3 text-indigo-200 text-sm">
                <ShieldAlert className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <p>Las credenciales se almacenarán de forma encriptada en el Vault de Atlas AI utilizando el estándar AES-256-GCM.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">API Key / Token de Acceso</label>
                  <input type="password" placeholder="sk_test_..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Webhook Endpoint (Opcional)</label>
                  <input type="text" placeholder="https://api.atlas.ai/webhooks/..." className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-400 focus:outline-none focus:border-indigo-500" disabled value={`https://api.atlas.ai/wh/${selectedConfig.type.toLowerCase()}`} />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-800 bg-slate-800/20 flex justify-end gap-3">
              <button onClick={() => setSelectedConfig(null)} className="px-5 py-2.5 rounded-lg text-slate-300 hover:text-white font-medium text-sm">
                Cancelar
              </button>
              <button 
                onClick={handleConnect}
                disabled={installing === 'CONNECTING'}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
              >
                {installing === 'CONNECTING' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Probar Conexión y Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
