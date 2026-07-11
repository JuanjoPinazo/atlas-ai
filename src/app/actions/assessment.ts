"use server";

import { AssessmentRepositoryFactory } from '@/lib/repositories/assessment/assessment.factory';
import { AssessmentEngine } from '@/lib/assessment/AssessmentEngine';
import { ReportGenerator } from '@/lib/assessment/ReportGenerator';
import { OpportunityGenerator } from '@/lib/assessment/OpportunityGenerator';
import { AssessmentAnswer } from '@/lib/schemas/assessment';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const DEFAULT_TENANT = '00000000-0000-0000-0000-000000000000';

export async function getLatestAssessment() {
  const repo = AssessmentRepositoryFactory.getRepository();
  return await repo.getLatestSession(DEFAULT_TENANT);
}

export async function getAssessmentTemplate() {
  const repo = AssessmentRepositoryFactory.getRepository();
  return await repo.getTemplateAndQuestions('1.0.0');
}

export async function getAssessmentAnswers(sessionId: string) {
  const repo = AssessmentRepositoryFactory.getRepository();
  return await repo.getSessionAnswers(sessionId);
}

export async function startAssessment() {
  const repo = AssessmentRepositoryFactory.getRepository();
  const template = await repo.getTemplateAndQuestions('1.0.0');
  
  const res = await repo.createSession(DEFAULT_TENANT, template.versionId);
  revalidatePath(`/[tenantId]/assessment`);
  return res;
}

export async function saveAnswer(answer: Omit<AssessmentAnswer, 'id' | 'created_at' | 'updated_at'>) {
  const repo = AssessmentRepositoryFactory.getRepository();
  await repo.saveAnswer(answer);
  return { success: true };
}

export async function finishAssessment(sessionId: string) {
  const repo = AssessmentRepositoryFactory.getRepository();
  const template = await repo.getTemplateAndQuestions('1.0.0');
  const sessionRes = await repo.getLatestSession(DEFAULT_TENANT);
  const answersRes = await repo.getSessionAnswers(sessionId);
  
  if (!sessionRes.data || !answersRes.data) return { data: null, error: 'Session not found' };

  const scores = AssessmentEngine.calculateScores(template.questions, answersRes.data, sessionId);
  const opportunities = OpportunityGenerator.generate(template.questions, answersRes.data, sessionId);
  const recommendations = AssessmentEngine.generateRecommendations(template.questions, answersRes.data, sessionId);
  
  const report = ReportGenerator.generateReport(
    sessionRes.data,
    scores,
    recommendations,
    opportunities
  );

  await repo.finishSession(sessionId, scores, recommendations, report);
  
  revalidatePath(`/[tenantId]/assessment`);
  return { data: sessionRes.data, error: null };
}

export async function getAssessmentReport(sessionId: string) {
  const repo = AssessmentRepositoryFactory.getRepository();
  return await repo.getReport(sessionId);
}

export async function approveAndTransferAssessment(sessionId: string) {
  const repo = AssessmentRepositoryFactory.getRepository();
  const reportData = await repo.getReport(sessionId);
  
  if (!reportData.data) {
    throw new Error('Report not found');
  }

  // Update report to reviewed
  const { report } = reportData.data;
  report.is_reviewed = true;
  
  // Here we would do: await repo.updateReport(report);
  // Then we simulate creating the real Discovery entities
  // And redirecting to Discovery. We just trigger revalidation for now.
  
  revalidatePath(`/[tenantId]/assessment/results/${sessionId}`);
  redirect(`/${DEFAULT_TENANT}/discovery`);
}
