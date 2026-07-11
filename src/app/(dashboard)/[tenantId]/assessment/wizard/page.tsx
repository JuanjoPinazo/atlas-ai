import { getLatestAssessment, getAssessmentTemplate } from '@/app/actions/assessment';
import { Stethoscope, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { WizardClient } from './WizardClient';

export default async function AssessmentWizardPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  const { data: latest } = await getLatestAssessment();

  if (!latest || latest.status === 'COMPLETED') {
    redirect(`/${tenantId}/assessment`);
  }

  const { questions, rules } = await getAssessmentTemplate();

  return (
    <div className="flex flex-col min-h-screen relative max-w-7xl mx-auto py-8 px-6 pb-24 font-sans text-slate-100">
      <Link href={`/${tenantId}/assessment`} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 w-fit transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Guardar y Salir
      </Link>

      <header className="mb-8 relative z-10">
        <h1 className="text-3xl font-light text-white tracking-tight flex items-center gap-3">
          <Stethoscope className="w-7 h-7 text-indigo-400" />
          Auditoría de Madurez
        </h1>
      </header>

      <WizardClient 
        tenantId={tenantId} 
        assessmentId={latest.id} 
        initialAnswers={[]} 
        allQuestions={questions}
        rules={rules}
      />
    </div>
  );
}
