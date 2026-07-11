"use client";

import { removeConnector, connectConnector, disconnectConnector } from '@/app/actions/integrations';
import { useRouter } from 'next/navigation';
import { Trash2, Link as LinkIcon, Unlink, Activity, ShieldAlert, Key } from 'lucide-react';
import { useState } from 'react';

export function ConnectorDetailClient({ connector, info }: { connector: any, info: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState('');

  const isConnected = connector.status === 'CONNECTED';

  const handleConnect = async () => {
    setLoading(true);
    await connectConnector(connector.connector_type, { token: key });
    setLoading(false);
    setKey('');
  };

  const handleDisconnect = async () => {
    setLoading(true);
    await disconnectConnector(connector.connector_type);
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await removeConnector(connector.connector_type);
    router.push(`../integration-hub`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Estado y Credenciales */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-400" />
            Credenciales & Conexión
          </h3>

          {!isConnected ? (
            <div className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-amber-200 text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p>El conector está desconectado. Por favor, introduce tu API Key o Token para restablecer el enlace seguro.</p>
              </div>
              <input 
                type="password" 
                placeholder="Ingresa la clave secreta o token..." 
                value={key}
                onChange={e => setKey(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
              />
              <button 
                disabled={loading || !key}
                onClick={handleConnect}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <LinkIcon className="w-4 h-4" /> Enlazar Conector
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3 text-emerald-200 text-sm">
                <Activity className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p>Conexión establecida. El túnel está activo y cifrado mediante AES-256.</p>
              </div>
              <button 
                disabled={loading}
                onClick={handleDisconnect}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors border border-slate-700"
              >
                <Unlink className="w-4 h-4" /> Desconectar Temporalmente
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="lg:col-span-1 flex flex-col gap-6">
        
        {/* Info */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Capacidades Soportadas</h3>
          <ul className="space-y-3 mb-8">
            {info.capabilities?.map((cap: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div> {cap}
              </li>
            ))}
          </ul>

          <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Mantenimiento</h3>
          <button 
            disabled={loading}
            onClick={handleRemove}
            className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Desinstalar Integración
          </button>
        </div>
      </div>
    </div>
  );
}
