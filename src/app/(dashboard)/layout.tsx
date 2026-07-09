import { AdminLayout } from '@/components/layout/AdminLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
