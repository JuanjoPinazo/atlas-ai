import { Dna } from 'lucide-react';
import { BusinessDNAApp } from './_components/BusinessDNAApp';

export default function BusinessDNAPage() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Dna className="w-8 h-8 lg:w-10 lg:h-10 text-indigo-500" />
            Business DNA Studio
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400 max-w-3xl">
            Define el alma corporativa de forma declarativa. Establece valores, límites y excepciones sin escribir código. El <strong>Decision Engine</strong> usará este ADN para guiar el comportamiento de todos los Empleados Digitales.
          </p>
        </header>

        <BusinessDNAApp />
      </div>
    </div>
  );
}
