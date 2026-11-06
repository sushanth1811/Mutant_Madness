"""
IntentLock 3.0 Configuration
Global settings for security policies, cryptography, trust thresholds, and sandbox environment.
"""

import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATABASE_PATH = str(BASE_DIR / "intentlock.db")
SANDBOX_DIR = str(BASE_DIR / "sandbox_storage")

# Ensure sandbox directory exists
os.makedirs(SANDBOX_DIR, exist_ok=True)

# Cryptographic Master Secrets
GATEWAY_HMAC_SECRET = os.getenv("INTENTLOCK_GATEWAY_SECRET", "intentlock-master-hmac-secret-k9x7v2-2026")
JWT_SECRET = os.getenv("INTENTLOCK_JWT_SECRET", "intentlock-jwt-audit-anchor-p8w3q1-2026")
NONCE_EXPIRY_SECONDS = 300  # 5 minutes
APPROVAL_EXPIRY_SECONDS = 600  # 10 minutes

# Trust Thresholds (0 - 100)
TRUST_NORMAL_MIN = 80
TRUST_WARNING_MIN = 50
TRUST_RESTRICTED_MIN = 20
# Below 20 = QUARANTINED

# Contextual Risk Engine Thresholds (0 - 100)
RISK_LOW_MAX = 24
RISK_MEDIUM_MAX = 49
RISK_HIGH_MAX = 74
# 75 - 100 = CRITICAL

# Anti-Exfiltration Budgets
DEFAULT_DAILY_EGRESS_MB = 50.0
ALLOWED_EXTERNAL_DESTINATIONS = [
    "https://api.internal-vault.corp",
    "https://academic-archive.org/api/v1/submit",
    "https://approved-partner.edu/endpoint"
]

# Version Info
FRAMEWORK_VERSION = "3.0.0-PROTOTYPE"
FRAMEWORK_TAGLINE = "Predict the Threat. Trace the Data. Control the Action. Contain the Risk."
