"use client";

import React from 'react';
import { DentalItem, DentalDomain } from '@/lib/schemas/dental-knowledge';
import { Activity, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { ContextualHelp } from '../_components/ContextualHelp';

interface Props {
  items: DentalItem[];
  domains: DentalDomain[];
}

export function OverviewView({ items, domains }: Props) {
  const total = items.length;
  const approved = items.filter(i => i.status === 'aprobado').length;
  const pending = items.filter(i => i.status === 'pendiente de revisión').length;
  const obsolete = items.filter(i => i.status === 'obsoleto').length;
  
  const coverage = total > 0 ? Math.round((approved / total) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Panel de Control 
            <ContextualHelp text="Resumen del estado global del conocimiento de la clínica." />
          </h2>
          <p className="text-sm text-slate-500">Visión general del Dental Knowledge Blueprint</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Cobertura Validada</h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{coverage}%</p>
          <p className="text-xs text-slate-500 mt-1">{approved} de {total} unidades aprobadas</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Total Unidades</h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{total}</p>
          <p className="text-xs text-slate-500 mt-1">Reglas y procesos mapeados</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">En Revisión</h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{pending}</p>
          <p className="text-xs text-slate-500 mt-1">Pendiente de validación clínica</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">Obsoletos</h3>
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">{obsolete}</p>
          <p className="text-xs text-slate-500 mt-1">Requieren actualización urgente</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm mt-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Dominios Activos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {domains.map(d => (
            <div key={d.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{d.name}</h4>
              <p className="text-xs text-slate-500 mt-1">{d.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
