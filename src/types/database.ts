export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// --- Declarative Config Types ---
export interface CompanySettingsConfig {
  features: string[];
  theme?: {
    primaryColor: string;
    logoUrl?: string;
  };
  allowedDomains?: string[];
  [key: string]: any;
}

export interface BrainConfig {
  persona: string;
  temperature: number;
  maxTokens: number;
  fallbackMessage: string;
  activeAgents: string[];
  [key: string]: any;
}

export interface ServiceWorkflowStep {
  id: string;
  type: 'form' | 'approval' | 'document_generation' | 'notification' | 'external_api';
  config: Record<string, any>;
  nextSteps: string[];
}

export interface ServiceConfig {
  entryType: 'chat' | 'form' | 'api';
  requiredFields: { name: string; type: string; required: boolean }[];
  workflow: ServiceWorkflowStep[];
  [key: string]: any;
}

export interface PolicyConfig {
  appliesToRoles?: string[];
  appliesToServices?: string[];
  conditions?: Record<string, any>;
}

// --- Database Entity Types ---
export interface Company {
  id: string;
  name: string;
  slug: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  company_id: string;
  config: CompanySettingsConfig;
  created_at: string;
  updated_at: string;
}

export interface CompanyBrain {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  config: BrainConfig;
  created_at: string;
  updated_at: string;
}

export interface CompanyService {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  config: ServiceConfig;
  created_at: string;
  updated_at: string;
}

export interface CompanyPolicy {
  id: string;
  company_id: string;
  title: string;
  content: string;
  priority: number;
  config: PolicyConfig;
  created_at: string;
  updated_at: string;
}

export interface CompanyPrompt {
  id: string;
  company_id: string;
  name: string;
  prompt_template: string;
  variables: string[];
  created_at: string;
  updated_at: string;
}

// --- ADR-0002 Entities ---
export interface KnowledgeDomain {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeSource {
  id: string;
  company_id: string;
  domain_id: string | null;
  name: string;
  source_type: string;
  trust_level: number;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeDocument {
  id: string;
  company_id: string;
  source_id: string;
  title: string;
  storage_path: string | null;
  content_hash: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeUnit {
  id: string;
  company_id: string;
  domain_id: string | null;
  document_id: string | null;
  unit_type: string;
  content: string;
  embedding: any; // vector
  valid_from: string;
  valid_to: string | null;
  superseded_by: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeEntity {
  id: string;
  company_id: string;
  name: string;
  entity_type: string;
  description: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeRelation {
  id: string;
  company_id: string;
  source_entity_id: string | null;
  target_entity_id: string | null;
  source_unit_id: string | null;
  target_unit_id: string | null;
  relation_type: string;
  weight: number;
  metadata: Record<string, any>;
  created_at: string;
}

export interface KnowledgeProposal {
  id: string;
  company_id: string;
  domain_id: string | null;
  proposed_by: string;
  proposal_type: string;
  content: string;
  status: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContextPackage {
  id: string;
  company_id: string;
  run_id: string;
  intent: string;
  budget_used: number;
  snapshot_version: string;
  units: Record<string, any>[];
  created_at: string;
}

export interface RetrievalEvent {
  id: string;
  company_id: string;
  context_package_id: string;
  agent_id: string;
  relevance_score: number | null;
  access_policy_applied: Record<string, any> | null;
  created_at: string;
}

export interface AccessPolicy {
  id: string;
  company_id: string;
  domain_id: string | null;
  role_or_capability: string;
  sensitivity_level: number;
  config: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Full Supabase Database Type
export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company;
        Insert: Omit<Company, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Company, 'id' | 'created_at' | 'updated_at'>>;
      };
      company_settings: {
        Row: CompanySettings;
        Insert: Omit<CompanySettings, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CompanySettings, 'id' | 'created_at' | 'updated_at'>>;
      };
      company_brain: {
        Row: CompanyBrain;
        Insert: Omit<CompanyBrain, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CompanyBrain, 'id' | 'created_at' | 'updated_at'>>;
      };
      company_services: {
        Row: CompanyService;
        Insert: Omit<CompanyService, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CompanyService, 'id' | 'created_at' | 'updated_at'>>;
      };
      company_policies: {
        Row: CompanyPolicy;
        Insert: Omit<CompanyPolicy, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CompanyPolicy, 'id' | 'created_at' | 'updated_at'>>;
      };
      company_prompts: {
        Row: CompanyPrompt;
        Insert: Omit<CompanyPrompt, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CompanyPrompt, 'id' | 'created_at' | 'updated_at'>>;
      };
      knowledge_domains: {
        Row: KnowledgeDomain;
        Insert: Omit<KnowledgeDomain, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KnowledgeDomain, 'id' | 'created_at' | 'updated_at'>>;
      };
      knowledge_sources: {
        Row: KnowledgeSource;
        Insert: Omit<KnowledgeSource, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KnowledgeSource, 'id' | 'created_at' | 'updated_at'>>;
      };
      knowledge_documents: {
        Row: KnowledgeDocument;
        Insert: Omit<KnowledgeDocument, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KnowledgeDocument, 'id' | 'created_at' | 'updated_at'>>;
      };
      knowledge_units: {
        Row: KnowledgeUnit;
        Insert: Omit<KnowledgeUnit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KnowledgeUnit, 'id' | 'created_at' | 'updated_at'>>;
      };
      knowledge_entities: {
        Row: KnowledgeEntity;
        Insert: Omit<KnowledgeEntity, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KnowledgeEntity, 'id' | 'created_at' | 'updated_at'>>;
      };
      knowledge_relations: {
        Row: KnowledgeRelation;
        Insert: Omit<KnowledgeRelation, 'id' | 'created_at'>;
        Update: Partial<Omit<KnowledgeRelation, 'id' | 'created_at'>>;
      };
      knowledge_proposals: {
        Row: KnowledgeProposal;
        Insert: Omit<KnowledgeProposal, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<KnowledgeProposal, 'id' | 'created_at' | 'updated_at'>>;
      };
      context_packages: {
        Row: ContextPackage;
        Insert: Omit<ContextPackage, 'id' | 'created_at'>;
        Update: Partial<Omit<ContextPackage, 'id' | 'created_at'>>;
      };
      retrieval_events: {
        Row: RetrievalEvent;
        Insert: Omit<RetrievalEvent, 'id' | 'created_at'>;
        Update: Partial<Omit<RetrievalEvent, 'id' | 'created_at'>>;
      };
      access_policies: {
        Row: AccessPolicy;
        Insert: Omit<AccessPolicy, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AccessPolicy, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
