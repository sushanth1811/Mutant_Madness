export interface Agent {
  agent_id: string;
  name: string;
  framework: string;
  public_key: string;
  auth_status: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  trust_status: 'NORMAL' | 'WARNING' | 'RESTRICTED' | 'QUARANTINED';
  trust_score: number;
  parent_agent_id?: string | null;
  created_at: string;
  last_active: string;
}

export interface Contract {
  contract_id: string;
  task_name: string;
  description: string;
  assigned_agent_id: string;
  allowed_ops: string[];
  denied_ops: string[];
  auth_folders: string[];
  max_files: number;
  data_limit_mb: number;
  external_sharing: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL';
  expires_at: string;
  delegation_allowed: boolean;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  version: number;
  created_at: string;
}

export interface DataDNAObject {
  object_id: string;
  name: string;
  source_uri: string;
  trust_label: 'TRUSTED' | 'UNTRUSTED' | 'UNKNOWN';
  sensitivity_label: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  creator_agent_id: string;
  parent_ids: string[];
  transformation_type: string;
  current_location: string;
  taint_tags: string[];
  content_preview?: string;
  created_at: string;
}

export interface AuditLogEntry {
  log_id: number;
  prev_hash: string;
  current_hash: string;
  timestamp: string;
  event_type: string;
  agent_id?: string;
  task_id?: string;
  risk_score: number;
  decision: 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL' | 'QUARANTINE';
  details: Record<string, any>;
}

export interface DashboardMetrics {
  agents: {
    total: number;
    active: number;
    quarantined: number;
    avg_trust_score: number;
  };
  contracts: {
    total: number;
    active: number;
  };
  data_dna: {
    total_objects: number;
    tainted_objects: number;
  };
  approvals: {
    total_issued: number;
    consumed: number;
  };
  audit_chain: {
    total_entries: number;
    is_valid: boolean;
    head_hash: string;
    decisions_breakdown: Record<string, number>;
  };
  recent_security_events: AuditLogEntry[];
  enforcement_coverage: Record<string, { status: string; level: string }>;
}

export interface SecurityScenarioResult {
  scenario_id: string;
  name: string;
  expected: string;
  actual: string;
  passed: boolean;
  detail: string;
}

export interface BenchmarkReport {
  evaluation_timestamp: string;
  total_scenarios: number;
  passed_scenarios: number;
  security_resilience_score: number;
  framework_status: string;
  scenario_results: SecurityScenarioResult[];
}
