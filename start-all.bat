@echo off
title GitBrain Fullstack & Microservices Launcher
echo ========================================================
echo   Starting GitBrain (Synapse AI) Microservices Cluster
echo ========================================================
echo.

echo [1/5] Starting API Gateway on http://localhost:8000 ...
start "GitBrain API Gateway (8000)" cmd /k "cd /d services\api-gateway && npm install && npm start"

echo [2/5] Starting VCS Storage Service on http://localhost:8001 ...
start "GitBrain VCS Service (8001)" cmd /k "cd /d services\vcs-storage-service && npm install && npm start"

echo [3/5] Starting AI Orchestrator Service on http://localhost:8002 ...
start "GitBrain AI Orchestrator (8002)" cmd /k "cd /d services\ai-orchestrator-service && npm install && npm start"

echo [4/5] Starting CI/CD Runner Service on http://localhost:8003 ...
start "GitBrain CI Runner (8003)" cmd /k "cd /d services\ci-runner-service && npm install && npm start"

echo [5/5] Starting Frontend Studio on http://localhost:3000 ...
start "GitBrain Frontend (3000)" cmd /k "npm install && npm run dev"

echo.
echo ========================================================
echo   All 5 Services are now launching in background windows!
echo   Open http://localhost:3000 in your browser.
echo ========================================================
