import { getAssessmentReport, approveAndTransferAssessment } from '@/app/actions/assessment';
import { RadarChart } from './RadarChart';
import { ArrowLeft, CheckCircle2, TrendingUp, Zap, Target, FileText } from 'lucide-react';
import Link from 'next/link';

export default async function AssessmentResultsPage({ params }: { params: Promise<{ tenantId: string, assessmentId: string }> }) {
  const { tenantId, assessmentId } = await params;
  const { data: res } = await getAssessmentReport(assessmentId);

  if (!res || !res.report) {
    return <div className="p-12 text-center text-white">Evaluación no encontrada o no completada.</div>;
  }

  const { report, scores, recommendations } = res;
  
  // Use all indices for radar, but we only have 6.
  const radarData = scores.map(s => ({
    category: s.index_name,
    score: s.score
  }));

  const globalScore = scores.find(s => s.index_name === 'Maturity')?.score || 0;

  return (
    <div className="flex flex-col min-h-screen relative max-w-7xl mx-auto py-8 px-6 pb-24 font-sans text-slate-100">
      <Link href={`/${tenantId}/assessment`} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 w-fit transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Volver al Centro de Evaluación
      </Link>

      <header className="mb-10 relative z-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
            <FileText className="w-8 h-8 text-indigo-400" /> Informe Ejecutivo (ABA)
          </h1>
          <p className="text-slate-400 mt-2 text-lg font-light">
            {report.executive_summary.split('\n')[0]}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Maturity Score</p>
          <p className="text-5xl font-light text-indigo-400">{globalScore}<span className="text-2xl text-slate-500">/100</span></p>
        </div>
      </header>

      {/* Labeled Data Context Panel */}
      <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-xl">
          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Dato Declarado</p>
          {report.labeled_data.declared.map((t, i) => <p key={i} className="text-sm text-slate-300 font-light">• {t}</p>)}
        </div>
        <div className="bg-indigo-900/20 border border-indigo-500/20 p-4 rounded-xl">
          <p className="text-xs font-bold text-indigo-400 uppercase mb-2">Hipótesis</p>
          {report.labeled_data.hypothesis.map((t, i) => <p key={i} className="text-sm text-slate-300 font-light">• {t}</p>)}
        </div>
        <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl">
          <p className="text-xs font-bold text-emerald-400 uppercase mb-2">Proyección</p>
          {report.labeled_data.projection.map((t, i) => <p key={i} className="text-sm text-slate-300 font-light">• {t}</p>)}
        </div>
        <div className="bg-amber-900/20 border border-amber-500/20 p-4 rounded-xl">
          <p className="text-xs font-bold text-amber-400 uppercase mb-2">Benchmark Sector</p>
          {report.labeled_data.benchmark.map((t, i) => <p key={i} className="text-sm text-slate-300 font-light">• {t}</p>)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 mb-8">
        {/* Radar Chart */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl flex flex-col items-center justify-center">
          <h3 className="text-xl font-light text-white mb-8 self-start flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> Readiness Radar
          </h3>
          <RadarChart data={radarData} />
        </div>

        {/* Heatmap / Score list */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-8 rounded-3xl flex flex-col">
          <h3 className="text-xl font-light text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Índices Calculados
          </h3>
          <div className="space-y-4 flex-1">
            {radarData.sort((a, b) => a.score - b.score).map((d) => (
              <div key={d.category} className="bg-slate-950/50 border border-slate-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-slate-200">{d.category}</span>
                  <span className={`text-sm font-bold ${
                    d.score < 50 ? 'text-rose-400' : d.score < 80 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>{d.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${
                    d.score < 50 ? 'bg-rose-500' : d.score < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} style={{ width: `${d.score}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {scores.find(s => s.index_name === d.category)?.formula_explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Recomendado */}
      <h2 className="text-2xl font-light mb-6 flex items-center gap-2 relative z-10">
        <Zap className="w-6 h-6 text-amber-400" />
        Roadmap de Implantación (Recomendaciones)
      </h2>

      {recommendations.length === 0 ? (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-2xl text-center relative z-10">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl text-white mb-2">Organización Optimizada</h3>
          <p className="text-emerald-200/70">No se requiere intervención prioritaria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10 mb-12">
          {recommendations.map((rec, i) => (
            <div key={rec.id} className="bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 rounded-2xl flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              
              <div className="flex justify-between items-start mb-4 pl-2">
                <span className="text-xs font-bold px-2 py-1 bg-slate-800 text-slate-300 rounded uppercase tracking-wider">Prioridad {i + 1}</span>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${
                  rec.type === 'Employee Designer' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                  rec.type === 'Integration Hub' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  rec.type === 'ABVL' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {rec.type}
                </span>
              </div>
              
              <h3 className="text-lg font-medium text-white mb-2 pl-2">{rec.title}</h3>
              <p className="text-sm text-slate-400 mb-6 pl-2 flex-grow">{rec.description}</p>
              
              <div className="pl-2 pt-4 border-t border-slate-800/50 mt-auto">
                <p className="text-xs text-slate-500 mb-1">Viabilidad de Conexión</p>
                <p className={`text-sm font-medium ${
                  rec.viability === 'AVAILABLE' ? 'text-emerald-400' :
                  rec.viability === 'DEMO_ONLY' ? 'text-amber-400' : 'text-rose-400'
                }`}>{rec.viability}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Human Review Transfer Section */}
      {!report.is_reviewed && (
        <div className="bg-indigo-900/30 border border-indigo-500/30 p-8 rounded-3xl relative z-10 flex items-center justify-between">
          <div>
            <h3 className="text-xl text-white font-medium mb-1">Revisión Humana Obligatoria</h3>
            <p className="text-slate-400">Antes de presentar el Assessment al Prospecto o transferirlo al área de Discovery, debe ser revisado y aprobado.</p>
          </div>
          <form action={async () => {
            'use server';
            await approveAndTransferAssessment(assessmentId);
          }}>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors">
              Aprobar y Transferir a Discovery
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
