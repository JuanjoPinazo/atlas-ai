"use client";

import { startAssessment } from '@/app/actions/assessment';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function AssessmentClientActions({ tenantId, label = "Iniciar Evaluación", variant = "primary" }: { tenantId: string, label?: string, variant?: "primary" | "secondary" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    const res = await startAssessment();
    if (res.data) {
      router.push(`/${tenantId}/assessment/wizard`);
    } else {
      setLoading(false);
    }
  };

  const btnClass = variant === 'primary' 
    ? "px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
    : "px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700";

  return (
    <button 
      onClick={handleStart} 
      disabled={loading}
      className={btnClass}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : label}
    </button>
  );
}
