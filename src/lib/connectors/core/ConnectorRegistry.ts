import { ConnectorInfo } from '@/lib/schemas/integration';

export class ConnectorRegistry {
  private static connectors: ConnectorInfo[] = [
    {
      id: 'reg-gesden',
      type: 'GESDEN',
      name: 'Gesden',
      description: 'Sincronización completa de pacientes, agendas y facturación clínica.',
      icon: 'Database',
      version: '1.0.0',
      capabilities: ['Pacientes', 'Citas', 'Presupuestos'],
      features: ['Sincronización en tiempo real', 'Importación histórica'],
      roiPotential: 'Alto'
    },
    {
      id: 'reg-wa',
      type: 'WHATSAPP_BUSINESS',
      name: 'WhatsApp Business',
      description: 'Automatización conversacional y recordatorios de citas vía WhatsApp.',
      icon: 'MessageCircle',
      version: '2.1.0',
      capabilities: ['Mensajería', 'Notificaciones'],
      features: ['Respuestas IA', 'Recordatorios automáticos'],
      roiPotential: 'Muy Alto'
    },
    {
      id: 'reg-gcal',
      type: 'GOOGLE_CALENDAR',
      name: 'Google Calendar',
      description: 'Sincroniza agendas personales y de clínica en tiempo real.',
      icon: 'Calendar',
      version: '1.2.0',
      capabilities: ['Eventos', 'Recordatorios'],
      features: ['Sincronización bi-direccional'],
      roiPotential: 'Medio'
    },
    {
      id: 'reg-m365',
      type: 'MICROSOFT_365',
      name: 'Microsoft 365',
      description: 'Integración empresarial con correo, calendario y ofimática M365.',
      icon: 'Mail',
      version: '1.0.5',
      capabilities: ['Email', 'Calendario', 'Contactos'],
      features: ['Lectura de emails', 'Gestión de contactos'],
      roiPotential: 'Alto'
    },
    {
      id: 'reg-stripe',
      type: 'STRIPE',
      name: 'Stripe',
      description: 'Pasarela de pagos, enlaces de cobro online y conciliación bancaria.',
      icon: 'CreditCard',
      version: '3.0.0',
      capabilities: ['Pagos online', 'Facturación'],
      features: ['Generación de links', 'Conciliación'],
      roiPotential: 'Muy Alto'
    },
    {
      id: 'reg-lab',
      type: 'DENTAL_LAB',
      name: 'Laboratorio Dental',
      description: 'Gestión de órdenes de trabajo (OTs) y seguimiento de envíos con laboratorios.',
      icon: 'FlaskConical',
      version: '1.0.0',
      capabilities: ['Órdenes', 'Tracking'],
      features: ['Estado de OTs', 'Avisos de recepción'],
      roiPotential: 'Alto'
    }
  ];

  static getAvailableConnectors(): ConnectorInfo[] {
    return this.connectors;
  }

  static getConnectorInfo(type: string): ConnectorInfo | undefined {
    return this.connectors.find(c => c.type === type);
  }
}
