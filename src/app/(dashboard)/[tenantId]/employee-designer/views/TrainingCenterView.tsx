"use client";

import React from 'react';
import { DigitalEmployeeProfile } from '@/lib/schemas/employee-designer';
import { BookOpen, Award, CheckCircle2 } from 'lucide-react';

interface Props {
  employees: DigitalEmployeeProfile[];
}

export function TrainingCenterView({ employees }: Props) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      
      <div className="bg-slate-900/50 border border-slate-700/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          Centro de Formación Continua
        </h2>
        <p className="text-slate-400 mb-8">
          Historial inmutable de los conocimientos adquiridos por el equipo digital a través del Company Brain y el Knowledge Studio.
        </p>

        <div className="space-y-8">
          {employees.map(emp => (
            <div key={emp.id} className="border border-slate-700/50 rounded-2xl p-6 bg-slate-800/30">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/30">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{emp.name}</h3>
                    <p className="text-xs text-slate-400">{emp.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Award className="w-4 h-4" /> {emp.certifications.length} Certificaciones
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-900/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Curso / Conocimiento</th>
                      <th className="px-4 py-3">Dominio</th>
                      <th className="px-4 py-3">Versión</th>
                      <th className="px-4 py-3">Fecha Aprobación</th>
                      <th className="px-4 py-3 rounded-tr-lg">Confianza (Test)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emp.training_history.map(record => (
                      <tr key={record.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800/50 transition-colors">
                        <td className="px-4 py-4 font-medium text-indigo-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          {record.course_name}
                        </td>
                        <td className="px-4 py-4">
                          <span className="bg-slate-700 px-2 py-1 rounded text-xs">{record.knowledge_domain}</span>
                        </td>
                        <td className="px-4 py-4 text-slate-400">{record.version}</td>
                        <td className="px-4 py-4 text-slate-400">{record.date_completed}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-700 rounded-full h-2 max-w-[100px]">
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${record.confidence_level}%` }}></div>
                            </div>
                            <span className="font-bold">{record.confidence_level}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {emp.training_history.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                          Sin historial de formación registrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
