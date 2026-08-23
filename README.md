<p align="center">
  <img src="https://img.shields.io/badge/GitBrain-6.0-6366F1?style=for-the-badge&logo=brain&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Framer_Motion-12-FF0055?style=for-the-badge&logo=framer&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<h1 align="center">
  🧠 GitBrain
</h1>

<p align="center">
  <strong>World-class AI-powered Developer Cockpit</strong><br/>
  Semantic version control · Multi-agent AI console · Virtual CI/CD sandbox
</p>

<p align="center">
  <a href="https://github.com/sasiruliyanage2004/GitBrain/issues">🐛 Report Bug</a> ·
  <a href="https://github.com/sasiruliyanage2004/GitBrain/issues">✨ Request Feature</a> ·
  <a href="ROADMAP.md">🗺️ Roadmap</a>
</p>

---

## ✨ What is GitBrain?

**GitBrain** is an AI-native developer platform — a single cockpit that combines:

| Feature | Description |
|---|---|
| 🗺️ **Architecture Map** | Live interactive service dependency graph with animated nodes |
| 🤖 **Multi-Agent AI Console** | PM Agent, Code Reviewer, CI Fixer — powered by Antigravity AI |
| 🔀 **Semantic Merge** | AI-driven 3-way AST merge engine — conflict-free PRs |
| 🔐 **Cryptographic Snapshots** | SHA-256 immutable codebase snapshots with diff generation |
| 🚀 **Virtual CI/CD** | Sandboxed pipeline runner — test branches without side effects |
| 🛡️ **Security Audit** | Zero-dependency SAST + secret scanning + supply chain integrity |

---

## 🖥️ Preview

> *Electric Indigo & Obsidian — Cursor/Linear AI Style*

```
┌─────────────────────────────────────────────────────────────────┐
│  🧠 GitBrain  /  sasiruliyanage2004  ·  main  ·  Production    │
├──┬──────────────────────────────────────┬────────────────────────┤
│  │                                      │  ✦ Antigravity Console │
│🗺│     Architecture Map                 ├────────────────────────┤
│  │    (animated node graph)             │  PM · Reviewer · CI   │
│💻│                                      │                        │
│  │   ┌──[ai-orchestrator]──┐            │  ▶ Analyzing repo…    │
│⎇ │   │  ●  (pulsing ring) │            │  ✓ PR #214 passed     │
│  │   └──[api-gateway]──────┘            │  ◌ Running pipeline…  │
│▶ │                                      │                        │
│  │                                      │  [/snapshot] [/merge]  │
│🛡 │                                      │  ┌──────────────────┐ │
│  │                                      │  │ Instruct agents… │ │
└──┴──────────────────────────────────────┴──┴──────────────────┴─┘
```

---

## 🏗️ Architecture

```
C:\synapse-ai\
├── src/
│   ├── SynapseApp.tsx        # Main cockpit UI (React + Framer Motion)
│   └── index.css             # Design token system
├── services/
│   ├── api-gateway/          # Port 8000 — Unified API proxy
│   ├── vcs-storage-service/  # Port 8001 — Cryptographic snapshots + diffs
│   ├── ai-orchestrator-service/ # Port 8002 — Gemini AI agents
│   └── ci-runner-service/    # Port 8003 — Virtual CI/CD pipeline
├── start-all.bat             # One-click launcher (Windows)
├── docker-compose.yml        # Container orchestration
└── package.json              # Frontend deps
```

### Port Map
| Service | Port | Responsibility |
|---|---|---|
| API Gateway | `8000` | Routes all frontend requests |
| VCS Storage | `8001` | Snapshots, branches, diffs |
| AI Orchestrator | `8002` | Gemini AI, semantic merge |
| CI Runner | `8003` | Pipeline execution |
| Frontend (Vite) | `3000` | React SPA |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js 20+](https://nodejs.org/)
- Windows 10/11 (or Linux/macOS)

### 1. Clone the repo
```bash
git clone https://github.com/sasiruliyanage2004/GitBrain.git
cd GitBrain
```

### 2. Install dependencies
```bash
# If you have NPM access restrictions, use the mirror:
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install --registry=https://registry.npmmirror.com
```

### 3. Start all services
```bash
# Windows — double-click or run:
start-all.bat

# Or manually in 5 terminals:
node services/api-gateway/server.js          # :8000
node services/vcs-storage-service/server.js  # :8001
node services/ai-orchestrator-service/server.js # :8002
node services/ci-runner-service/server.js    # :8003
```

### 4. Start the frontend
```bash
node "C:\Program Files\nodejs\node_modules\npm\bin\npx-cli.js" vite
# Open http://localhost:3000
```

---

## 🛠️ Tech Stack

**Frontend**
- ⚛️ React 18 + TypeScript 5
- 🎨 Tailwind CSS 3 — Obsidian + Electric Indigo design system
- 🎬 Framer Motion 12 — Spring physics animations
- ✏️ Lucide React — Icon library
- ⚡ Vite 6 — Build tool

**Backend (Microservices)**
- 🟢 Node.js — All 4 services
- 🔐 `crypto` — SHA-256 snapshot hashing
- 🔁 `http-proxy-middleware` — API Gateway routing

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#060608` | App background |
| `--indigo` | `#6366F1` | Primary accent |
| `--violet` | `#8B5CF6` | Secondary accent |
| `--mint` | `#34D399` | Active/success states |
| `--rose` | `#F43F5E` | Error states |
| `--surface-1` | `#0C0C10` | Card backgrounds |

**Animations:** Spring `stiffness: 380, damping: 28` · `layoutId` shared element transitions · Staggered entrances at `i * 0.06s`

---

## 🗺️ Roadmap

See [ROADMAP.md](ROADMAP.md) for the full feature plan.

| Phase | Status | Features |
|---|---|---|
| Phase 1 — Core | ✅ Done | Architecture map, AI console, snapshot, CI runner, PRs |
| Phase 2 — AI | 🔄 In Progress | Real Gemini API integration, semantic merge production-ready |
| Phase 3 — Collab | 📋 Planned | Multi-user sessions, real-time collaboration |
| Phase 4 — Cloud | 📋 Planned | Docker deployment, GitHub OAuth, cloud storage |

---

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create your branch: `git checkout -b feat/amazing-feature`
3. Commit: `git commit -m 'feat: Add amazing feature'`
4. Push: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/sasiruliyanage2004">Sasiru Liyanage</a>
  &nbsp;·&nbsp;
  <strong>GitBrain 6.0</strong> — Electric Indigo & Obsidian
</p>
