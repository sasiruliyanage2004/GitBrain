@echo off
title GitBrain Fullstack & Microservices Launcher
echo ========================================================
echo   Starting GitBrain (Synapse AI) Microservices Cluster
echo ========================================================
echo.

echo [1/5] Starting API Gateway on http://localhost:8000 ...
start "GitBrain API Gateway (8000)" cmd /k "cd /d services\api-gateway && node server.js"

echo [2/5] Starting VCS Storage Service on http://localhost:8001 ...
start "GitBrain VCS Service (8001)" cmd /k "cd /d services\vcs-storage-service && node server.js"

echo [3/5] Starting AI Orchestrator Service on http://localhost:8002 ...
start "GitBrain AI Orchestrator (8002)" cmd /k "cd /d services\ai-orchestrator-service && node server.js"

echo [4/5] Starting CI/CD Runner Service on http://localhost:8003 ...
start "GitBrain CI Runner (8003)" cmd /k "cd /d services\ci-runner-service && node server.js"

echo [5/5] Starting Frontend Studio on http://localhost:3000 ...
start "GitBrain Frontend (3000)" cmd /k "npm run dev"

echo.
echo ========================================================
echo   All 5 Microservices are now running cleanly!
echo   Open http://localhost:3000 in your browser.
echo ========================================================
