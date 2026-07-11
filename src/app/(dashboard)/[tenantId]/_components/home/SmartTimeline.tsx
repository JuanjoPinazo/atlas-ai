import React from 'react';
import { GitCommit, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';

export function SmartTimeline() {
  const events = [
    {
      id: 1,
      time: 'Hace 10 min',
      icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
      title: 'Decisión Escalada a Humano',
      desc: 'El Decision Engine derivó un caso complejo (reembolso sin ticket) al equipo de soporte por conflicto con límite estricto de ADN.',
    },
    {
      id: 2,
      time: 'Hace 1 hora',
      icon: <Cpu className="w-4 h-4 text-purple-500" />,
      title: 'Indexación Automática Completada',
      desc: 'Se han procesado e indexado 12 nuevas referencias del catálogo de productos en el Company Brain.',
    },
    {
      id: 3,
      time: 'Hace 3 horas',
      icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      title: 'Context Engine Optimizado',
      desc: 'Reajuste automático del presupuesto de tokens completado. Eficiencia de recuperación incrementada en un 15%.',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Actividad Inteligente Reciente</h3>
      
      <div className="relative border-l border-slate-200 dark:border-slate-700 ml-3 space-y-8">
        {events.map((event) => (
          <div key={event.id} className="relative pl-6">
            <div className="absolute -left-3 top-0 w-6 h-6 bg-white dark:bg-slate-900 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center">
              {event.icon}
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-slate-900 dark:text-white">{event.title}</span>
                <span className="text-xs text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{event.time}</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">{event.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
