import axios from 'axios';
import { DashboardMetrics, Agent, Contract, DataDNAObject, BenchmarkReport } from '../types';

const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const securityApi = {
  getDashboardMetrics: async (): Promise<DashboardMetrics> => {
    const res = await apiClient.get<DashboardMetrics>('/dashboard/metrics');
    return res.data;
  },
  getAgents: async (): Promise<{ agents: Agent[] }> => {
    const res = await apiClient.get<{ agents: Agent[] }>('/agents');
    return res.data;
  },
  registerAgent: async (name: string, framework: string): Promise<Agent> => {
    const res = await apiClient.post<Agent>('/agents', { name, framework });
    return res.data;
  },
  rotateAgentKeys: async (agentId: string) => {
    const res = await apiClient.post(`/agents/${agentId}/rotate-keys`);
    return res.data;
  },
  compileContract: async (prompt: string, agentId: string) => {
    const res = await apiClient.post('/compiler/compile', { prompt, agent_id: agentId });
    return res.data;
  },
  getContracts: async (): Promise<{ contracts: Contract[] }> => {
    const res = await apiClient.get<{ contracts: Contract[] }>('/contracts');
    return res.data;
  },
  getDataDnaObjects: async (): Promise<{ data_objects: DataDNAObject[] }> => {
    const res = await apiClient.get<{ data_objects: DataDNAObject[] }>('/data-dna/objects');
    return res.data;
  },
  executeGateway: async (payload: {
    agent_id: string;
    contract_id: string;
    operation: string;
    resource_path: string;
    parameters: any;
    destination?: string;
    approval_id?: string;
  }) => {
    const res = await apiClient.post('/gateway/execute', payload);
    return res.data;
  },
  issueApproval: async (payload: any) => {
    const res = await apiClient.post('/gateway/approvals/issue', payload);
    return res.data;
  },
  runBenchmarkSuite: async (): Promise<BenchmarkReport> => {
    const res = await apiClient.post<BenchmarkReport>('/evaluator/run');
    return res.data;
  },
  verifyAuditChain: async () => {
    const res = await apiClient.get('/audit/verify');
    return res.data;
  }
};
