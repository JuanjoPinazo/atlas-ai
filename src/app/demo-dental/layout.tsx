import React from 'react';
import Link from 'next/link';

export default function DemoDentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Demo Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl tracking-tight hover:opacity-80 transition-opacity">
            VELSORA
          </Link>
          <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-amber-200 dark:border-amber-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            MODO DEMO
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full h-full">
        {children}
      </main>
    </div>
  );
}
