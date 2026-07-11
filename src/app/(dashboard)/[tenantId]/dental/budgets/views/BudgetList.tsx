"use client";

import React, { useState, useEffect } from 'react';
import { fetchBudgets, simulateTime } from '@/app/actions/budget';
import { Clock, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight, FastForward } from 'lucide-react';
import { FrameworkHelp } from '../../../framework/_components/FrameworkHelp';

export function BudgetList({ onSelect }: { onSelect: (id: string) => void }) {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchBudgets();
      if (res.success) {
        setBudgets(res.data || []);
      } else {
        setError(res.error || 'Unknown error');
      }
    } catch (e: any) {
      setError(e.message || 'Error loading budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulate = async () => {
    await simulateTime(7); // Avanza 7 días
    loadData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING_DECISION': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
      case 'FOLLOW_UP_SCHEDULED': return 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30';
      case 'ACCEPTED': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
      case 'REJECTED': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30';
    }
  };

  const helpData = {
    what: 'Seguimiento de Presupuestos (ABVL-01)',
    why: 'Primer flujo end-to-end con base de datos real y Event Bus.',
    value: 'Evita perder pacientes que simplemente olvidaron contestar o tenían dudas no resueltas.',
    sales: 'Pulsa "Acelerar Tiempo" para demostrar cómo el sistema detecta de forma proactiva que un presupuesto lleva 14 días parado.',
    setup: 'Datos conectados a DB. No son mocks hardcodeados.',
    roi: 'Aumenta un 15-20% el cierre de presupuestos de alto valor sin contratar a un "perseguidor" humano.'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Presupuestos Activos</h2>
          <p className="text-slate-400">Datos Reales - Event Driven Architecture</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSimulate}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20"
          >
            <FastForward className="w-4 h-4" /> Acelerar Tiempo (+7 días)
          </button>
          <FrameworkHelp data={helpData} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-2xl p-6">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest block mb-2">Valor Pendiente</span>
          <span className="text-3xl font-extrabold text-white">
            €{budgets.filter(b => b.status === 'PENDING_DECISION').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </span>
        </div>
        <div className="bg-emerald-900/20 border border-emerald-500/30 backdrop-blur-xl rounded-2xl p-6">
          <span className="text-sm font-bold text-emerald-400 uppercase tracking-widest block mb-2">Valor Rescatado</span>
          <span className="text-3xl font-extrabold text-emerald-400">
            €{budgets.filter(b => b.status === 'ACCEPTED').reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800/50 border-b border-slate-700/50 text-slate-400 text-sm font-bold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Paciente</th>
              <th className="px-6 py-4">Tratamiento</th>
              <th className="px-6 py-4">Importe</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Emisión</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {error && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-red-500 bg-red-500/10">
                  Error cargando presupuestos: {error}
                </td>
              </tr>
            )}
            {!loading && !error && budgets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  No hay presupuestos activos.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                  Cargando presupuestos...
                </td>
              </tr>
            )}
            {!loading && !error && budgets.map(b => {
              const days = Math.floor((new Date().getTime() - new Date(b.issued_at).getTime()) / (1000 * 3600 * 24));
              
              return (
                <tr key={b.id} className="hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => onSelect(b.id)}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-white">{b.patient?.name}</div>
                    <div className="text-xs text-slate-500">{b.patient?.channel}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 font-medium">{b.treatment}</td>
                  <td className="px-6 py-4 text-white font-bold font-mono">€{b.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-300">Hace {days} días</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
