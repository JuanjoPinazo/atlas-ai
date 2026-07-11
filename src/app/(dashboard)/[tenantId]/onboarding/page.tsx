import { BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { InfoCallout } from '@/components/ui/help/InfoCallout';

const STEPS = [
  {
    title: '1. Configurar empresa',
    description: 'Ajusta los detalles básicos de tu negocio y personaliza la plataforma.',
    isCompleted: true
  },
  {
    title: '2. Añadir fuentes',
    description: 'Sube documentos o conecta herramientas donde ya tienes información.',
    isCompleted: false
  },
  {
    title: '3. Crear conocimiento',
    description: 'Transforma la información en reglas claras para que tus Empleados Digitales sepan qué hacer.',
    isCompleted: false
  },
  {
    title: '4. Revisar propuestas',
    description: 'Aprueba lo que los agentes aprendan automáticamente.',
    isCompleted: false
  },
  {
    title: '5. Preparar empleados digitales',
    description: 'Configura a tus asistentes virtuales para que empiecen a trabajar.',
    isCompleted: false
  }
];

export default async function OnboardingPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-indigo-500" />
          Primeros Pasos
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Bienvenido a Atlas AI. Sigue esta guía para poner en marcha a tus Empleados Digitales en pocos minutos.
        </p>
      </div>

      <InfoCallout title="¿Por qué es importante seguir este orden?">
        Los Empleados Digitales necesitan entender tu negocio antes de trabajar. 
        Al añadir tus fuentes de conocimiento primero, podrán dar mejores respuestas y cometer menos errores.
      </InfoCallout>

      <div className="mt-8 space-y-4">
        {STEPS.map((step, index) => (
          <div 
            key={index} 
            className={`flex items-start gap-4 p-5 rounded-xl border ${
              step.isCompleted 
                ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800' 
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="mt-1">
              {step.isCompleted ? (
                <CheckCircle className="w-6 h-6 text-indigo-500" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center text-xs font-semibold text-slate-500">
                  {index + 1}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${
                step.isCompleted ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-white'
              }`}>
                {step.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {step.description}
              </p>
            </div>
            {!step.isCompleted && index === 1 && (
              <button className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 px-4 py-2 rounded-lg transition-colors">
                Empezar <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
