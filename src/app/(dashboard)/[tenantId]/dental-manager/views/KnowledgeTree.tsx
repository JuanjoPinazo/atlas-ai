"use client";

import React, { useState } from 'react';
import { DentalDomain, DentalCategory, DentalItem } from '@/lib/schemas/dental-knowledge';
import { Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { ItemDetailView } from './ItemDetailView';

interface Props {
  domains: DentalDomain[];
  categories: DentalCategory[];
  items: DentalItem[];
  allBenefits: any[];
  allQuestions: any[];
  allAutomations: any[];
}

export function KnowledgeTree({ domains, categories, items, allBenefits, allQuestions, allAutomations }: Props) {
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(domains.map(d => d.id)));
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories.map(c => c.id)));
  const [selectedItem, setSelectedItem] = useState<DentalItem | null>(null);

  const toggleDomain = (id: string) => {
    const newSet = new Set(expandedDomains);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedDomains(newSet);
  };

  const toggleCategory = (id: string) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedCategories(newSet);
  };

  return (
    <div className="flex h-[calc(100vh-12rem)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Sidebar Tree */}
      <div className="w-1/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">Explorador de Conocimiento</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {domains.map(domain => {
            const domainCategories = categories.filter(c => c.domain_id === domain.id);
            const isExpandedDomain = expandedDomains.has(domain.id);

            return (
              <div key={domain.id} className="mb-2">
                <div 
                  onClick={() => toggleDomain(domain.id)}
                  className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-slate-800 dark:text-slate-200 font-bold text-sm"
                >
                  {isExpandedDomain ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  {isExpandedDomain ? <FolderOpen className="w-4 h-4 text-indigo-500" /> : <Folder className="w-4 h-4 text-indigo-500" />}
                  {domain.name}
                </div>

                {isExpandedDomain && (
                  <div className="ml-6 border-l border-slate-200 dark:border-slate-700 pl-2 mt-1">
                    {domainCategories.map(category => {
                      const categoryItems = items.filter(i => i.category_id === category.id);
                      const isExpandedCat = expandedCategories.has(category.id);

                      return (
                        <div key={category.id} className="mb-1">
                          <div 
                            onClick={() => toggleCategory(category.id)}
                            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer text-slate-700 dark:text-slate-300 font-medium text-sm"
                          >
                            {isExpandedCat ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className="w-3 h-3 text-slate-400" />}
                            {isExpandedCat ? <FolderOpen className="w-4 h-4 text-slate-400" /> : <Folder className="w-4 h-4 text-slate-400" />}
                            {category.name}
                          </div>

                          {isExpandedCat && (
                            <div className="ml-6 border-l border-slate-200 dark:border-slate-700 pl-2 mt-1">
                              {categoryItems.map(item => (
                                <div 
                                  key={item.id}
                                  onClick={() => setSelectedItem(item)}
                                  className={`flex items-center gap-2 p-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
                                    selectedItem?.id === item.id 
                                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold' 
                                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  <FileText className={`w-3.5 h-3.5 ${item.status === 'aprobado' ? 'text-emerald-500' : 'text-slate-400'}`} />
                                  <span className="truncate">{item.title}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-2/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-y-auto custom-scrollbar shadow-sm">
        {selectedItem ? (
          <ItemDetailView 
            item={selectedItem} 
            benefits={allBenefits.filter(b => b.item_id === selectedItem.id)}
            questions={allQuestions.filter(q => q.item_id === selectedItem.id)}
            automations={allAutomations.filter(a => a.item_id === selectedItem.id)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <FileText className="w-16 h-16 mb-4 opacity-20" />
            <p>Selecciona una unidad de conocimiento para ver sus detalles</p>
          </div>
        )}
      </div>
    </div>
  );
}
