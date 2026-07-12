import { requireOrganizationMembership } from '@/lib/auth/auth-utils';
import { TenantProvider } from '@/components/providers/tenant-provider';

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantId: string }>;
}) {
  const { tenantId } = await params;
  
  // Validate membership and get tenant info
  const { user, org, membership } = await requireOrganizationMembership(tenantId);
  
  return (
    <TenantProvider value={{ user, org, membership }}>
      <div className="flex flex-col flex-1 h-full w-full">
        {children}
      </div>
    </TenantProvider>
  );
}
