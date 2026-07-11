import React from 'react';
import { HomeHeader } from './_components/home/HomeHeader';
import { AskAtlasCard } from './_components/home/AskAtlasCard';
import { InsightsGrid } from './_components/home/InsightsGrid';
import { SystemStatusCards } from './_components/home/SystemStatusCards';
import { SmartTimeline } from './_components/home/SmartTimeline';

export default async function TenantDashboardPage({
  params,
}: {
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  
  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <HomeHeader />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Main Left Column (approx 70%) */}
          <div className="xl:col-span-8 flex flex-col">
            <InsightsGrid />
            <SmartTimeline />
          </div>

          {/* Right Sidebar (approx 30%) */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            <AskAtlasCard />
            <div className="bg-slate-100 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800/60">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Métricas del Sistema</h3>
              <SystemStatusCards />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
