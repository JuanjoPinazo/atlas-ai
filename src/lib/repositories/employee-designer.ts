import { DigitalEmployeeProfile, OrgNode } from '../schemas/employee-designer';

export class EmployeeDesignerRepository {
  static async getDigitalEmployees(): Promise<DigitalEmployeeProfile[]> {
    return [
      {
        id: 'emp-1',
        name: 'Dra. Aida',
        specialty: 'Asistente de Rescates y Recuperación',
        mission: 'Identificar presupuestos estancados y reenganchar pacientes inactivos.',
        competencies: ['Negociación empática', 'Seguimiento clínico', 'Resolución de objeciones financieras'],
        tools: ['WhatsApp Business API', 'CRM Dental', 'Módulo de Financiación'],
        permissions: ['Leer Historial', 'Enviar Mensajes Proactivos', 'Crear Citas'],
        objectives: ['Recuperar 20K€ mensuales', 'Reducir no-shows al 2%'],
        kpis: [
          { name: 'Tasa de Recuperación', value: '18%', trend: '+2%' },
          { name: 'CSAT (Satisfacción)', value: '4.8/5', trend: 'Estable' }
        ],
        roi_generated: 45000,
        certifications: ['Atlas Medical Triage v2', 'Certificación Ética Lvl 5'],
        status: 'active',
        training_history: [
          {
            id: 'tr-1',
            course_name: 'Protocolo de Cancelaciones Última Hora',
            version: 'v1.4',
            date_completed: '2026-06-15',
            confidence_level: 98,
            knowledge_domain: 'Agenda'
          },
          {
            id: 'tr-2',
            course_name: 'Argumentario Ortodoncia Invisible',
            version: 'v2.1',
            date_completed: '2026-07-01',
            confidence_level: 95,
            knowledge_domain: 'Ventas'
          }
        ]
      },
      {
        id: 'emp-2',
        name: 'Dr. Leo',
        specialty: 'Triaje Clínico y Atención 24/7',
        mission: 'Atender urgencias fuera de horario y cualificar leads fríos.',
        competencies: ['Clasificación de urgencias', 'Captación de leads', 'Gestión de ansiedad dental'],
        tools: ['Web Chatbot', 'WhatsApp', 'Protocolo Médico Base'],
        permissions: ['Leer Agenda', 'Derivar a Urgencias (Humano)'],
        objectives: ['Atender el 100% de leads nocturnos', 'Agendar primeras visitas automáticamente'],
        kpis: [
          { name: 'Leads Cualificados', value: '140/mes', trend: '+15%' },
          { name: 'Tiempo Respuesta', value: '< 2s', trend: 'Estable' }
        ],
        roi_generated: 12500,
        certifications: ['Atlas Dental Ontology v1', 'Protocolo Urgencias'],
        status: 'active',
        training_history: [
          {
            id: 'tr-3',
            course_name: 'Manejo de Dolor Agudo (Ontología)',
            version: 'v1.0',
            date_completed: '2026-05-10',
            confidence_level: 100,
            knowledge_domain: 'Clínico'
          }
        ]
      }
    ];
  }

  static async getOrgChart(): Promise<OrgNode> {
    return {
      id: 'org-root',
      name: 'Dr. Martínez',
      role: 'Director Médico y CEO',
      type: 'human',
      children: [
        {
          id: 'org-clinical',
          name: 'Dra. López',
          role: 'Directora Clínica',
          type: 'human',
          children: []
        },
        {
          id: 'org-operations',
          name: 'Carmen',
          role: 'Coordinadora de Pacientes',
          type: 'human',
          children: [
            {
              id: 'emp-1',
              name: 'Dra. Aida',
              role: 'Asistente de Rescates (IA)',
              type: 'digital',
              children: []
            },
            {
              id: 'emp-2',
              name: 'Dr. Leo',
              role: 'Triaje 24/7 (IA)',
              type: 'digital',
              children: []
            }
          ]
        }
      ]
    };
  }
}
