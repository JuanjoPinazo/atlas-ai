"use client";

import React from 'react';
import { DigitalEmployeeProfile } from '@/lib/schemas/employee-designer';
import { Bot, Target, ShieldCheck, Wrench, Briefcase, TrendingUp } from 'lucide-react';

interface Props {
  employee: DigitalEmployeeProfile;
}

export function EmployeeCard({ employee }: Props) {
  return (
    <div className="bg-slate-900/50 border border-slate-700/50 hover:border-indigo-500/50 backdrop-blur-xl rounded-3xl p-6 transition-all duration-300 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
      
      <div className="flex items-start gap-4 mb-6 relative z-10">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg border-2 border-slate-800">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-bold text-white">{employee.name}</h3>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {employee.status}
            </span>
          </div>
          <p className="text-indigo-400 font-medium text-sm">{employee.specialty}</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        
        {/* Mission */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            <Target className="w-4 h-4" /> Misión
          </h4>
          <p className="text-slate-300 text-sm">{employee.mission}</p>
        </div>

        {/* Competencies */}
        <div>
          <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
            <Briefcase className="w-4 h-4" /> Competencias
          </h4>
          <div className="flex flex-wrap gap-2">
            {employee.competencies.map((comp, i) => (
              <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md border border-slate-700">
                {comp}
              </span>
            ))}
          </div>
        </div>

        {/* Tools & Permissions Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <Wrench className="w-4 h-4" /> Herramientas
            </h4>
            <ul className="text-sm text-slate-400 space-y-1">
              {employee.tools.map((tool, i) => <li key={i}>• {tool}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              <ShieldCheck className="w-4 h-4" /> Permisos
            </h4>
            <ul className="text-sm text-slate-400 space-y-1">
              {employee.permissions.map((perm, i) => <li key={i}>• {perm}</li>)}
            </ul>
          </div>
        </div>

        {/* KPIs & ROI */}
        <div className="pt-4 border-t border-slate-700/50">
          <div className="flex justify-between items-end mb-4">
            <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <TrendingUp className="w-4 h-4" /> Rendimiento
            </h4>
            <div className="text-right">
              <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-widest">ROI Generado</span>
              <span className="text-xl font-bold text-emerald-400">€{employee.roi_generated.toLocaleString()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {employee.kpis.map((kpi, i) => (
              <div key={i} className="bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                <span className="block text-[10px] text-slate-500 mb-1 truncate">{kpi.name}</span>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-sm">{kpi.value}</span>
                  <span className="text-[10px] text-emerald-400 font-bold">{kpi.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
