import { describe, it, expect, vi } from 'vitest';
import { SupabaseBudgetRepository } from '@/lib/repositories/budget/supabase-budget.repository';
import * as serverClient from '@/lib/supabase/server';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn()
}));

describe('Supabase RLS Tenant Isolation', () => {
  it('tenant A cannot read budgets from tenant B (emulated RLS rule via organization_id)', async () => {
    const TENANT_A = 'tenant-a-123';
    const TENANT_B = 'tenant-b-456';

    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockImplementation((field: string, value: string) => {
        // En un entorno de base de datos real, el RLS evaluaría auth.uid() 
        // contra organization_id de forma invisible. Aquí simulamos el filtro 
        // explícito del repositorio.
        if (value === TENANT_A) {
          return Promise.resolve({ data: [{ id: 'b-tenant-a', organization_id: TENANT_A }], error: null });
        }
        if (value === TENANT_B) {
          return Promise.resolve({ data: [{ id: 'b-tenant-b', organization_id: TENANT_B }], error: null });
        }
        return Promise.resolve({ data: [], error: null });
      })
    };

    vi.mocked(serverClient.createClient).mockResolvedValue(mockSupabase as any);

    const repo = new SupabaseBudgetRepository();
    
    // Al pedir presupuestos del Tenant A
    const resultA = await repo.fetchBudgets(TENANT_A);
    expect(resultA.data?.length).toBe(1);
    expect(resultA.data?.[0].id).toBe('b-tenant-a');

    // Al pedir presupuestos del Tenant B
    const resultB = await repo.fetchBudgets(TENANT_B);
    expect(resultB.data?.length).toBe(1);
    expect(resultB.data?.[0].id).toBe('b-tenant-b');

    // Confirmamos que el select eq siempre pide el tenant correspondiente
    expect(mockSupabase.eq).toHaveBeenCalledWith('organization_id', TENANT_A);
    expect(mockSupabase.eq).toHaveBeenCalledWith('organization_id', TENANT_B);
  });
});
