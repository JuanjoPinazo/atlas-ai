"use server";

import { EmployeeDesignerRepository } from '@/lib/repositories/employee-designer';

export async function fetchEmployeeDesignerData() {
  try {
    const employees = await EmployeeDesignerRepository.getDigitalEmployees();
    const orgChart = await EmployeeDesignerRepository.getOrgChart();
    
    return {
      success: true,
      data: { employees, orgChart }
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    };
  }
}
