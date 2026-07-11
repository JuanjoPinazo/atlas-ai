"use client";

import React, { useState } from 'react';
import { BudgetList } from './views/BudgetList';
import { BudgetDetail } from './views/BudgetDetail';

export default function DentalBudgetsPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="min-h-full bg-slate-950 p-4 md:p-8 relative overflow-x-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {!selectedId ? (
          <BudgetList onSelect={setSelectedId} />
        ) : (
          <BudgetDetail id={selectedId} onBack={() => setSelectedId(null)} />
        )}
      </div>
    </div>
  );
}
