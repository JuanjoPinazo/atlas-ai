"use client";

import React from 'react';
import { GlobalAlert } from '@/lib/schemas/command-center';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface Props {
  alerts: GlobalAlert[];
}

export function CriticalAlerts({ alerts }: Props) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-6 h-full flex flex-col">
      <h3 className="text-xl font-bold text-white mb-4">Feed de Operaciones</h3>
      
      <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2">
        {alerts.map(alert => {
          const isCritical = alert.severity === 'critical';
          const isHigh = alert.severity === 'high';
          
          const Icon = isCritical ? ShieldAlert : isHigh ? AlertTriangle : Info;
          const colorClass = isCritical ? 'text-red-400 bg-red-500/10 border-red-500/30' : 
                             isHigh ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 
                             'text-blue-400 bg-blue-500/10 border-blue-500/30';

          return (
            <div key={alert.id} className={`p-4 rounded-xl border ${colorClass} flex gap-4 items-start`}>
              <Icon className="w-5 h-5 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-bold text-white">{alert.message}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-slate-400">{alert.timestamp}</span>
                  {alert.client_id && (
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                      ID: {alert.client_id}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
