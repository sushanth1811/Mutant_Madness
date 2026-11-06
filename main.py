"""
FastAPI Entry Point for IntentLock 3.0
Allows running IntentLock with FastAPI and Uvicorn (`uvicorn app.main:app --reload`).
Provides full OpenAPI documentation and interactive Swagger UI.
"""

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.database import init_db
from app.api.router import handle_api_request
from app.api.web_ui import HTML_CONTENT
from app.config import FRAMEWORK_VERSION, FRAMEWORK_TAGLINE

# Initialize database schema
init_db()

app = FastAPI(
    title="IntentLock 3.0 API",
    description=f"Autonomous AI Agent Security Framework. {FRAMEWORK_TAGLINE}",
    version=FRAMEWORK_VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", response_class=HTMLResponse)
async def get_dashboard():
    """Serves the complete responsive security console UI."""
    return HTML_CONTENT


@app.api_route("/api/{path:path}", methods=["GET", "POST", "PUT", "DELETE"])
async def dispatch_api(request: Request, path: str):
    """Dispatches all API requests through the unified security router."""
    method = request.method
    query_params = dict(request.query_params)
    body = {}
    if method in ["POST", "PUT"]:
        try:
            body = await request.json()
        except Exception:
            body = {}

    status_code, data = handle_api_request(method, f"/api/{path}", query_params, body)
    return JSONResponse(status_code=status_code, content=data)
