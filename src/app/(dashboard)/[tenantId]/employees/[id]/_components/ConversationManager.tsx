"use client";

import React from 'react';
import { MessageSquarePlus, MessageSquare, Clock } from 'lucide-react';
import { ChatSession } from './useConversationManager';

interface Props {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
}

export function ConversationManager({ sessions, currentSessionId, onSelectSession, onNewSession }: Props) {
  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 dark:text-white">Conversaciones</h3>
        <button 
          onClick={onNewSession}
          className="p-2 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
          title="Nuevo Chat"
        >
          <MessageSquarePlus className="w-5 h-5" />
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {sessions.length === 0 ? (
          <div className="text-center p-4 text-sm text-slate-500 italic mt-10">
            No hay conversaciones previas.
          </div>
        ) : (
          sessions.map(session => {
            const isActive = session.id === currentSessionId;
            return (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                  isActive 
                    ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700' 
                    : 'hover:bg-slate-200/50 dark:hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <MessageSquare className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate font-medium ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>
                    {session.title}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(session.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

    </div>
  );
}
