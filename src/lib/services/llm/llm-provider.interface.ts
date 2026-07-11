export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ExplainabilityTrace {
  contextSources: string[];
  appliedRules: string[];
  decisionState: 'COMPLETED' | 'POLICY_CONFLICT' | 'HUMAN_APPROVAL';
  validationPassed: boolean;
  finalPrompt?: string;
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamCallbacks {
  onToken: (token: string) => void;
  onTraceUpdate: (trace: Partial<ExplainabilityTrace>) => void;
  onComplete: (fullMessage: string, trace: ExplainabilityTrace) => void;
  onError: (error: any) => void;
}

export interface LLMProvider {
  /**
   * Initializes the chat stream for a specific provider.
   */
  streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void>;
}
