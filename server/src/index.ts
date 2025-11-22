import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import deployRoutes from './routes/deploy';
import statsRoutes from './routes/stats';

// Load environment variables
dotenv.config();

// Verify contracts directory exists (for better error messages)
import fs from 'fs';
import path from 'path';

const verifyContractsDir = () => {
  const possibleRoots = [
    path.resolve(__dirname, '../../..'), // From dist/
    path.resolve(__dirname, '../..'),    // From src/
    process.cwd(),
    path.resolve(process.cwd(), '..'),
  ];
  
  for (const root of possibleRoots) {
    const contractsPath = path.join(root, 'contracts');
    if (fs.existsSync(contractsPath)) {
      console.log(`✓ Contracts directory found at: ${contractsPath}`);
      return;
    }
  }
  console.warn(`⚠ Warning: Could not locate contracts directory. Contracts may not deploy correctly.`);
  console.warn(`  Searched in: ${possibleRoots.join(', ')}`);
};

verifyContractsDir();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api', deployRoutes);
app.use('/api', statsRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Stellar Contract Deployment Server',
    version: '0.1.0',
    endpoints: {
      health: '/health',
      deploy: 'POST /api/deploy',
      contracts: 'GET /api/contracts',
      contract: 'GET /api/contracts/:contractId',
      stats: 'GET /api/stats/:contractId',
      legacyStats: 'GET /api/contracts/:id/stats',
      transactions: 'GET /api/contracts/:id/transactions',
      events: 'GET /api/contracts/:id/events'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  process.exit(0);
});

