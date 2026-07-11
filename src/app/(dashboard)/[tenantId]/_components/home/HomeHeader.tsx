"use client";

import React, { useEffect, useState } from 'react';

export function HomeHeader() {
  const [greeting, setGreeting] = useState('Buenos días');
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    // Dynamic greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 20) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');

    // Attempt to read company name from Business Studio state
    try {
      const studioState = localStorage.getItem('atlas_business_studio_state');
      if (studioState) {
        const parsed = JSON.parse(studioState);
        if (parsed.companyName) setCompanyName(parsed.companyName);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
        {greeting}, {companyName ? <span className="text-indigo-600 dark:text-indigo-400">{companyName}</span> : 'Bienvenido a Atlas'}
      </h1>
      
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 p-4 md:p-5 rounded-2xl max-w-3xl">
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm md:text-base">
          <span className="font-semibold text-indigo-700 dark:text-indigo-400">Resumen Diario: </span>
          Durante las últimas 24 horas, el Empleado Digital ha gestionado 42 interacciones. Se han detectado 3 oportunidades comerciales de alto valor y tienes 2 decisiones pendientes en el Validation Engine. Todos los sistemas están funcionando óptimamente.
        </p>
      </div>
    </div>
  );
}
