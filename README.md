# INTENTLOCK 3.0

> **Predict the Threat. Trace the Data. Control the Action. Contain the Risk.**  
> Predictive, Information-Aware and Self-Responding Security Framework for Autonomous AI Agents.

---

## 🚀 Quickstart: Opening & Editing in Visual Studio Code

### 1. Open Project in VS Code
Open VS Code directly in this directory:
```bash
code "C:\Users\Sushanth reddy\.gemini\antigravity\scratch\intentlock"
```

The workspace comes pre-configured with:
- `.vscode/settings.json`: Configured Python 3.12 interpreter and formatting rules.
- `.vscode/launch.json`: Pre-configured debug targets:
  - `IntentLock: Run Server` (F5)
  - `IntentLock: Run All Security Tests`
  - `IntentLock: Seed Test Database`
- `.vscode/tasks.json`: Standard build and test tasks (`Ctrl+Shift+B` or Run Task).

---

## ⚡ Running the Framework

### Option A: 1-Click Startup (Zero External Dependencies)
Double-click `start.bat` or run:
```powershell
& "C:\Program Files\IDK\compilers\Python\python.exe" backend/run_server.py
```
Open your browser at: **[http://127.0.0.1:8000/](http://127.0.0.1:8000/)**

The built-in web dashboard provides full real-time visibility and interactive controls across all 5 security layers.

### Option B: Running with FastAPI & Uvicorn (Optional)
If you install the dependencies in `backend/requirements.txt`:
```bash
pip install -r backend/requirements.txt
cd backend
uvicorn app.main:app --reload --port 8000
```

---

## 🧪 Running the Security Test Suite

The test suite validates all 24 modules, cryptographic Proof-of-Possession, attenuating delegations, lethal-trifecta detection, honeytoken deception, and the 8-scenario red-team benchmark:

```powershell
& "C:\Program Files\IDK\compilers\Python\python.exe" backend/run_tests.py
```

Result:
```
======================================================================
Total Tests Run: 21
Failures:        0
Errors:          0
Duration:        0.66 seconds

[+] ALL INTENTLOCK 3.0 SECURITY TESTS PASSED SUCCESSFULLY! (100% OK)
======================================================================
```

---

## 📁 Repository Structure

```
intentlock/
├── .vscode/                     # VS Code workspace settings, launch & tasks
│   ├── settings.json
│   ├── launch.json
│   ├── tasks.json
│   └── extensions.json
├── backend/
│   ├── app/
│   │   ├── config.py            # Global thresholds, HMAC secrets, paths
│   │   ├── database.py          # Persistent SQLite database & schema
│   │   ├── crypto/              # Canonical JSON, HMAC-SHA256, PoP signatures
│   │   ├── layer1_governance/   # Modules 1-4: Intent compiler, agent registry, policies, trust engine
│   │   ├── layer2_intelligence/ # Modules 5-10: Threat simulator, Data DNA, risk engine, anti-exfil, tokenization
│   │   ├── layer3_enforcement/  # Modules 11-16: Mandatory gateway, delegation, tool registry, sandbox
│   │   ├── layer4_defense/      # Modules 17-20: Quarantine, honeytokens, transactions, blast radius
│   │   ├── layer5_evidence/     # Modules 21-24: Shadow mode, audit hash chain, dashboard, continuous evaluator
│   │   ├── api/                 # REST API router & full-featured embedded console UI
│   │   └── main.py              # FastAPI entry point
│   ├── tests/                   # 21 unit & integration security tests
│   ├── run_server.py            # Zero-dependency HTTP server launcher
│   ├── run_tests.py             # Test suite discovery runner
│   ├── seed_data.py             # Baseline database seeder
│   └── requirements.txt         # Optional pip requirements
├── frontend/                    # Modern React + TypeScript + Vite project
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── start.bat                    # 1-click Windows runner
├── ARCHITECTURE.md              # In-depth architectural specification
└── README.md
```

---

## 🛡️ Key Security Features Demonstrated

1. **Deterministic Intent Contracts**: Natural language instructions compiled to rigid, verifiable permission boundaries.
2. **Predictive Threat Simulation**: Pre-execution DAG analysis calculating potential exposure points and lethal-trifecta risks before code runs.
3. **Data DNA Lineage & Taint**: Conservative inheritance of sensitivity (`RESTRICTED` $\to$ `CONFIDENTIAL` $\to$ `INTERNAL` $\to$ `PUBLIC`) and taint propagation.
4. **Mandatory 12-Step Security Gateway**: All protected operations strictly mediated; agents never touch raw credentials.
5. **Context-Bound Cryptographic Approvals**: Canonical JSON digests + HMAC-SHA256 signatures with atomic single-use nonce consumption.
6. **Attenuating Delegation**: Monotonic privilege containment preventing privilege escalation across multi-agent chains.
7. **Active Honeytoken Deception**: Decoy credentials triggering instantaneous Level 3 Autonomous Quarantine and forensic capture.
8. **Tamper-Evident Audit Hash Chain**: Sequential SHA-256 chain providing cryptographic verification of database integrity.
