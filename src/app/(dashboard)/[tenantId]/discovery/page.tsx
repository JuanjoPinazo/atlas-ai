import { DiscoveryClient } from './DiscoveryClient';

export default async function DiscoveryPage({ params }: { params: Promise<{ tenantId: string }> }) {
  const { tenantId } = await params;
  return <DiscoveryClient tenantId={tenantId} />;
}
