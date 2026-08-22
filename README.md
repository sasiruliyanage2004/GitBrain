# ⚡ GitBrain (Synapse AI)
### Autonomous AI Project Manager & Native Version Control Studio
#### Enterprise Microservices Architecture

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **GitBrain** is an authentic, all-in-one developer platform that replaces traditional Git & GitHub with an autonomous AI Project Manager, built-in cryptographic snapshots, automated CI/CD actions, and zero-conflict semantic merges — built with an **Enterprise Microservices Architecture**.

---

## 🏗️ Microservices Architecture

```
                                  [ Client UI ]
                           (React / Next.js Dashboard)
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │   API Gateway & Auth Service  │ :8000
                       └───────────────┬───────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│   VCS & Storage  │ :8001   │   AI Agent & PM  │ :8002   │  CI/CD Runner    │ :8003
│      Service     │         │   Orchestrator   │         │     Service      │
└────────┬─────────┘         └────────┬─────────┘         └────────┬─────────┘
         │                            │                            │
         └────────────────────────────┼────────────────────────────┘
                                      ▼
                      ┌───────────────────────────────┐
                      │    Redis Event Broker         │ :6379
                      └───────────────┬───────────────┘
                                      ▼
                      ┌───────────────────────────────┐
                      │    PostgreSQL Database        │ :5432
                      └───────────────────────────────┘
```

---

## 📦 Microservices Breakdown

| Service | Port | Responsibilities |
| :--- | :--- | :--- |
| **`api-gateway`** | `8000` | Reverse proxy dispatching, JWT auth, rate limiting, and route security. |
| **`vcs-storage-service`** | `8001` | SHA-256 cryptographic snapshot engine, delta diffs, and branch trees. |
| **`ai-orchestrator-service`** | `8002` | Gemini/Claude LLM reasoning, AST-aware 3-way semantic merge, and issue auto-triage. |
| **`ci-runner-service`** | `8003` | Isolated virtual CI/CD sandbox runner (Typecheck, Tests, Security audit). |
| **`redis`** | `6379` | Real-time event broker and caching layer. |
| **`postgres`** | `5432` | Relational metadata store (Users, Repositories, PRs, Issues). |

---

## 🚀 Quick Start (Docker Compose)

Launch the full microservices cluster with a single command:

```bash
# Clone the repository
git clone https://github.com/sasiruliyanage2004/GitBrain.git
cd GitBrain

# Launch all microservices + PostgreSQL + Redis
docker-compose up --build
```

---

## 💻 Local Development (Frontend)

```bash
# Install dependencies
npm install

# Start Vite live dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
This project is open-source under the [MIT License](LICENSE).
