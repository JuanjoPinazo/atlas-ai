'use client';

import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

interface ConfigEditorProps {
  initialConfig: Record<string, any>;
  onSave: (config: Record<string, any>) => Promise<void>;
}

export function ConfigEditor({ initialConfig, onSave }: ConfigEditorProps) {
  const [configStr, setConfigStr] = useState(JSON.stringify(initialConfig, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setError(null);
    setIsSaving(true);
    try {
      const parsed = JSON.parse(configStr);
      await onSave(parsed);
    } catch (e: any) {
      setError(e.message || 'Invalid JSON format');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700 overflow-hidden font-mono text-sm">
      <div className="flex items-center justify-between p-3 border-b border-slate-700 bg-slate-950">
        <span className="text-slate-400">Declarative JSON Configuration</span>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Config'}
        </button>
      </div>
      
      {error && (
        <div className="p-3 bg-red-950/50 border-b border-red-900/50 flex items-start gap-2 text-red-400">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="whitespace-pre-wrap break-words">{error}</p>
        </div>
      )}

      <textarea
        value={configStr}
        onChange={(e) => setConfigStr(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full p-4 bg-transparent text-slate-300 resize-none focus:outline-none focus:ring-0 leading-relaxed"
        style={{ minHeight: '300px' }}
      />
    </div>
  );
}
