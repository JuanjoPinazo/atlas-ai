"use client";

import { useState, useEffect } from 'react';

export interface DNARule {
  id: string;
  category: 'value' | 'priority' | 'protocol' | 'limit' | 'exception';
  content: string;
  active: boolean;
}

export interface BusinessDNAState {
  rules: DNARule[];
  tone: string;
  attentionPhilosophy: string;
}

const DEFAULT_STATE: BusinessDNAState = {
  rules: [
    { id: '1', category: 'value', content: 'Transparencia total con el cliente', active: true },
    { id: '2', category: 'priority', content: 'Velocidad sobre exhaustividad en primeras respuestas', active: true },
    { id: '3', category: 'limit', content: 'No ofrecer descuentos superiores al 10%', active: true },
    { id: '4', category: 'exception', content: 'Permitir devoluciones sin ticket si el cliente es VIP', active: true },
  ],
  tone: 'Profesional y Empático',
  attentionPhilosophy: 'El cliente siempre debe sentir que está hablando con un humano experto.',
};

const STORAGE_KEY = 'atlas_business_dna_state';

export function useBusinessDNA() {
  const [state, setState] = useState<BusinessDNAState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load DNA state", e);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateState = (updates: Partial<BusinessDNAState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const addRule = (rule: Omit<DNARule, 'id'>) => {
    setState(prev => ({
      ...prev,
      rules: [...prev.rules, { ...rule, id: Math.random().toString(36).substr(2, 9) }]
    }));
  };

  const removeRule = (id: string) => {
    setState(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== id)
    }));
  };

  const toggleRule = (id: string) => {
    setState(prev => ({
      ...prev,
      rules: prev.rules.map(r => r.id === id ? { ...r, active: !r.active } : r)
    }));
  };

  return {
    state,
    isLoaded,
    updateState,
    addRule,
    removeRule,
    toggleRule
  };
}
