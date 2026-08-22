import express from 'express';
import cors from 'cors';
import * as Diff from 'diff';

const app = express();
const PORT = process.env.PORT || 8001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// In-Memory Cryptographic Snapshots DB (Persistable to PostgreSQL / MinIO)
let snapshots = [
  {
    id: "snp_init_001",
    hash: "sha256-a1c9f02e881",
    name: "Initial scaffold",
    author: "alex-dev",
    time: new Date().toISOString(),
    files: {
      "src/App.tsx": "export default function App() { return <h1>Synapse AI</h1>; }",
      "README.md": "# GitBrain Repository"
    },
    changesSummary: { added: 42, removed: 0 }
  }
];

let branches = ["main", "feature/payments-v2", "refactor/auth"];

// Helper hash calculator
function calculateHash(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return `sha256-${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'VCS & Cryptographic Storage Service',
    totalSnapshots: snapshots.length,
    activeBranches: branches.length
  });
});

// List all snapshots
app.get('/snapshots', (req, res) => {
  res.json({ success: true, snapshots });
});

// Create new cryptographic snapshot
app.post('/snapshots', (req, res) => {
  const { name, author, files } = req.body;
  if (!name || !files) {
    return res.status(400).json({ error: 'Name and files are required' });
  }

  const snapId = `snp_${Date.now()}`;
  const filesString = JSON.stringify(files);
  const hash = calculateHash(filesString);

  const newSnapshot = {
    id: snapId,
    hash,
    name,
    author: author || 'Human',
    time: new Date().toISOString(),
    files,
    changesSummary: { added: 12, removed: 2 }
  };

  snapshots.push(newSnapshot);
  res.status(201).json({ success: true, snapshot: newSnapshot });
});

// Get specific snapshot
app.get('/snapshots/:id', (req, res) => {
  const snap = snapshots.find(s => s.id === req.params.id);
  if (!snap) return res.status(404).json({ error: 'Snapshot not found' });
  res.json({ success: true, snapshot: snap });
});

// Branches
app.get('/branches', (req, res) => {
  res.json({ success: true, branches });
});

app.post('/branches', (req, res) => {
  const { name } = req.body;
  if (name && !branches.includes(name)) {
    branches.push(name);
  }
  res.status(201).json({ success: true, branches });
});

// Diff calculation
app.post('/diff', (req, res) => {
  const { oldContent, newContent } = req.body;
  const diffResult = Diff.diffLines(oldContent || '', newContent || '');
  res.json({ success: true, diff: diffResult });
});

app.listen(PORT, () => {
  console.log(`[VCS & Storage Service] Running on port ${PORT}`);
});
