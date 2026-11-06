import React, { useState, useEffect } from 'react';
import { securityApi } from './services/api';
import { DashboardMetrics, Agent, Contract, DataDNAObject, BenchmarkReport } from './types';
import { Shield, FileText, Cpu, Lock, AlertTriangle, Activity, RefreshCw, CheckCircle, XCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'governance' | 'intelligence' | 'gateway' | 'defense' | 'audit'>('overview');
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [dnaObjects, setDnaObjects] = useState<DataDNAObject[]>([]);
  const [benchmarkReport, setBenchmarkReport] = useState<BenchmarkReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Form states
  const [intentPrompt, setIntentPrompt] = useState("Organise my academic project documents and prepare research summaries.");
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [compileResult, setCompileResult] = useState<any>(null);

  // Gateway execution form
  const [gwOperation, setGwOperation] = useState("read_file");
  const [gwResource, setGwResource] = useState("/workspace/documents/project_brief.txt");
  const [gwParams, setGwParams] = useState('{"mode": "read"}');
  const [gwDest, setGwDest] = useState("https://approved-partner.edu/endpoint");
  const [gwApprovalId, setGwApprovalId] = useState("");
  const [gwResult, setGwResult] = useState<any>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const m = await securityApi.getDashboardMetrics();
      setMetrics(m);
      const a = await securityApi.getAgents();
      setAgents(a.agents || []);
      if (a.agents && a.agents.length > 0 && !selectedAgentId) {
        setSelectedAgentId(a.agents[0].agent_id);
      }
      const c = await securityApi.getContracts();
      setContracts(c.contracts || []);
      const d = await securityApi.getDataDnaObjects();
      setDnaObjects(d.data_objects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCompile = async () => {
    if (!selectedAgentId) return;
    const res = await securityApi.compileContract(intentPrompt, selectedAgentId);
    setCompileResult(res);
    loadAll();
  };

  const handleExecuteGateway = async () => {
    if (!selectedAgentId || contracts.length === 0) return;
    try {
      const parsedParams = JSON.parse(gwParams || '{}');
      const res = await securityApi.executeGateway({
        agent_id: selectedAgentId,
        contract_id: contracts[0].contract_id,
        operation: gwOperation,
        resource_path: gwResource,
        parameters: parsedParams,
        destination: gwOperation === 'network_egress' ? gwDest : undefined,
        approval_id: gwApprovalId.trim() || undefined
      });
      setGwResult(res);
      loadAll();
    } catch (err: any) {
      setGwResult({ error: err.message });
    }
  };

  const handleRunBenchmarks = async () => {
    try {
      setLoading(true);
      const report = await securityApi.runBenchmarkSuite();
      setBenchmarkReport(report);
      loadAll();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0e17', color: '#f3f4f6' }}>
      {/* Header */}
      <header style={{ background: '#111827', borderBottom: '1px solid #23304a', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: '#2563eb', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '8px', fontWeight: 800, letterSpacing: '1px' }}>
            INTENTLOCK 3.0
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            <span style={{ color: '#60a5fa', fontWeight: 600 }}>PREDICT</span> the Threat &bull; <span style={{ color: '#60a5fa', fontWeight: 600 }}>TRACE</span> the Data &bull; <span style={{ color: '#60a5fa', fontWeight: 600 }}>CONTROL</span> the Action &bull; <span style={{ color: '#60a5fa', fontWeight: 600 }}>CONTAIN</span> the Risk
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600 }}>
            ● Zero-Bypass Gateway Active
          </div>
          <button onClick={loadAll} style={{ background: '#334155', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav style={{ background: '#0f172a', borderBottom: '1px solid #23304a', padding: '0 2rem', display: 'flex', gap: '0.5rem' }}>
        {[
          { id: 'overview', label: '🛡️ Overview & Coverage' },
          { id: 'governance', label: '📝 Layer 1: Intent & Governance' },
          { id: 'intelligence', label: '🔮 Layer 2: Threat & Data DNA' },
          { id: 'gateway', label: '⚡ Layer 3: Gateway & Approvals' },
          { id: 'defense', label: '🚨 Layer 4: Adaptive Defense' },
          { id: 'audit', label: '📜 Layer 5: Audit & Benchmark Suite' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            style={{
              padding: '0.85rem 1.2rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === t.id ? '2px solid #3b82f6' : '2px solid transparent',
              color: activeTab === t.id ? '#60a5fa' : '#94a3b8',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'overview' && metrics && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
              <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Registered Agents</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f3f4f6', fontFamily: 'monospace' }}>{metrics.agents.total}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{metrics.agents.active} Active &bull; {metrics.agents.quarantined} Quarantined</div>
              </div>
              <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Active Contracts</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f3f4f6', fontFamily: 'monospace' }}>{metrics.contracts.active}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Deterministically enforced</div>
              </div>
              <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Average Trust Score</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>{metrics.agents.avg_trust_score}/100</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Adaptive explainable rating</div>
              </div>
              <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.25rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Audit Hash Chain</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#60a5fa', fontFamily: 'monospace' }}>{metrics.audit_chain.total_entries}</div>
                <div style={{ fontSize: '0.75rem', color: metrics.audit_chain.is_valid ? '#34d399' : '#ef4444' }}>
                  {metrics.audit_chain.is_valid ? '✓ SHA-256 Validated' : '⚠️ Tampering Detected'}
                </div>
              </div>
            </div>

            {/* Coverage Map */}
            <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Shield size={18} color="#3b82f6" /> Enforcement Coverage Map
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#1e293b', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Subsystem / Resource</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Active Protection Layer</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(metrics.enforcement_coverage).map(([k, v]) => (
                    <tr key={k} style={{ borderBottom: '1px solid #23304a' }}>
                      <td style={{ padding: '0.75rem 1rem' }}><code>{k}</code></td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700,
                          background: v.status === 'FULLY_ENFORCED' ? 'rgba(16, 185, 129, 0.15)' : (v.status === 'MONITORED_ONLY' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)'),
                          color: v.status === 'FULLY_ENFORCED' ? '#34d399' : (v.status === 'MONITORED_ONLY' ? '#fbbf24' : '#f87171')
                        }}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>{v.level}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Intent-to-Contract Compiler</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Natural Language Intent</label>
                <textarea
                  value={intentPrompt}
                  onChange={(e) => setIntentPrompt(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #23304a', color: 'white', padding: '0.6rem', borderRadius: '6px' }}
                  rows={3}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem' }}>Assigned Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #23304a', color: 'white', padding: '0.6rem', borderRadius: '6px' }}
                >
                  {agents.map(a => <option key={a.agent_id} value={a.agent_id}>{a.name} ({a.agent_id})</option>)}
                </select>
              </div>
              <button onClick={handleCompile} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                Compile & Activate Security Contract
              </button>
              {compileResult && (
                <pre style={{ marginTop: '1rem', background: '#030712', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem', color: '#38bdf8', overflowX: 'auto' }}>
                  {JSON.stringify(compileResult, null, 2)}
                </pre>
              )}
            </div>

            <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Registered Agents</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid #23304a' }}>
                    <th style={{ padding: '0.5rem' }}>Name</th>
                    <th style={{ padding: '0.5rem' }}>Trust</th>
                    <th style={{ padding: '0.5rem' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map(a => (
                    <tr key={a.agent_id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '0.5rem' }}><strong>{a.name}</strong><br /><code style={{ color: '#94a3b8' }}>{a.agent_id}</code></td>
                      <td style={{ padding: '0.5rem' }}>{a.trust_score}</td>
                      <td style={{ padding: '0.5rem' }}>{a.trust_status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'gateway' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Mandatory Execution Gateway Console</h3>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>Operation</label>
                <select
                  value={gwOperation}
                  onChange={(e) => setGwOperation(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #23304a', color: 'white', padding: '0.5rem', borderRadius: '6px' }}
                >
                  <option value="read_file">read_file (Safe read + privacy tokenization)</option>
                  <option value="write_file">write_file (Sandboxed file mutation)</option>
                  <option value="network_egress">network_egress (Outbound data egress)</option>
                  <option value="delete_file">delete_file (Destructive - prohibited)</option>
                </select>
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>Target Resource</label>
                <input
                  type="text"
                  value={gwResource}
                  onChange={(e) => setGwResource(e.target.value)}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #23304a', color: 'white', padding: '0.5rem', borderRadius: '6px' }}
                />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8' }}>Action Parameters (JSON)</label>
                <textarea
                  value={gwParams}
                  onChange={(e) => setGwParams(e.target.value)}
                  rows={2}
                  style={{ width: '100%', background: '#0f172a', border: '1px solid #23304a', color: 'white', padding: '0.5rem', borderRadius: '6px' }}
                />
              </div>
              <button onClick={handleExecuteGateway} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
                Execute 12-Step Gateway Pipeline
              </button>
            </div>

            <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Pipeline Execution Result</h3>
              {gwResult ? (
                <pre style={{ background: '#030712', padding: '1rem', borderRadius: '8px', fontSize: '0.75rem', color: '#38bdf8', overflowY: 'auto', maxHeight: '350px' }}>
                  {JSON.stringify(gwResult, null, 2)}
                </pre>
              ) : (
                <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Submit an action from the console to observe the 12-step validation pipeline.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'audit' && (
          <div>
            <div style={{ background: '#111827', border: '1px solid #23304a', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Red-Team Security Benchmark Suite (8 Adversarial Scenarios)</h3>
                <button
                  onClick={handleRunBenchmarks}
                  disabled={loading}
                  style={{ background: '#059669', color: 'white', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                >
                  ▶️ Execute Full Benchmark Suite
                </button>
              </div>
              {benchmarkReport && (
                <div>
                  <h4 style={{ marginBottom: '0.5rem', color: '#34d399' }}>Resilience Score: {benchmarkReport.security_resilience_score}% ({benchmarkReport.framework_status})</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#1e293b', textAlign: 'left', color: '#94a3b8' }}>
                        <th style={{ padding: '0.5rem' }}>ID</th>
                        <th style={{ padding: '0.5rem' }}>Scenario</th>
                        <th style={{ padding: '0.5rem' }}>Expected</th>
                        <th style={{ padding: '0.5rem' }}>Actual</th>
                        <th style={{ padding: '0.5rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarkReport.scenario_results.map(s => (
                        <tr key={s.scenario_id} style={{ borderBottom: '1px solid #23304a' }}>
                          <td style={{ padding: '0.5rem' }}><code>{s.scenario_id}</code></td>
                          <td style={{ padding: '0.5rem' }}><strong>{s.name}</strong><br /><span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{s.detail}</span></td>
                          <td style={{ padding: '0.5rem' }}>{s.expected}</td>
                          <td style={{ padding: '0.5rem' }}>{s.actual}</td>
                          <td style={{ padding: '0.5rem' }}>
                            <span style={{ color: s.passed ? '#34d399' : '#f87171', fontWeight: 700 }}>
                              {s.passed ? '✓ PASSED' : '✗ FAILED'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
