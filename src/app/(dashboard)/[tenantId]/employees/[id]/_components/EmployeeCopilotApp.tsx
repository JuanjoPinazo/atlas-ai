"use client";

import React, { useState } from 'react';
import { ConversationManager } from './ConversationManager';
import { ChatInterface } from './ChatInterface';
import { ExplainabilityPanel } from './ExplainabilityPanel';
import { useConversationManager } from './useConversationManager';
import { MockProvider } from '@/lib/services/llm/mock.adapter';
import { ExplainabilityTrace } from '@/lib/services/llm/llm-provider.interface';

const llmProvider = new MockProvider();

export function EmployeeCopilotApp() {
  const { 
    sessions, 
    currentSession, 
    currentSessionId, 
    setCurrentSessionId, 
    startNewSession, 
    addMessage, 
    updateMessage,
    isLoaded
  } = useConversationManager();

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [selectedTrace, setSelectedTrace] = useState<ExplainabilityTrace | undefined>(undefined);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

  if (!isLoaded) return <div className="h-full flex items-center justify-center">Cargando...</div>;

  const handleSendMessage = async (content: string) => {
    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      startNewSession();
      // the state update is asynchronous, so we wait or handle it carefully. 
      // For simplicity in this demo, if no session, we create one and use it immediately.
      // Wait a tick for react state to settle if needed, or better, we can assume startNewSession is instant enough.
      // Actually, since we need the ID immediately, we'll generate one here if null:
    }
    
    // In a real app we'd handle the new session ID better, but let's assume one exists or we create one
    const newSessionId = activeSessionId || Math.random().toString(36).substr(2, 9);
    if (!activeSessionId) {
      // Small hack: if no session, we create the state directly or just use the generated ID
      setCurrentSessionId(newSessionId);
    }

    // 1. Add User Message
    addMessage(newSessionId, { role: 'user', content });
    
    setIsStreaming(true);
    setStreamingText('');

    const sessionMessages = currentSession?.messages || [];
    const allMessages = [...sessionMessages, { id: 'temp', role: 'user' as const, content, createdAt: new Date() }];

    await llmProvider.streamChat(allMessages, {
      onToken: (token) => {
        setStreamingText(prev => prev + token);
      },
      onTraceUpdate: (trace) => {
        setSelectedTrace(prev => prev ? { ...prev, ...trace } as ExplainabilityTrace : trace as ExplainabilityTrace);
      },
      onComplete: (fullMessage, trace) => {
        setIsStreaming(false);
        setStreamingText('');
        addMessage(newSessionId, { role: 'assistant', content: fullMessage }, trace);
        setSelectedTrace(trace);
      },
      onError: (err) => {
        setIsStreaming(false);
        console.error(err);
      }
    });
  };

  const activeMessages = currentSession?.messages || [];
  const activeTraces = currentSession?.traces || {};

  return (
    <div className="h-[calc(100vh-100px)] w-full flex bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      
      {/* Left Panel: Conversation Manager */}
      <div className="w-64 flex-shrink-0 hidden lg:block">
        <ConversationManager 
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={setCurrentSessionId}
          onNewSession={startNewSession}
        />
      </div>

      {/* Center Panel: Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface 
          messages={activeMessages}
          isStreaming={isStreaming}
          streamingText={streamingText}
          onSendMessage={handleSendMessage}
          onSelectMessage={(trace) => {
            setSelectedTrace(trace);
            // find msg id by trace 
            const msgId = Object.keys(activeTraces).find(key => activeTraces[key] === trace);
            setSelectedMessageId(msgId || null);
          }}
          traces={activeTraces}
          selectedMessageId={selectedMessageId}
        />
      </div>

      {/* Right Panel: Explainability */}
      <div className="w-[350px] xl:w-[400px] flex-shrink-0 hidden md:block">
        <ExplainabilityPanel trace={selectedTrace} />
      </div>

    </div>
  );
}
