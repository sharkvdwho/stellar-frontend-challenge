# 🏗️ Updated Architecture Plan

## Overview

This document outlines the architecture for adding Soroban smart contract deployment, tracking, and real-time dashboard capabilities to the existing Stellar frontend template.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js/React)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Existing Components                                 │   │
│  │  - WalletConnection, BalanceDisplay, PaymentForm     │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  New Components                                       │   │
│  │  - ContractDeployment.tsx                            │   │
│  │  - ContractDashboard.tsx (Charts + Stats)           │   │
│  │  - ContractStats.tsx                                 │   │
│  │  - RealTimeCharts.tsx                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Client (lib/api-client.ts)                      │   │
│  │  - Contract deployment endpoints                     │   │
│  │  - Statistics fetching                                │   │
│  │  - WebSocket connection for real-time updates        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/WebSocket
┌─────────────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (/server/routes)                         │   │
│  │  - POST /api/contracts/deploy                        │   │
│  │  - GET  /api/contracts/:id/stats                     │   │
│  │  - GET  /api/contracts/:id/operations                │   │
│  │  - GET  /api/contracts/:id/events                    │   │
│  │  - WS   /ws/contracts/:id                            │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Services (/server/services)                         │   │
│  │  - ContractDeploymentService.ts                      │   │
│  │  - ContractTrackingService.ts                        │   │
│  │  - StatisticsService.ts                              │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  CLI Integration (/server/utils)                     │   │
│  │  - soroban-cli wrapper                               │   │
│  │  - Contract deployment executor                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Data Storage (/server/data)                         │   │
│  │  - contracts.json (deployed contracts metadata)      │   │
│  │  - stats-cache.json (cached statistics)             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Stellar Network (Testnet/Mainnet)             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Soroban Contracts                                   │   │
│  │  - Deployed WASM contracts                           │   │
│  │  - Contract operations & events                      │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Horizon API                                         │   │
│  │  - Transaction history                               │   │
│  │  - Account operations                                │   │
│  │  - Event streams                                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Flow

### Contract Deployment Flow

1. **User uploads WASM file** → `ContractDeployment.tsx`
2. **Frontend sends POST** → `/api/contracts/deploy`
3. **Backend executes** → `soroban-cli contract deploy`
4. **Backend stores metadata** → `contracts.json`
5. **Backend returns contract ID** → Frontend displays success
6. **Backend starts tracking** → Polls Horizon for contract activity

### Statistics Tracking Flow

1. **Backend polls Horizon API** → Every 30 seconds (configurable)
2. **Extracts contract data** → Transactions, events, fees
3. **Stores in cache** → `stats-cache.json`
4. **Frontend requests stats** → GET `/api/contracts/:id/stats`
5. **Real-time updates** → WebSocket pushes new data

### Real-Time Dashboard Flow

1. **User opens dashboard** → `ContractDashboard.tsx`
2. **Frontend connects WebSocket** → `/ws/contracts/:id`
3. **Backend streams updates** → New transactions, events
4. **Charts update automatically** → Using Chart.js/Recharts
5. **Statistics refresh** → Without page reload

## Technology Stack

### Frontend (Existing + New)
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **Charts**: Recharts or Chart.js (lightweight)
- **WebSocket**: Native WebSocket API
- **State Management**: React hooks (useState, useEffect)
- **API Client**: Fetch API with custom wrapper

### Backend (New)
- **Runtime**: Node.js 18+
- **Framework**: Express.js (minimal setup)
- **CLI Integration**: Child process execution for soroban-cli
- **WebSocket**: `ws` package (lightweight)
- **Storage**: JSON files (lightweight, no database needed)
- **Polling**: `node-cron` or simple setInterval

### External Tools
- **soroban-cli**: For contract deployment
- **Horizon API**: For blockchain data
- **Stellar SDK**: Already in use

## Data Models

### Contract Metadata
```typescript
interface ContractMetadata {
  id: string;              // Contract ID (address)
  name: string;            // User-provided name
  wasmPath: string;        // Path to WASM file
  network: 'testnet' | 'mainnet';
  deployerAddress: string; // Wallet that deployed
  deployedAt: string;      // ISO timestamp
  deployTxHash: string;   // Deployment transaction hash
}
```

### Contract Statistics
```typescript
interface ContractStats {
  contractId: string;
  transactionCount: number;
  totalFees: string;       // In XLM
  latestOperation: {
    hash: string;
    timestamp: string;
    type: string;
  } | null;
  eventsCount: number;
  lastUpdated: string;
}
```

### Contract Event
```typescript
interface ContractEvent {
  id: string;
  contractId: string;
  type: string;
  data: any;
  txHash: string;
  timestamp: string;
}
```

## API Endpoints

### REST API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contracts/deploy` | Deploy a new contract |
| GET | `/api/contracts` | List all deployed contracts |
| GET | `/api/contracts/:id` | Get contract details |
| GET | `/api/contracts/:id/stats` | Get contract statistics |
| GET | `/api/contracts/:id/operations` | Get recent operations |
| GET | `/api/contracts/:id/events` | Get contract events |

### WebSocket

| Endpoint | Description |
|----------|-------------|
| `/ws/contracts/:id` | Real-time updates for specific contract |

## Security Considerations

1. **File Upload Validation**: Only accept `.wasm` files
2. **Rate Limiting**: Prevent abuse of deployment endpoint
3. **Input Sanitization**: Validate contract IDs and addresses
4. **CORS**: Configure for frontend origin only
5. **Environment Variables**: Store sensitive keys in `.env`

## Performance Optimizations

1. **Caching**: Statistics cached for 30 seconds
2. **Polling Interval**: Configurable (default 30s)
3. **WebSocket Reconnection**: Automatic retry logic
4. **Lazy Loading**: Charts loaded on demand
5. **Debouncing**: Chart updates debounced to prevent flicker

## Scalability Notes

- **Current Design**: Lightweight, suitable for hackathon/demo
- **Future Enhancements**: Can migrate to database (PostgreSQL/MongoDB)
- **Horizontal Scaling**: Add Redis for shared state if needed
- **Load Balancing**: Stateless backend allows easy scaling

