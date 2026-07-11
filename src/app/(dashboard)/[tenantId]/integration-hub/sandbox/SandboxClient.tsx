"use client";

import { useState } from 'react';
import { ConnectorType } from '@/lib/schemas/integration';
import { syncConnector } from '@/app/actions/integrations';
import { Terminal, Send, Server, Loader2, PlayCircle, RefreshCw } from 'lucide-react';

export function SandboxClient({ installedConnectors }: { installedConnectors: any[] }) {
  const [selected, setSelected] = useState<ConnectorType | ''>('');
  const [logs, setLogs] = useState<{ time: string, msg: string, type: 'info' | 'success' | 'error' }[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg, type }]);
  };

  const handleSync = async (full: boolean) => {
    if (!selected) return;
    setIsSyncing(true);
    addLog(`Iniciando sincronización ${full ? 'FULL' : 'DELTA'} para ${selected}...`, 'info');
    
    const res = await syncConnector(selected, { full });
    
    if (res.success && 'recordsProcessed' in res) {
      addLog(`Sincronización exitosa. Registros procesados: ${res.recordsProcessed}`, 'success');
    } else {
      addLog(`Error en sincronización: ${res.error}`, 'error');
    }
    
    setIsSyncing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
      
      {/* Controls */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-indigo-400" />
            Configuración Sandbox
          </h3>
          
          <label className="text-sm font-medium text-slate-300 mb-2">Seleccionar Conector</label>
          <select 
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 mb-6 focus:outline-none focus:border-indigo-500"
            value={selected}
            onChange={(e) => setSelected(e.target.value as ConnectorType)}
          >
            <option value="">-- Elige un conector instalado --</option>
            {installedConnectors.map(c => (
              <option key={c.id} value={c.connector_type} disabled={c.status !== 'CONNECTED'}>
                {c.connector_type} ({c.status})
              </option>
            ))}
          </select>

          <label className="text-sm font-medium text-slate-300 mb-2">Operaciones Soportadas</label>
          <div className="flex flex-col gap-3">
            <button 
              disabled={!selected || isSyncing}
              onClick={() => handleSync(true)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Full Historical Sync
            </button>
            <button 
              disabled={!selected || isSyncing}
              onClick={() => handleSync(false)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlayCircle className="w-4 h-4" />}
              Trigger Delta Sync
            </button>
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col">
          <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
            <Send className="w-5 h-5 text-emerald-400" />
            Simular Webhook (Inbound)
          </h3>
          <p className="text-sm text-slate-400 mb-4">Envía un payload de prueba al conector seleccionado simulando que el proveedor externo nos llama.</p>
          <button disabled className="w-full py-3 bg-slate-800 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed border border-slate-700">
            En desarrollo
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="lg:col-span-2 bg-black border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[600px] shadow-2xl">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Console Output</span>
        </div>
        <div className="flex-1 p-6 overflow-y-auto font-mono text-sm flex flex-col gap-2">
          {logs.length === 0 ? (
            <span className="text-slate-600 italic">Esperando ejecución...</span>
          ) : (
            logs.map((l, i) => (
              <div key={i} className="flex gap-4 border-b border-slate-900/50 pb-2">
                <span className="text-slate-500 flex-shrink-0">[{l.time}]</span>
                <span className={
                  l.type === 'success' ? 'text-emerald-400' :
                  l.type === 'error' ? 'text-rose-400' :
                  'text-slate-300'
                }>
                  {l.msg}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
