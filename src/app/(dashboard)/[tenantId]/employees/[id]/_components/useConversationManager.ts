"use client";

import { useState, useEffect } from 'react';
import { Message, ExplainabilityTrace } from '@/lib/services/llm/llm-provider.interface';

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
  traces: Record<string, ExplainabilityTrace>; // Map message ID to its trace
}

const STORAGE_KEY = 'atlas_conversations';

export function useConversationManager() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSessions(JSON.parse(saved).map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt),
          messages: s.messages.map((m: any) => ({ ...m, createdAt: new Date(m.createdAt) }))
        })));
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  const startNewSession = () => {
    const newSession: ChatSession = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Nueva Conversación',
      createdAt: new Date(),
      messages: [],
      traces: {}
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const addMessage = (sessionId: string, message: Omit<Message, 'id' | 'createdAt'>, trace?: ExplainabilityTrace) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;
      
      const newMessage: Message = { ...message, id: Math.random().toString(36).substr(2, 9), createdAt: new Date() };
      
      // Auto-title generation if it's the first user message
      let newTitle = s.title;
      if (s.messages.length === 0 && message.role === 'user') {
        newTitle = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
      }

      const newTraces = trace ? { ...s.traces, [newMessage.id]: trace } : s.traces;

      return {
        ...s,
        title: newTitle,
        messages: [...s.messages, newMessage],
        traces: newTraces
      };
    }));
  };

  const updateMessage = (sessionId: string, messageId: string, updates: Partial<Message>, traceUpdate?: Partial<ExplainabilityTrace>) => {
    setSessions(prev => prev.map(s => {
      if (s.id !== sessionId) return s;
      
      const newMessages = s.messages.map(m => m.id === messageId ? { ...m, ...updates } : m);
      const newTraces = traceUpdate && s.traces[messageId] 
        ? { ...s.traces, [messageId]: { ...s.traces[messageId], ...traceUpdate } } 
        : s.traces;

      return { ...s, messages: newMessages, traces: newTraces };
    }));
  };

  return {
    sessions,
    currentSession,
    currentSessionId,
    setCurrentSessionId,
    startNewSession,
    addMessage,
    updateMessage,
    isLoaded
  };
}
