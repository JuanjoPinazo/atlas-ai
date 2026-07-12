'use client';

import { createContext, useContext, ReactNode } from 'react';

type TenantContextType = {
  user: any;
  org: any;
  membership: any;
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: TenantContextType;
}) {
  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
