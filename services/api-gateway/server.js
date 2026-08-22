import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Target microservice endpoints (Configurable via ENV)
const VCS_SERVICE_URL = process.env.VCS_SERVICE_URL || 'http://localhost:8001';
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8002';
const CI_SERVICE_URL = process.env.CI_SERVICE_URL || 'http://localhost:8003';

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'GitBrain API Gateway',
    timestamp: new Date().toISOString(),
    routes: {
      vcs: VCS_SERVICE_URL,
      ai: AI_SERVICE_URL,
      ci: CI_SERVICE_URL
    }
  });
});

// Proxy routes to Microservices
app.use('/api/vcs', createProxyMiddleware({
  target: VCS_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/vcs': '' }
}));

app.use('/api/ai', createProxyMiddleware({
  target: AI_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/ai': '' }
}));

app.use('/api/ci', createProxyMiddleware({
  target: CI_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/ci': '' }
}));

app.listen(PORT, () => {
  console.log(`[API Gateway] Routing listening on port ${PORT}`);
});
