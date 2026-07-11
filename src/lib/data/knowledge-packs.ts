export interface KnowledgePack {
  id: string;
  name: string;
  vertical: string;
  description: string;
  icon: string;
  color: string;
  metrics: {
    rules: number;
    documents: number;
    agents: number;
  };
  includes: {
    agentName: string;
    agentRole: string;
    companyName: string;
    dnaRules: { id: string; category: string; content: string; active: boolean }[];
  };
}

export const VERTICALS = ['Todos', 'Salud', 'Legal', 'Retail', 'Real Estate'];

export const KNOWLEDGE_PACKS: KnowledgePack[] = [
  {
    id: 'pack_dental_01',
    name: 'Atlas Dental Intelligence',
    vertical: 'Salud',
    description: 'El cerebro perfecto para clínicas dentales modernas. Incluye gestión de citas, urgencias odontológicas, explicación de tratamientos y políticas de cancelación.',
    icon: 'Stethoscope',
    color: 'emerald',
    metrics: {
      rules: 42,
      documents: 15,
      agents: 1
    },
    includes: {
      agentName: 'Atlas Clínico',
      agentRole: 'Recepcionista y Asesor Dental',
      companyName: 'Clínica Dental Premium',
      dnaRules: [
        { id: 'd1', category: 'limit', content: 'No dar diagnósticos médicos definitivos. Derivar siempre al odontólogo.', active: true },
        { id: 'd2', category: 'priority', content: 'Priorizar citas en el mismo día si el paciente menciona dolor agudo o sangrado.', active: true },
        { id: 'd3', category: 'value', content: 'Trato extremadamente empático y calmado ante fobias dentales.', active: true },
        { id: 'd4', category: 'limit', content: 'Política de cancelación: Penalización si se cancela con menos de 24h (excepto urgencias justificadas).', active: true }
      ]
    }
  },
  {
    id: 'pack_legal_01',
    name: 'Atlas Legal Assistant',
    vertical: 'Legal',
    description: 'Orientado a despachos de abogados. Preconfigurado para triaje inicial de casos de derecho laboral y civil.',
    icon: 'Scale',
    color: 'slate',
    metrics: {
      rules: 85,
      documents: 40,
      agents: 2
    },
    includes: {
      agentName: 'Atlas Legal',
      agentRole: 'Asistente Paralegal',
      companyName: 'Despacho de Abogados Asociados',
      dnaRules: [
        { id: 'l1', category: 'limit', content: 'No garantizar resultados de juicios bajo ninguna circunstancia.', active: true }
      ]
    }
  },
  {
    id: 'pack_retail_01',
    name: 'Atlas E-Commerce Pro',
    vertical: 'Retail',
    description: 'Motor de ventas y atención al cliente. Políticas de devolución (30 días), reembolsos y tracking de envíos integradas.',
    icon: 'ShoppingBag',
    color: 'indigo',
    metrics: {
      rules: 25,
      documents: 5,
      agents: 1
    },
    includes: {
      agentName: 'Atlas Shopper',
      agentRole: 'Asesor de Ventas',
      companyName: 'Tienda Premium Online',
      dnaRules: [
        { id: 'r1', category: 'priority', content: 'Intentar cambiar el producto por otro en lugar de procesar reembolso directo.', active: true }
      ]
    }
  }
];
