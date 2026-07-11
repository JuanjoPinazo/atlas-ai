"use client";

import React from 'react';
import { FinancialHero } from './_components/FinancialHero';
import { OperationalImpact } from './_components/OperationalImpact';
import { YearlyProjection } from './_components/YearlyProjection';
import { EconomicRecommendations } from './_components/EconomicRecommendations';

export default function ROICenterPage() {
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Header Title */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            ROI Center
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-sm md:text-base">
            El impacto económico de tu infraestructura Atlas. Descubre cómo los Empleados Digitales están generando ingresos activos y ahorrando costes operativos.
          </p>
        </div>

        {/* Row 1: Big Numbers */}
        <FinancialHero />

        {/* Row 2 & 3: Details & Forecast */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Left Column: Operational Data */}
          <div className="xl:col-span-7">
            <OperationalImpact />
          </div>

          {/* Right Column: Future & Recommendations */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            <div className="h-64">
              <YearlyProjection />
            </div>
            <div className="flex-1">
              <EconomicRecommendations />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
