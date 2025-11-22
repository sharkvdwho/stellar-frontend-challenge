# Contract Analytics Engine

## Overview

Complete analytics engine for Soroban contracts using Soroban RPC and Horizon API.

## Files Created/Updated

### 1. `/server/src/stellar/fetchTransactions.ts`
- `getContractTransactions(contractId)` - Returns latest 20 transactions
- Uses Horizon API to find transactions involving the contract
- Checks operations for contract invocations
- Fallback error handling

### 2. `/server/src/stellar/fetchEvents.ts`
- `getContractEvents(contractId)` - Fetches all emitted events
- Uses Soroban RPC `getEvents` method
- Extracts: event type, topics, timestamp
- Transforms RPC events to standardized format

### 3. `/server/src/stellar/computeStats.ts` (NEW)
- `getContractStats(contractId)` - Computes comprehensive statistics
- Returns: totalTx, totalEvents, avgFee, lastActivity
- Includes latest 20 transactions and events

### 4. `/server/src/routes/stats.ts` (UPDATED)
- `GET /api/stats/:contractId` - Main stats endpoint
- `GET /api/contracts/:id/stats` - Legacy endpoint (backward compatible)
- `GET /api/contracts/:id/transactions` - Transaction list
- `GET /api/contracts/:id/events` - Event list

## API Endpoints

### GET /api/stats/:contractId

**Response:**
```json
{
  "success": true,
  "stats": {
    "contractId": "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...",
    "contractName": "counter",
    "network": "testnet",
    "totalTx": 42,
    "totalEvents": 38,
    "avgFee": "0.0000100",
    "lastActivity": "2024-01-01T00:00:00.000Z",
    "transactions": [...], // Latest 20
    "events": [...] // Latest 20
  }
}
```

## Soroban RPC Configuration

- **Testnet RPC**: `https://soroban-testnet.stellar.org`
- **Events**: Uses `getEvents` method
- **Transactions**: Uses Horizon API (Soroban RPC doesn't have direct transaction queries)

## Functions

### getContractTransactions(contractId)
- Queries Horizon API for recent transactions
- Filters by checking operations for contract involvement
- Returns latest 20 transactions
- Includes: hash, ledger, fee, timestamp, success status

### getContractEvents(contractId)
- Queries Soroban RPC `getEvents` method
- Filters by contract ID
- Extracts event type (from first topic)
- Extracts topics array
- Extracts timestamp (ledgerClosedAt)
- Returns all events (can be limited)

### getContractStats(contractId)
- Fetches transactions and events in parallel
- Calculates:
  - `totalTx`: Count of transactions
  - `totalEvents`: Count of events
  - `avgFee`: Average transaction fee (XLM)
  - `lastActivity`: Most recent transaction or event timestamp
- Returns latest 20 of each

## Error Handling

- All functions include try-catch blocks
- Graceful fallbacks for API failures
- Detailed error logging
- Returns empty arrays on errors (doesn't crash)

## Performance

- Parallel fetching of transactions and events
- Efficient filtering of transactions
- Limits to latest 20 transactions/events in response
- Caching can be added in future

## Usage Example

```bash
# Get full stats
curl http://localhost:3001/api/stats/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...

# Get transactions only
curl http://localhost:3001/api/contracts/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH.../transactions

# Get events only
curl http://localhost:3001/api/contracts/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH.../events
```

