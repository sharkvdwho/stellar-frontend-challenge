# 📁 Updated Folder Structure

## New Additions & Modifications

This document shows only the **new files and folders** that need to be added, plus modifications to existing files.

## New Backend Structure

```
server/
├── index.ts                    # Express server entry point
├── package.json                # Backend dependencies
├── tsconfig.json              # TypeScript config for server
├── .env.example               # Environment variables template
│
├── routes/
│   ├── index.ts               # Route aggregator
│   ├── contracts.ts           # Contract deployment & management routes
│   └── stats.ts               # Statistics routes
│
├── services/
│   ├── ContractDeploymentService.ts    # Handles contract deployment via CLI
│   ├── ContractTrackingService.ts      # Tracks contract activity
│   └── StatisticsService.ts            # Calculates and caches statistics
│
├── utils/
│   ├── sorobanCli.ts          # Wrapper for soroban-cli commands
│   ├── horizonClient.ts       # Horizon API client
│   └── fileUpload.ts          # File upload handling
│
├── data/
│   ├── contracts.json         # Deployed contracts metadata (gitignored)
│   └── stats-cache.json       # Cached statistics (gitignored)
│
└── types/
    └── index.ts               # Shared TypeScript types
```

## New Frontend Components

```
components/
├── ContractDeployment.tsx      # NEW: Contract upload & deployment UI
├── ContractDashboard.tsx      # NEW: Main dashboard with charts
├── ContractStats.tsx          # NEW: Statistics display component
├── RealTimeCharts.tsx         # NEW: Chart components (line, bar, pie)
├── ContractList.tsx           # NEW: List of deployed contracts
└── ... (existing components remain unchanged)
```

## New Frontend Utilities

```
lib/
├── api-client.ts              # NEW: API client for backend communication
├── websocket-client.ts        # NEW: WebSocket client for real-time updates
├── chart-utils.ts             # NEW: Chart data formatting utilities
└── stellar-helper.ts          # EXISTING (unchanged)
```

## Modified Files

### Frontend

```
app/
└── page.tsx                   # MODIFIED: Add ContractDashboard section

package.json                   # MODIFIED: Add chart library (recharts/chart.js)
```

### Root Level

```
.gitignore                     # MODIFIED: Add server/data/*.json, server/.env
README.md                      # MODIFIED: Add backend setup instructions
```

## Complete Structure (Reference)

```
stellar-frontend-challenge/
├── app/                       # EXISTING
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # MODIFIED
│
├── components/                # EXISTING + NEW
│   ├── WalletConnection.tsx   # EXISTING
│   ├── BalanceDisplay.tsx     # EXISTING
│   ├── PaymentForm.tsx        # EXISTING
│   ├── TransactionHistory.tsx # EXISTING
│   ├── BonusFeatures.tsx      # EXISTING
│   ├── example-components.tsx # EXISTING
│   ├── ContractDeployment.tsx # NEW
│   ├── ContractDashboard.tsx # NEW
│   ├── ContractStats.tsx      # NEW
│   ├── RealTimeCharts.tsx     # NEW
│   └── ContractList.tsx       # NEW
│
├── lib/                       # EXISTING + NEW
│   ├── stellar-helper.ts      # EXISTING (unchanged)
│   ├── api-client.ts          # NEW
│   ├── websocket-client.ts    # NEW
│   └── chart-utils.ts         # NEW
│
├── server/                    # NEW (entire folder)
│   ├── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── data/
│   └── types/
│
├── contracts/                 # NEW (optional - for storing WASM files)
│   └── .gitkeep
│
├── package.json               # MODIFIED
├── tsconfig.json              # EXISTING
├── .gitignore                 # MODIFIED
└── README.md                  # MODIFIED
```

## File Size Estimates

- **Backend**: ~15-20 files, ~2000-3000 lines of code
- **Frontend Components**: ~5-6 new components, ~1500-2000 lines
- **Utilities**: ~3-4 utility files, ~500-800 lines
- **Total New Code**: ~4000-6000 lines (lightweight implementation)

## Dependencies to Add

### Frontend (package.json)
```json
{
  "recharts": "^2.10.0",        // or "chart.js": "^4.4.0"
  "date-fns": "^2.30.0"         // For date formatting
}
```

### Backend (server/package.json)
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "ws": "^8.14.2",
  "multer": "^1.4.5-lts.1",
  "dotenv": "^16.3.1",
  "@types/express": "^4.17.21",
  "@types/ws": "^8.5.10",
  "@types/multer": "^1.4.11",
  "typescript": "^5.4.5",
  "ts-node": "^10.9.2"
}
```

## Environment Variables

### Backend (.env)
```
PORT=3001
NODE_ENV=development
HORIZON_URL=https://horizon-testnet.stellar.org
NETWORK_PASSPHRASE=Test SDF Network ; September 2015
SOROBAN_CLI_PATH=soroban-cli
UPLOAD_DIR=./contracts
```

## Git Ignore Additions

```
# Backend
server/node_modules/
server/data/*.json
server/.env
server/dist/

# Contracts
contracts/*.wasm
*.wasm
```

