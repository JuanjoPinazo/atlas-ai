import { Building2 } from 'lucide-react';
import { BusinessStudioApp } from './_components/BusinessStudioApp';
import { DiscoveryRepository } from '@/lib/repositories/discovery';
import { AssessmentRepositoryFactory } from '@/lib/repositories/assessment/assessment.factory';

export default async function BusinessStudioPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  
  // Try to load initial data from Discovery/Assessment to preload Business Studio
  let initialData = null;
  try {
    const repo = AssessmentRepositoryFactory.getRepository();
    const sessionRes = await repo.getLatestSession(tenantId);
    if (sessionRes.data) {
      const result = await DiscoveryRepository.getDiscoveryResultFromAssessment(sessionRes.data.id);
      initialData = {
        companyName: result.clinic_name || 'Clínica Demo',
        industry: 'Dental',
        domains: result.recommended_packs.length > 0 ? result.recommended_packs : ['Atención al Paciente', 'Operaciones'],
        policies: [],
        agentName: 'Atlas',
        agentRole: result.recommended_employees?.[0]?.role || 'Asistente Principal'
      };
    }
  } catch (e) {
    console.error("Could not preload data for Business Studio", e);
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 lg:mb-12">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 lg:w-10 lg:h-10 text-indigo-500" />
            Business Studio
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Configura el ADN de tu empresa. Crearemos el Company Brain, los Dominios y tu primer Empleado Digital en cuestión de minutos.
          </p>
        </header>

        <BusinessStudioApp initialData={initialData} />
      </div>
    </div>
  );
}
