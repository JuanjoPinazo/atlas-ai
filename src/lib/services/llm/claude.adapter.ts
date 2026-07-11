import { LLMProvider, Message, StreamCallbacks } from './llm-provider.interface';

export class ClaudeAdapter implements LLMProvider {
  async streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    throw new Error('Not implemented. Preparing for Anthropic SDK integration.');
  }
}
