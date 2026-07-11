"use client";

import React from 'react';
import { ClientNode, GlobalAlert } from '@/lib/schemas/command-center';
import { HqHero } from './_components/HqHero';
import { SpainMap } from './_components/SpainMap';
import { CriticalAlerts } from './_components/CriticalAlerts';
import { ClientListTable } from './_components/ClientListTable';
import { FrameworkHelp } from '../framework/_components/FrameworkHelp';

interface Props {
  clients: ClientNode[];
  alerts: GlobalAlert[];
}

export function CommandCenterClient({ clients, alerts }: Props) {
  const helpData = {
    what: 'Atlas Command Center es la consola de operaciones global. Vista "Modo Dios" de la plataforma B2B.',
    why: 'Diseñado para monitorizar, diagnosticar y desplegar actualizaciones (OTA) a cientos de clínicas simultáneamente desde Atlas HQ.',
    value: 'Asegura la escalabilidad del producto. Permite detectar clientes en riesgo (churn) antes de que suceda evaluando su Health Score.',
    sales: '"Atlas es un ecosistema vivo. Desde el Command Center actualizamos el cerebro de todas las clínicas de España en 30 segundos."',
    setup: 'Autogenerado a partir de la telemetría de todos los tenants activos en Supabase.',
    roi: 'Reduce brutalmente los costes de soporte y Customer Success gracias al diagnóstico remoto preventivo.'
  };

  return (
    <div className="min-h-full bg-slate-950 p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Background "NASA" Radar effect */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-[1600px] w-full mx-auto flex flex-col h-full relative z-10">
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-400 tracking-tight mb-4 uppercase">
              Global Command Center
            </h1>
            <p className="text-slate-400 max-w-2xl text-base md:text-lg">
              Operaciones Maestras. Telemetría de flota, diagnósticos remotos y despliegue global de conocimiento Atlas.
            </p>
          </div>
          <FrameworkHelp data={helpData} />
        </div>

        {/* Global Metrics Hero */}
        <HqHero clients={clients} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Map of Spain */}
          <div className="lg:col-span-4 min-h-[400px]">
            <SpainMap />
          </div>
          
          {/* Diagnostic Table */}
          <div className="lg:col-span-8 min-h-[400px]">
            <ClientListTable clients={clients} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Alerts Feed */}
          <div className="lg:col-span-12 min-h-[300px]">
            <CriticalAlerts alerts={alerts} />
          </div>
        </div>

      </div>
    </div>
  );
}
