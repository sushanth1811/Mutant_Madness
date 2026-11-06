"""
IntentLock 3.0 Relational Database Engine
Provides persistent SQLite storage for all 5 security layers,
audit hash chains, cryptographic approvals, agent identities, and Data DNA records.
"""

import sqlite3
import json
import os
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from app.config import DATABASE_PATH


def get_db_connection() -> sqlite3.Connection:
    """Returns a SQLite connection with WAL mode, foreign keys enabled, and dictionary rows."""
    conn = sqlite3.connect(DATABASE_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn


def init_db():
    """Initializes all relational tables if they do not exist."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Module 2: Multi-Agent Identity Registry
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agents (
        agent_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        framework TEXT NOT NULL,
        public_key TEXT NOT NULL,
        auth_status TEXT NOT NULL DEFAULT 'ACTIVE',
        trust_status TEXT NOT NULL DEFAULT 'NORMAL',
        trust_score REAL NOT NULL DEFAULT 95.0,
        parent_agent_id TEXT,
        created_at TEXT NOT NULL,
        last_active TEXT NOT NULL,
        metadata_json TEXT DEFAULT '{}',
        FOREIGN KEY (parent_agent_id) REFERENCES agents(agent_id)
    );
    """)

    # Module 2: Agent Key History & Proof-of-Possession
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agent_keys (
        key_id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        public_key TEXT NOT NULL,
        private_key_sim TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
    );
    """)

    # Module 1 & 3: Task Contract & Policy Manager
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contracts (
        contract_id TEXT PRIMARY KEY,
        task_name TEXT NOT NULL,
        description TEXT NOT NULL,
        assigned_agent_id TEXT NOT NULL,
        allowed_ops_json TEXT NOT NULL,
        denied_ops_json TEXT NOT NULL,
        auth_folders_json TEXT NOT NULL,
        max_files INTEGER NOT NULL DEFAULT 50,
        data_limit_mb REAL NOT NULL DEFAULT 20.0,
        external_sharing TEXT NOT NULL DEFAULT 'DENY',
        expires_at TEXT NOT NULL,
        delegation_allowed INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        version INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        FOREIGN KEY (assigned_agent_id) REFERENCES agents(agent_id)
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS policies (
        policy_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        rules_json TEXT NOT NULL,
        version INTEGER NOT NULL DEFAULT 1,
        dual_approval_required INTEGER NOT NULL DEFAULT 0,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS policy_history (
        history_id TEXT PRIMARY KEY,
        policy_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        rules_json TEXT NOT NULL,
        changed_by TEXT NOT NULL,
        change_summary TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (policy_id) REFERENCES policies(policy_id)
    );
    """)

    # Module 4: Adaptive Agent Trust Events
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS trust_events (
        event_id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        previous_score REAL NOT NULL,
        new_score REAL NOT NULL,
        previous_state TEXT NOT NULL,
        new_state TEXT NOT NULL,
        reason TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
    );
    """)

    # Module 6: Data DNA & Taint Tracking Lineage
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS data_lineage (
        object_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        source_uri TEXT NOT NULL,
        trust_label TEXT NOT NULL,          -- TRUSTED, UNTRUSTED, UNKNOWN
        sensitivity_label TEXT NOT NULL,    -- PUBLIC, INTERNAL, CONFIDENTIAL, RESTRICTED
        creator_agent_id TEXT NOT NULL,
        parent_ids_json TEXT NOT NULL,      -- List of parent object IDs
        transformation_type TEXT NOT NULL,  -- RAW, SUMMARIZED, TRANSFORMED, CONCATENATED
        current_location TEXT NOT NULL,
        taint_tags_json TEXT NOT NULL,      -- E.g. ['tainted_untrusted_web', 'contains_ssn']
        content_preview TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (creator_agent_id) REFERENCES agents(agent_id)
    );
    """)

    # Module 12: Context-Bound Cryptographic Approvals
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS approvals (
        approval_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        task_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        resource_id TEXT NOT NULL,
        resource_version TEXT NOT NULL,
        destination TEXT,
        parameters_json TEXT NOT NULL,
        policy_version TEXT NOT NULL,
        action_digest TEXT NOT NULL,
        signature TEXT NOT NULL,
        nonce TEXT NOT NULL UNIQUE,
        expires_at TEXT NOT NULL,
        used INTEGER NOT NULL DEFAULT 0,
        used_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
    );
    """)

    # Module 13: Attenuating Delegation Tokens
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS delegations (
        token_id TEXT PRIMARY KEY,
        parent_agent_id TEXT NOT NULL,
        child_agent_id TEXT NOT NULL,
        task_id TEXT NOT NULL,
        allowed_ops_json TEXT NOT NULL,
        scope_folders_json TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        is_revoked INTEGER NOT NULL DEFAULT 0,
        revocation_reason TEXT,
        token_signature TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (parent_agent_id) REFERENCES agents(agent_id),
        FOREIGN KEY (child_agent_id) REFERENCES agents(agent_id)
    );
    """)

    # Module 15: Tool Registry & Supply Chain Integrity
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tools (
        tool_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        version TEXT NOT NULL,
        schema_json TEXT NOT NULL,
        permissions_json TEXT NOT NULL,
        manifest_digest TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'RESTRICTED', -- RESTRICTED, APPROVED, QUARANTINED
        registered_at TEXT NOT NULL
    );
    """)

    # Module 18: Security Deception & Honeytokens
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS honeytokens (
        token_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        token_value TEXT NOT NULL UNIQUE,
        resource_path TEXT NOT NULL,
        created_at TEXT NOT NULL,
        tripped INTEGER NOT NULL DEFAULT 0,
        tripped_by_agent_id TEXT,
        tripped_at TEXT,
        FOREIGN KEY (tripped_by_agent_id) REFERENCES agents(agent_id)
    );
    """)

    # Module 17: Autonomous Quarantine Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS quarantine_records (
        quarantine_id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        level TEXT NOT NULL,             -- WARNING, RESTRICTED, QUARANTINED
        reason TEXT NOT NULL,
        evidence_json TEXT NOT NULL,
        active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        released_at TEXT,
        FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
    );
    """)

    # Module 22: Tamper-Evident Merkle / Sequential Hash Chain
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_log (
        log_id INTEGER PRIMARY KEY AUTOINCREMENT,
        prev_hash TEXT NOT NULL,
        current_hash TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        event_type TEXT NOT NULL,
        agent_id TEXT,
        task_id TEXT,
        risk_score REAL NOT NULL DEFAULT 0.0,
        decision TEXT NOT NULL,          -- ALLOW, DENY, REQUIRE_APPROVAL, QUARANTINE
        details_json TEXT NOT NULL
    );
    """)

    # Module 16: Sandbox Execution Sessions & Checkpoints
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS sandbox_sessions (
        session_id TEXT PRIMARY KEY,
        agent_id TEXT NOT NULL,
        tool_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        target_path TEXT NOT NULL,
        started_at TEXT NOT NULL,
        completed_at TEXT,
        status TEXT NOT NULL,
        checkpoint_file TEXT,
        exit_code INTEGER,
        output_summary TEXT,
        FOREIGN KEY (agent_id) REFERENCES agents(agent_id)
    );
    """)

    conn.commit()
    conn.close()


def row_to_dict(row: sqlite3.Row) -> Dict[str, Any]:
    """Converts a SQLite row to a Python dict, auto-parsing JSON columns ending in _json."""
    if row is None:
        return {}
    d = dict(row)
    for k, v in list(d.items()):
        if k.endswith("_json") and isinstance(v, str):
            try:
                d[k[:-5]] = json.loads(v)
            except Exception:
                d[k[:-5]] = v
    return d


def rows_to_dicts(rows: List[sqlite3.Row]) -> List[Dict[str, Any]]:
    """Converts a list of SQLite rows to dictionaries."""
    return [row_to_dict(r) for r in rows]
