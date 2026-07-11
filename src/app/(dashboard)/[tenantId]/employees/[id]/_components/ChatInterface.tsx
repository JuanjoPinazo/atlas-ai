"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User } from 'lucide-react';
import { Message, ExplainabilityTrace } from '@/lib/services/llm/llm-provider.interface';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  messages: Message[];
  isStreaming: boolean;
  streamingText?: string;
  onSendMessage: (content: string) => void;
  onSelectMessage: (trace?: ExplainabilityTrace) => void;
  traces: Record<string, ExplainabilityTrace>;
  selectedMessageId: string | null;
}

export function ChatInterface({ messages, isStreaming, streamingText, onSendMessage, onSelectMessage, traces, selectedMessageId }: Props) {
  const [input, setInput] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    onSendMessage(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 relative">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-60">
            <Bot className="w-16 h-16 mb-4 text-indigo-200" />
            <p className="text-lg">Inicia una conversación con el Empleado Digital</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.role === 'user';
            const hasTrace = !!traces[msg.id];
            const isSelected = selectedMessageId === msg.id;

            return (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                  isUser ? 'bg-indigo-600 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg'
                }`}>
                  {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Bubble Container */}
                <div 
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} cursor-pointer group`}
                  onClick={() => !isUser && hasTrace && onSelectMessage(traces[msg.id])}
                >
                  <div className={`p-4 rounded-2xl relative transition-all ${
                    isUser 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : `bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-sm border ${
                          isSelected ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-slate-200 dark:border-slate-800'
                        }`
                  }`}>
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.content}</p>
                  </div>

                  {/* Explainability Hint */}
                  {!isUser && hasTrace && (
                    <span className={`text-[10px] uppercase font-bold tracking-wider mt-2 transition-opacity ${
                      isSelected ? 'text-indigo-500 opacity-100' : 'text-slate-400 opacity-0 group-hover:opacity-100'
                    }`}>
                      Ver reporte de IA
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
        
        {isStreaming && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-4 max-w-[85%]"
          >
            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
              <Bot className="w-5 h-5" />
            </div>
            <div className="flex flex-col items-start cursor-pointer group">
              <div className="p-4 rounded-2xl relative transition-all bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-sm border border-indigo-500/30">
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
                  {streamingText}
                  <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse align-middle"></span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={endOfMessagesRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={isStreaming ? 'El agente está escribiendo...' : 'Escribe tu mensaje...'}
            disabled={isStreaming}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-5 pr-14 py-4 outline-none focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner"
            rows={2}
          />
          <button 
            type="submit"
            disabled={!input.trim() || isStreaming}
            className="absolute right-3 bottom-3 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-xl flex items-center justify-center transition-colors shadow-lg"
          >
            {isStreaming ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>

    </div>
  );
}
