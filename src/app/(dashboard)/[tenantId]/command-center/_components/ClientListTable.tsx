"use client";

import React from 'react';
import { ClientNode } from '@/lib/schemas/command-center';
import { MoreVertical, Server, Cpu, HeartPulse } from 'lucide-react';

interface Props {
  clients: ClientNode[];
}

export function ClientListTable({ clients }: Props) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-6">Diagnóstico Remoto de Clientes</h3>
      
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="text-xs text-slate-500 uppercase bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Cliente</th>
              <th className="px-4 py-3">Health Score</th>
              <th className="px-4 py-3">Ecosistema</th>
              <th className="px-4 py-3">Empleados Activos</th>
              <th className="px-4 py-3">Consumo (Tokens)</th>
              <th className="px-4 py-3 rounded-tr-lg">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="font-bold text-white">{client.name}</div>
                  <div className="text-xs text-slate-500">{client.location}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <HeartPulse className={`w-4 h-4 ${
                      client.status === 'healthy' ? 'text-emerald-400' :
                      client.status === 'warning' ? 'text-amber-400' : 'text-red-400'
                    }`} />
                    <span className="font-bold">{client.health_score}/100</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-slate-400" />
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
                      KP: {client.knowledge_pack_version}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold">{client.active_employees} Agentes</span>
                  </div>
                </td>
                <td className="px-4 py-4 font-mono text-xs">
                  {(client.ai_consumption_tokens / 1000).toFixed(0)}k
                </td>
                <td className="px-4 py-4 text-slate-500">
                  <button className="hover:text-white p-1 rounded hover:bg-slate-700 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
