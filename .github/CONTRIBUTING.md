# Contributing to GitBrain

Thank you for your interest in contributing! 🎉

---

## 🐛 Reporting Bugs

1. Check if the issue already exists in [Issues](https://github.com/sasiruliyanage2004/GitBrain/issues)
2. If not, open a new issue using the **Bug Report** template
3. Include: OS, Node.js version, steps to reproduce, expected vs actual behavior

---

## ✨ Requesting Features

Open an issue using the **Feature Request** template. Describe the problem you're trying to solve.

---

## 🛠️ Development Workflow

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/GitBrain.git
cd GitBrain

# 2. Create a feature branch
git checkout -b feat/your-feature-name

# 3. Install dependencies
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install

# 4. Start services
start-all.bat   # Windows
# Then: npx vite → localhost:3000

# 5. Make your changes

# 6. Commit using Conventional Commits
git commit -m "feat: add X"      # New feature
git commit -m "fix: resolve Y"   # Bug fix
git commit -m "docs: update Z"   # Docs change
git commit -m "refactor: clean X" # Refactor

# 7. Push and open a PR
git push origin feat/your-feature-name
```

---

## 📝 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | When to use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `style:` | CSS/UI changes (no logic) |
| `refactor:` | Code restructuring |
| `test:` | Adding tests |
| `chore:` | Build/tooling changes |

---

## 🏗️ Code Style

- **TypeScript** — strict mode enabled
- **Tailwind** — use design tokens (`var(--indigo)`) not raw hex
- **Framer Motion** — use `SPRING` and `EASE` constants from `SynapseApp.tsx`
- **Components** — keep under 80 lines; extract to separate files when needed

---

Happy hacking! 🚀
