# Quick Setup Guide

## Files Created

✅ **server/package.json** - Dependencies and scripts  
✅ **server/tsconfig.json** - TypeScript configuration  
✅ **server/src/index.ts** - Express server entry point  
✅ **server/src/db.ts** - SQLite database operations  
✅ **server/src/routes/deploy.ts** - Deployment API routes  
✅ **server/.env.example** - Environment variables template  
✅ **server/README.md** - Complete documentation  

## Quick Start

```bash
# 1. Navigate to server directory
cd server

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env (optional - defaults work for development)
# nano .env

# 5. Start development server
npm run dev
```

Server will run on `http://localhost:3001`

## Test the API

```bash
# Health check
curl http://localhost:3001/health

# Deploy a contract
curl -X POST http://localhost:3001/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "contractPath": "contracts/counter",
    "contractName": "counter",
    "network": "testnet",
    "deployerSecret": "S..."
  }'

# List contracts
curl http://localhost:3001/api/contracts
```

## Prerequisites

- Node.js 18+
- Rust & wasm32-unknown-unknown target
- soroban-cli installed

See [README.md](./README.md) for detailed installation instructions.

