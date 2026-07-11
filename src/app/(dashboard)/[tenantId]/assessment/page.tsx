import { getLatestAssessment } from '@/app/actions/assessment';
import { PageHelpPanel } from '@/components/ui/help/PageHelpPanel';
import { Stethoscope, ArrowRight, Activity, TrendingUp, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { AssessmentClientActions } from './AssessmentClientActions';

export default async function AssessmentCenterPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  const { data: latest } = await getLatestAssessment();

  return (
    <div className="flex flex-col min-h-screen relative max-w-7xl mx-auto py-8 px-6 pb-24 font-sans text-slate-100">
      <header className="mb-8 relative z-10">
        <h1 className="text-4xl font-light text-white tracking-tight flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-indigo-400" />
          Assessment Center
        </h1>
        <p className="text-slate-400 mt-2 text-lg font-light max-w-2xl">
          Diagnóstico de madurez digital. Evalúa las operaciones, experiencia del paciente y capacidades comerciales para obtener un roadmap de implantación.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {!latest ? (
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-12 text-center flex flex-col items-center">
              <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
                <Activity className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="text-2xl font-light text-white mb-2">No hay diagnósticos previos</h3>
              <p className="text-slate-400 max-w-md mb-8">
                Inicia una nueva evaluación para descubrir dónde están tus mayores oportunidades de automatización y crecimiento.
              </p>
              <AssessmentClientActions tenantId={tenantId} />
            </div>
          ) : (
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-3xl p-8 flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-light text-white mb-1">Última Evaluación</h3>
                  <p className="text-slate-400">Realizada el {new Date(latest.started_at).toLocaleDateString()}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${latest.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                  {latest.status === 'COMPLETED' ? 'COMPLETADO' : 'EN PROGRESO'}
                </div>
              </div>

              {latest.status === 'COMPLETED' ? (
                <div className="flex items-center gap-6 mb-8 p-6 bg-slate-950/50 rounded-2xl border border-slate-800">
                  <div className="text-center">
                    <p className="text-sm text-slate-500 mb-1">Diagnóstico finalizado</p>
                    <p className="text-2xl font-light text-white">Haz clic en Ver Resultados para acceder al informe ejecutivo.</p>
                  </div>
                </div>
              ) : (
                <div className="mb-8">
                  <p className="text-slate-400 mb-4">Tienes una evaluación pendiente de terminar.</p>
                </div>
              )}

              <div className="flex gap-4 mt-auto">
                {latest.status === 'COMPLETED' ? (
                  <>
                    <Link href={`/${tenantId}/assessment/results/${latest.id}`} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                      Ver Resultados <ArrowRight className="w-4 h-4" />
                    </Link>
                    <AssessmentClientActions tenantId={tenantId} label="Nueva Evaluación" variant="secondary" />
                  </>
                ) : (
                  <Link href={`/${tenantId}/assessment/wizard`} className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-xl transition-colors flex items-center gap-2">
                    Continuar Evaluación <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Impacto Esperado
            </h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Roadmap de implantación</p>
                  <p className="text-xs text-slate-400 mt-0.5">Qué instalar primero y por qué.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Recomendaciones ROI</p>
                  <p className="text-xs text-slate-400 mt-0.5">Detecta fugas de euros exactas.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-slate-200">Automatización adaptada</p>
                  <p className="text-xs text-slate-400 mt-0.5">IA seleccionada según tu clínica.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <PageHelpPanel 
          pageId="assessment_center"
          title="Assessment Center"
          description="Este módulo evalúa tu operativa y crea un plan de acción para desplegar la Inteligencia Artificial donde más impacto genere."
          roiImpact="Acelera el time-to-value (TTV) al evitar implantar tecnología donde el proceso manual ya funciona bien, enfocándose en los cuellos de botella."
        />
      </div>
    </div>
  );
}
