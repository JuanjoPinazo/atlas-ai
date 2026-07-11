import { fetchEmployeeDesignerData } from '@/app/actions/employee-designer';
import { DesignerClient } from './DesignerClient';

export default async function EmployeeDesignerPage() {
  const result = await fetchEmployeeDesignerData();

  if (!result.success || !result.data) {
    return (
      <div className="p-8 text-center text-red-500 bg-slate-950 h-full">
        <h2>Error cargando Employee Designer</h2>
        <p>{result.error}</p>
      </div>
    );
  }

  return <DesignerClient employees={result.data.employees} orgChart={result.data.orgChart} />;
}
