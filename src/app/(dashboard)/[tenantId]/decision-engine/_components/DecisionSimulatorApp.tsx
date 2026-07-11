"use client";

import React, { useState } from 'react';
import { Play, ShieldAlert, CheckCircle2, AlertTriangle, FileJson, Clock, ListChecks } from 'lucide-react';
import { DecisionState, DecisionRule } from '@/types/decision';
import { decisionEngineService } from '@/lib/services/decision-engine.service';
import { validationEngineService } from '@/lib/services/validation-engine.service';

const MOCK_RULES: DecisionRule[] = [
  {
    id: 'rule_1',
    company_id: 'test',
    name: 'Bloquear presupuestos altos',
    description: 'Requiere aprobación humana para presupuestos > 1000',
    priority: 10,
    condition_schema: { field: 'budget', operator: '>', value: 1000 },
    action_schema: { transition_to: DecisionState.HUMAN_APPROVAL },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'rule_2',
    company_id: 'test',
    name: 'Requiere Contexto Adicional',
    description: 'Si falta el email del usuario, pedir más contexto',
    priority: 5,
    condition_schema: { field: 'user_email', operator: '===', value: null },
    action_schema: { transition_to: DecisionState.CONTEXT_REQUIRED },
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function DecisionSimulatorApp() {
  const [contextInput, setContextInput] = useState('{\n  "budget": 1500,\n  "user_email": "test@example.com"\n}');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);

  const handleSimulate = async () => {
    setIsSimulating(true);
    setLogs([]);
    
    try {
      const parsedContext = JSON.parse(contextInput);
      
      // Step 1: Decision Evaluation
      setLogs(prev => [...prev, { type: 'info', message: 'Iniciando Decision Engine...' }]);
      await new Promise(r => setTimeout(r, 800)); // fake delay
      
      const decisionResult = await decisionEngineService.evaluateDecision('demo', parsedContext, MOCK_RULES);
      
      setLogs(prev => [...prev, { 
        type: 'decision', 
        state: decisionResult.finalState,
        reason: decisionResult.reason,
        rule: decisionResult.appliedRule?.name || 'Ninguna (Flujo por defecto)' 
      }]);

      // Step 2: Validation Engine (if not requiring human/context)
      if (decisionResult.finalState === DecisionState.READY) {
        setLogs(prev => [...prev, { type: 'info', message: 'Iniciando Validation Engine...' }]);
        await new Promise(r => setTimeout(r, 800));
        
        const validationResult = await validationEngineService.validate('demo', 'policy_check', parsedContext);
        
        setLogs(prev => [...prev, { 
          type: 'validation', 
          valid: validationResult.isValid,
          details: validationResult.details
        }]);

        if (validationResult.isValid) {
          setLogs(prev => [...prev, { type: 'success', message: 'Ciclo completado. Estado final: COMPLETED' }]);
        } else {
          setLogs(prev => [...prev, { type: 'error', message: 'Validación fallida. Estado final: FAILED o BLOCKED' }]);
        }
      }

    } catch (e: any) {
      setLogs(prev => [...prev, { type: 'error', message: `Error de JSON: ${e.message}` }]);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Left Column: Context Input */}
      <div className="flex flex-col gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-indigo-500" />
            Snapshot de Contexto (JSON)
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Modifica las variables simuladas para ver cómo reaccionan las reglas declarativas. (Ej: Cambia "budget" a 500 o "user_email" a null).
          </p>
          <textarea
            value={contextInput}
            onChange={(e) => setContextInput(e.target.value)}
            className="w-full h-48 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-4 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            spellCheck={false}
          />
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isSimulating ? 'Simulando...' : 'Ejecutar Motores'}
          </button>
        </div>

        {/* Display Active Rules */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-indigo-500" />
            Reglas Declarativas Activas
          </h2>
          <div className="space-y-3">
            {MOCK_RULES.map(rule => (
              <div key={rule.id} className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg text-sm">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">{rule.name}</span>
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Prioridad: {rule.priority}</span>
                </div>
                <div className="text-slate-500 mb-2">{rule.description}</div>
                <div className="bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 text-xs font-mono">
                  IF {rule.condition_schema.field} {rule.condition_schema.operator} {String(rule.condition_schema.value)} <br/>
                  THEN {rule.action_schema.transition_to}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Execution Logs & Explanation */}
      <div className="bg-slate-950 text-slate-300 p-6 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white border-b border-slate-800 pb-4">
          <Clock className="w-5 h-5 text-cyan-400" />
          Execution Logs
        </h2>
        
        <div className="flex-1 overflow-y-auto space-y-4 font-mono text-sm">
          {logs.length === 0 && (
            <p className="text-slate-600 italic">Esperando ejecución...</p>
          )}
          
          {logs.map((log, i) => {
            if (log.type === 'info') {
              return <div key={i} className="text-blue-400">[INFO] {log.message}</div>;
            }
            if (log.type === 'success') {
              return <div key={i} className="text-green-400 flex gap-2"><CheckCircle2 className="w-4 h-4"/> {log.message}</div>;
            }
            if (log.type === 'error') {
              return <div key={i} className="text-red-400 flex gap-2"><AlertTriangle className="w-4 h-4"/> {log.message}</div>;
            }
            if (log.type === 'decision') {
              return (
                <div key={i} className="bg-slate-900 border border-slate-700 p-4 rounded-lg my-4 space-y-2">
                  <div className="text-white font-bold mb-2 border-b border-slate-700 pb-2 flex gap-2 items-center">
                    <ShieldAlert className="w-4 h-4 text-purple-400" /> DECISION RESULT
                  </div>
                  <div><span className="text-slate-500">Estado Final:</span> <span className="text-purple-400 font-bold">{log.state}</span></div>
                  <div><span className="text-slate-500">Regla Aplicada:</span> {log.rule}</div>
                  <div><span className="text-slate-500">Razón:</span> {log.reason}</div>
                </div>
              );
            }
            if (log.type === 'validation') {
              return (
                <div key={i} className={`border p-4 rounded-lg my-4 space-y-2 ${log.valid ? 'bg-green-900/10 border-green-900/50' : 'bg-red-900/10 border-red-900/50'}`}>
                  <div className={`font-bold mb-2 border-b pb-2 flex gap-2 items-center ${log.valid ? 'text-green-400 border-green-900/50' : 'text-red-400 border-red-900/50'}`}>
                    {log.valid ? <CheckCircle2 className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>} 
                    VALIDATION RESULT
                  </div>
                  <div><span className="text-slate-500">Válido:</span> {log.valid ? 'SÍ' : 'NO'}</div>
                  <div><span className="text-slate-500">Detalles:</span> {JSON.stringify(log.details)}</div>
                </div>
              );
            }
          })}
        </div>
      </div>

    </div>
  );
}
