@echo off
title IntentLock 3.0 Security Framework
echo ======================================================================
echo    INTENTLOCK 3.0 - AUTONOMOUS AI AGENT SECURITY FRAMEWORK
echo    Predict the Threat. Trace the Data. Control the Action. Contain the Risk.
echo ======================================================================
echo.

set PYTHON_CMD="C:\Program Files\IDK\compilers\Python\python.exe"

if not exist %PYTHON_CMD% (
    set PYTHON_CMD=python
)

echo [*] Launching IntentLock Server on http://127.0.0.1:8000/ ...
%PYTHON_CMD% backend\run_server.py

pause
