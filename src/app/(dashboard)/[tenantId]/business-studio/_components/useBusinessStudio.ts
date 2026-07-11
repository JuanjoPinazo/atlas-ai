"use client";

import { useState, useEffect } from 'react';

export interface BusinessStudioState {
  currentStep: number;
  companyName: string;
  industry: string;
  domains: string[];
  policies: string[];
  agentName: string;
  agentRole: string;
  agentTone: string;
  agentAvatar: string;
}

const DEFAULT_STATE: BusinessStudioState = {
  currentStep: 1,
  companyName: '',
  industry: '',
  domains: [],
  policies: [],
  agentName: 'Atlas',
  agentRole: 'Asistente Principal',
  agentTone: 'Profesional',
  agentAvatar: '🤖',
};

const STORAGE_KEY = 'atlas_business_studio_state';

export function useBusinessStudio() {
  const [state, setState] = useState<BusinessStudioState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setState(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateState = (updates: Partial<BusinessStudioState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.min(prev.currentStep + 1, 5) }));
  };

  const prevStep = () => {
    setState(prev => ({ ...prev, currentStep: Math.max(prev.currentStep - 1, 1) }));
  };

  const resetState = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  };

  return {
    state,
    isLoaded,
    updateState,
    nextStep,
    prevStep,
    resetState,
  };
}
