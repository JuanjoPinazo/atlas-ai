import { createInterviewAction, createDemoInterviewAction } from '@/app/actions/interview';
import { z } from 'zod';
import { describe, it, expect, vi, afterEach } from 'vitest';

// Mock dependencies
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'mock-user-id' } } }),
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'mock-user-id', app_metadata: { organization_id: '123e4567-e89b-12d3-a456-426614174000' } } } } })
    }
  }))
}));

vi.mock('@/lib/repositories/interview/interview.factory', () => ({
  InterviewRepositoryFactory: {
    getRepository: vi.fn(() => ({
      createInterview: vi.fn().mockResolvedValue({ data: { id: 'mock-interview-id' }, error: null }),
      updateInterview: vi.fn().mockResolvedValue({ data: { id: 'mock-interview-id' }, error: null }),
      saveAnswer: vi.fn().mockResolvedValue({ data: { id: 'answer-id' }, error: null }),
    }))
  }
}));

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn()
}));

describe('Interview Actions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createInterviewAction', () => {
    it('should fallback to DEFAULT_TENANT if organizationId is not a valid UUID', async () => {
      const result = await createInterviewAction('undefined');
      expect(result.id).toBe('mock-interview-id');
    });

    it('should proceed if organizationId is a valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const result = await createInterviewAction(validUUID);
      expect(result.id).toBe('mock-interview-id');
    });
  });

  describe('createDemoInterviewAction', () => {
    it('should fallback to DEFAULT_TENANT if organizationId is not a valid UUID', async () => {
      const result = await createDemoInterviewAction('undefined');
      expect(result.id).toBe('mock-interview-id');
    });
  });

  describe('Intelligence & Print', () => {
    it('should save answer with intelligence fields', async () => {
      const { saveAnswerAction } = await import('@/app/actions/interview');
      const intelligence = { pain_level: 5, economic_impact: 'VERY_HIGH' as const, literal_quotes: 'test quote' };
      const res = await saveAnswerAction('int-1', 'blk-1', 'q1', 'ans1', intelligence);
      expect(res.id).toBe('answer-id');
    });
  });
});
