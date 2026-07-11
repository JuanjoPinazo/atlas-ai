"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { saveAnswerAction, updateInterviewAction } from '@/app/actions/interview';
import { DiscoveryInterviewAnswer, InterviewIntelligence, DiscoveryInterview } from '@/lib/schemas/interview';

type SaveStatus = 'IDLE' | 'SAVING' | 'SAVED' | 'ERROR' | 'PENDING_SYNC';

export function useInterviewAnswer(
  interviewId: string, 
  blockId: string, 
  questionKey: string,
  initialData?: DiscoveryInterviewAnswer
) {
  const [answerText, setAnswerText] = useState(initialData?.answer_text || '');
  const [intelligence, setIntelligence] = useState<InterviewIntelligence>(initialData?.intelligence || {});
  const [status, setStatus] = useState<SaveStatus>('IDLE');
  
  const latestAnswerText = useRef(answerText);
  const latestIntelligence = useRef(intelligence);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const draftKey = `atlas_draft_${interviewId}_${questionKey}`;

  useEffect(() => {
    // On mount, check if there's a pending offline draft
    try {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        const parsed = JSON.parse(draft);
        setAnswerText(parsed.answerText);
        setIntelligence(parsed.intelligence);
        setStatus('PENDING_SYNC'); // Indicates there is pending unsaved data
      }
    } catch (e) {
      console.error("Failed to load draft", e);
    }
  }, [draftKey]);

  useEffect(() => {
    latestAnswerText.current = answerText;
    latestIntelligence.current = intelligence;
  }, [answerText, intelligence]);

  const save = useCallback(async () => {
    setStatus('SAVING');
    try {
      await saveAnswerAction(
        interviewId,
        blockId,
        questionKey,
        latestAnswerText.current,
        latestIntelligence.current
      );
      setStatus('SAVED');
      localStorage.removeItem(draftKey); // Clear draft on success
    } catch (e) {
      console.error("Error auto-saving answer", e);
      setStatus('ERROR');
      // Persist to local storage as fallback
      localStorage.setItem(draftKey, JSON.stringify({
        answerText: latestAnswerText.current,
        intelligence: latestIntelligence.current
      }));
    }
  }, [interviewId, blockId, questionKey, draftKey]);

  const triggerAutoSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    setStatus('SAVING');
    saveTimeoutRef.current = setTimeout(() => {
      save();
    }, 1500);
  }, [save]);

  const updateAnswerText = (text: string) => {
    setAnswerText(text);
    triggerAutoSave();
  };

  const updateIntelligence = (newIntel: Partial<InterviewIntelligence>) => {
    setIntelligence(prev => ({ ...prev, ...newIntel }));
    triggerAutoSave();
  };

  return {
    answerText,
    intelligence,
    status,
    updateAnswerText,
    updateIntelligence,
    forceSave: save
  };
}

export function useInterviewHeader(
  interviewId: string,
  initialData: DiscoveryInterview
) {
  const [headerData, setHeaderData] = useState<DiscoveryInterview>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAutoSave = useCallback((updates: Partial<DiscoveryInterview>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await updateInterviewAction(interviewId, updates);
      } catch (e) {
        console.error("Error auto-saving header", e);
      } finally {
        setIsSaving(false);
      }
    }, 1500);
  }, [interviewId]);

  const updateHeader = (updates: Partial<DiscoveryInterview>) => {
    setHeaderData(prev => ({ ...prev, ...updates }));
    triggerAutoSave(updates);
  };

  return {
    headerData,
    isSaving,
    updateHeader
  };
}
