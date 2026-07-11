'use server';

import { InterviewRepositoryFactory } from '@/lib/repositories/interview/interview.factory';
import { DiscoveryInterview, DiscoveryInterviewAnswer } from '@/lib/schemas/interview';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

const DEFAULT_TENANT = '00000000-0000-0000-0000-000000000000';

async function checkAccess(orgId: string, supabaseClient: any) {
  if (orgId === DEFAULT_TENANT) return true; // DEMO / Fallback is always allowed for now

  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) return false;

  const jwtOrgId = session.user.app_metadata?.organization_id;
  const userOrgId = jwtOrgId || session.user.id || DEFAULT_TENANT;

  return orgId === userOrgId;
}

import { z } from 'zod';

const UUIDSchema = z.string().uuid("Formato UUID inválido");

export async function createInterviewAction(organizationId: string) {
  // Validamos que el param no sea 'undefined' string u otro error silencioso
  let validOrgId = organizationId;
  if (!UUIDSchema.safeParse(organizationId).success) {
    console.warn(`[Atlas Discovery] organizationId no válido (${organizationId}), usando DEFAULT_TENANT.`);
    validOrgId = DEFAULT_TENANT;
  }

  const supabase = await createClient();
  const hasAccess = await checkAccess(validOrgId, supabase);
  if (!hasAccess) {
    throw new Error(`[Atlas Discovery] Acceso denegado a la organización: ${validOrgId}`);
  }

  const { data: { user } } = await supabase.auth.getUser();

  console.log("[Interview Create] Payload:", {
    tenantId: organizationId,
    organizationId: validOrgId,
    createdByPresent: !!user?.id
  });

  const repo = InterviewRepositoryFactory.getRepository();
  const res = await repo.createInterview({
    organizationId: validOrgId,
    createdBy: user?.id ?? null,
  });
  
  if (res.error) throw new Error(res.error);
  
  revalidatePath(`/${validOrgId}/discovery-interview`);
  return res.data!;
}

export async function updateInterviewAction(id: string, updates: Partial<DiscoveryInterview>) {
  const repo = InterviewRepositoryFactory.getRepository();
  const res = await repo.updateInterview(id, updates);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function saveAnswerAction(
  interviewId: string,
  blockId: string,
  questionKey: string,
  answerText: string,
  intelligence?: any
) {
  const repo = InterviewRepositoryFactory.getRepository();
  const res = await repo.saveAnswer(interviewId, blockId, questionKey, answerText, intelligence);
  if (res.error) throw new Error(res.error);
  return res.data!;
}

export async function getInterviewWithAnswersAction(id: string) {
  const repo = InterviewRepositoryFactory.getRepository();
  const [interviewRes, answersRes] = await Promise.all([
    repo.getInterview(id),
    repo.getAnswers(id)
  ]);

  if (interviewRes.error) throw new Error(interviewRes.error);
  if (answersRes.error) throw new Error(answersRes.error);

  return {
    interview: interviewRes.data as DiscoveryInterview,
    answers: answersRes.data as DiscoveryInterviewAnswer[]
  };
}

export async function createDemoInterviewAction(organizationId: string) {
  let validOrgId = organizationId;
  if (!UUIDSchema.safeParse(organizationId).success) {
    console.warn(`[Atlas Discovery] organizationId no válido para DEMO (${organizationId}), usando DEFAULT_TENANT.`);
    validOrgId = DEFAULT_TENANT;
  }

  const supabase = await createClient();
  const hasAccess = await checkAccess(validOrgId, supabase);
  if (!hasAccess) {
    throw new Error(`[Atlas Discovery] Acceso denegado a la organización para DEMO: ${validOrgId}`);
  }
  const { data: { user } } = await supabase.auth.getUser();

  const repo = InterviewRepositoryFactory.getRepository();
  const interviewRes = await repo.createInterview({
    organizationId: validOrgId,
    createdBy: user?.id ?? null,
  });
  
  if (interviewRes.error) throw new Error(interviewRes.error);

  const interviewId = interviewRes.data!.id;

  // Update header for DEMO
  await repo.updateInterview(interviewId, {
    clinic_name: 'CLÍNICA DEMO - Dental Advance',
    interviewee_name: 'Dra. Elena García',
    interviewee_role: 'Propietaria y Directora Médica',
    consultant_name: 'Consultor Atlas',
    general_notes: 'Esta es una entrevista generada automáticamente para probar la interfaz y el resumen.'
  });

  // Insert fake answers
  await repo.saveAnswer(interviewId, 'BLOCK_1', 'q1_datos', '3 clínicas, 12 gabinetes en total. 4 Doctores fijos y 8 colaboradores. 6 higienistas. 80-100 pacientes al día.');
  await repo.saveAnswer(interviewId, 'BLOCK_1', 'q1_software', 'Usamos Gesden y Nemo.', { ideas: 'Posible integración con Gesden Cloud' });
  await repo.saveAnswer(interviewId, 'BLOCK_3', 'q3_dinero', 'Los huecos en la agenda por anulaciones de última hora. Y presupuestos grandes que no se aceptan.', { pain_level: 5, economic_impact: 'CRITICAL', literal_quotes: 'Las anulaciones nos desangran cada mes.' });
  await repo.saveAnswer(interviewId, 'BLOCK_3', 'q3_repetitivas', 'Llamar a los pacientes uno a uno para recordar citas o seguimientos.', { pain_level: 4 });
  await repo.saveAnswer(interviewId, 'BLOCK_3', 'q3_errores', 'A veces a la coordinadora se le olvida hacer el seguimiento a los presupuestos de implantes a los 7 días.', { needs_deep_dive: true });
  await repo.saveAnswer(interviewId, 'BLOCK_9', 'q9_tech', 'Usamos WhatsApp manual, Gesden. Nos gustaría tener todo conectado sin hacer doble trabajo.', { ideas: 'Ofrecer Atlas Communications y Sync' });
  await repo.saveAnswer(interviewId, 'BLOCK_10', 'q10_atlas', 'Que un bot hiciera los seguimientos automáticamente y llenara la agenda.', { literal_quotes: 'Si Atlas me llena los huecos, lo compro mañana.' });
  await repo.saveAnswer(interviewId, 'BLOCK_10', 'q10_cambio', 'Automatización total de la recepción.');
  await repo.saveAnswer(interviewId, 'BLOCK_10', 'q10_precio', 'Si me ahorra el trabajo de media persona, 500€ es barato.');

  revalidatePath(`/${organizationId}/discovery-interview`);
  return interviewRes.data!;
}
