import { LLMProvider, Message, StreamCallbacks, ExplainabilityTrace } from './llm-provider.interface';

export class MockProvider implements LLMProvider {
  
  async streamChat(messages: Message[], callbacks: StreamCallbacks): Promise<void> {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() || '';
    
    let simulatedResponse = "He analizado tu consulta. Para este caso, siguiendo nuestros protocolos, estaré encantado de ayudarte con la gestión estándar.";
    let simulatedTrace: ExplainabilityTrace = {
      contextSources: ['Manual de Usuario v2.pdf (Score: 0.89)'],
      appliedRules: [],
      decisionState: 'COMPLETED',
      validationPassed: true,
      finalPrompt: `[SYSTEM]: Eres un asistente corporativo.\n[CONTEXT]: Manual de Usuario v2.\n[USER]: ${lastUserMessage}`,
      tokenUsage: { promptTokens: 120, completionTokens: 45, totalTokens: 165 }
    };

    // Try to read DNA state if running in browser
    let dnaLimits: string[] = [];
    if (typeof window !== 'undefined') {
      try {
        const dnaState = localStorage.getItem('atlas_business_dna_state');
        if (dnaState) {
          const parsed = JSON.parse(dnaState);
          dnaLimits = parsed.rules.filter((r: any) => r.category === 'limit' && r.active).map((r: any) => r.content.toLowerCase());
        }
      } catch (e) {}
    }

    // Match scenarios
    if (lastUserMessage.includes('descuento')) {
      const hasDiscountLimit = dnaLimits.some(l => l.includes('descuento') && l.includes('10'));
      if (hasDiscountLimit) {
        simulatedResponse = "Entiendo perfectamente tu situación. Sin embargo, nuestro límite estricto de descuentos está fijado en un máximo del 10% por políticas de empresa. ¿Te gustaría aplicar este descuento?";
        simulatedTrace.decisionState = 'POLICY_CONFLICT';
        simulatedTrace.appliedRules = ["Límite de Descuento (Max 10%)"];
        simulatedTrace.contextSources = ["Política de Precios Corporativa (Score: 0.95)"];
      } else {
        simulatedResponse = "¡Claro! He aplicado el descuento solicitado a tu cuenta.";
      }
    } else if (lastUserMessage.includes('reembolso') || lastUserMessage.includes('ticket')) {
      simulatedResponse = "Lo siento, para procesar un reembolso sin el ticket original necesito derivar tu caso a un supervisor humano.";
      simulatedTrace.decisionState = 'HUMAN_APPROVAL';
      simulatedTrace.appliedRules = ["Protocolo de Escalado (Falta de Ticket)"];
    }

    // Update initial trace
    callbacks.onTraceUpdate(simulatedTrace);

    // Simulate Streaming
    const words = simulatedResponse.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 20)); // Random delay 20-70ms per word
      const token = words[i] + (i === words.length - 1 ? '' : ' ');
      currentText += token;
      callbacks.onToken(token);
    }

    // Complete
    callbacks.onComplete(currentText, simulatedTrace);
  }
}
