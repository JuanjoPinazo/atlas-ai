"use client";

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, File } from 'lucide-react';
import { PipelineStatus } from './useKnowledgeAcquisition';

interface Props {
  onDrop: (fileName: string) => void;
  status: PipelineStatus;
}

export function DragDropZone({ onDrop, status }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (status !== 'idle' && status !== 'done') return;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDrop(e.dataTransfer.files[0].name);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onDrop(e.target.files[0].name);
    }
  };

  return (
    <div 
      className={`relative w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer overflow-hidden ${
        isDragging 
          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 bg-white dark:bg-slate-900'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleChange}
      />

      <div className="flex gap-4 mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
          <FileText className="w-6 h-6" />
        </div>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
          <File className="w-6 h-6" />
        </div>
      </div>

      <div className="text-center">
        <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
          <UploadCloud className="w-5 h-5 inline mr-2 text-indigo-500" />
          Arrastra documentos aquí
        </p>
        <p className="text-sm text-slate-500">
          Soporte para PDF, Word o Texto. Haz clic para explorar.
        </p>
      </div>

      {isDragging && (
        <div className="absolute inset-0 bg-indigo-500/10 backdrop-blur-[2px] flex items-center justify-center">
          <p className="font-bold text-indigo-600 text-lg">Suelta para iniciar la ingesta</p>
        </div>
      )}
    </div>
  );
}
