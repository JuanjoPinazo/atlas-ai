"use client";

import React from 'react';
import { OrgNode, DigitalEmployeeProfile } from '@/lib/schemas/employee-designer';
import { User, Bot } from 'lucide-react';
import { EmployeeCard } from './EmployeeCard';

interface Props {
  orgChart: OrgNode;
  employees: DigitalEmployeeProfile[];
}

export function OrgChartView({ orgChart, employees }: Props) {
  
  const renderNode = (node: OrgNode) => {
    const isDigital = node.type === 'digital';
    
    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className={`p-4 rounded-xl border backdrop-blur-md shadow-lg min-w-[200px] text-center relative ${
          isDigital 
            ? 'bg-indigo-900/40 border-indigo-500/50 text-indigo-100' 
            : 'bg-slate-800/80 border-slate-600 text-slate-200'
        }`}>
          <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-slate-900 ${
            isDigital ? 'bg-indigo-500 text-white' : 'bg-slate-600 text-white'
          }`}>
            {isDigital ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          
          <h4 className="font-bold text-sm mt-2">{node.name}</h4>
          <p className={`text-xs mt-1 ${isDigital ? 'text-indigo-300' : 'text-slate-400'}`}>{node.role}</p>
        </div>

        {node.children && node.children.length > 0 && (
          <div className="relative flex flex-col items-center mt-6">
            {/* Vertical Line from parent */}
            <div className="absolute -top-6 w-px h-6 bg-slate-600" />
            
            {/* Horizontal Line connecting children */}
            {node.children.length > 1 && (
              <div className="absolute top-0 h-px bg-slate-600" 
                   style={{ 
                     left: '25%', right: '25%', 
                     width: `${(node.children.length - 1) * 220}px`,
                     transform: 'translateX(-50%)',
                     marginLeft: '50%'
                   }} 
              />
            )}

            <div className="flex gap-8 relative pt-6">
              {node.children.map((child: OrgNode) => (
                <div key={child.id} className="relative">
                  {/* Vertical Line to child */}
                  <div className="absolute -top-6 left-1/2 w-px h-6 bg-slate-600" />
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4">
      
      {/* Organigrama */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">Estructura Organizativa Híbrida</h2>
        <div className="overflow-x-auto pb-12 pt-8">
          <div className="min-w-max flex justify-center">
            {renderNode(orgChart)}
          </div>
        </div>
      </div>

      {/* Fichas Premium */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Plantilla Digital Activa</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {employees.map(emp => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>
      </div>

    </div>
  );
}
