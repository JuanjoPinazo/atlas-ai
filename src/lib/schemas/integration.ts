export type ConnectorType = 
  | 'GESDEN'
  | 'WHATSAPP_BUSINESS'
  | 'GOOGLE_CALENDAR'
  | 'MICROSOFT_365'
  | 'STRIPE'
  | 'DENTAL_LAB';

export type ConnectorStatus = 'CONNECTED' | 'DISCONNECTED' | 'ERROR' | 'SYNCING';

export interface ConnectorInfo {
  id: string;
  type: ConnectorType;
  name: string;
  description: string;
  icon: string;
  version: string;
  capabilities: string[];
  features: string[];
  roiPotential: string;
}

export interface TenantConnector {
  id: string;
  organization_id: string;
  connector_type: ConnectorType;
  status: ConnectorStatus;
  health_score: number;
  latency_ms: number;
  last_sync_at?: string;
  error_message?: string;
  config: any;
  created_at: string;
  updated_at: string;
}

export interface ConnectorSyncLog {
  id: string;
  tenant_connector_id: string;
  sync_type: 'FULL' | 'DELTA' | 'EVENT';
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  records_processed: number;
  error_message?: string;
  started_at: string;
  completed_at: string;
}
