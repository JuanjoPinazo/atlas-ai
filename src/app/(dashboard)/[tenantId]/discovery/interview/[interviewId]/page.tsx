import React from 'react';
import { InterviewWizardClient } from './_components/InterviewWizardClient';
import { getInterviewWithAnswersAction } from '@/app/actions/interview';

export default async function InterviewWizardPage({ 
  params 
}: { 
  params: Promise<{ tenantId: string; interviewId: string }> 
}) {
  const { tenantId, interviewId } = await params;

  try {
    const data = await getInterviewWithAnswersAction(interviewId);
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
        <InterviewWizardClient 
          tenantId={tenantId}
          interviewId={interviewId}
          initialInterview={data.interview}
          initialAnswers={data.answers}
        />
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="p-8 text-center text-red-500">
        Error cargando la entrevista. Verifica que exista y tengas acceso.
      </div>
    );
  }
}
