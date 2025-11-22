# Smart Contract Auto-Deployment Pipeline

## Overview

Complete implementation of the smart contract compilation and deployment pipeline using soroban-cli.

## Files Created/Updated

### 1. `/server/src/services/compile.ts`
- `compileContract()` - Compiles Soroban contracts
- `getCompiledWasmPath()` - Checks if contract is already compiled
- Uses `soroban contract build` command
- Supports "counter" contract by default

### 2. `/server/src/services/deploy.ts`
- `deployContract()` - Deploys compiled WASM to Stellar network
- `isValidContractId()` - Validates contract ID format
- Uses `soroban contract deploy` command
- Returns contractId, transactionHash, timestamp

### 3. `/server/src/db.ts` (Updated)
- Changed from SQLite to JSON-based storage
- Uses `db.json` file in `server/data/` directory
- All CRUD operations for contract records

### 4. `/server/src/routes/deploy.ts` (Updated)
- Refactored to use compile and deploy services
- Cleaner separation of concerns
- Better error handling and logging

### 5. `/server/package.json` (Updated)
- Removed `better-sqlite3` dependency
- Removed `@types/better-sqlite3` dev dependency

## API Response Format

### POST /api/deploy

**Request:**
```json
{
  "contractName": "counter",
  "network": "testnet",
  "deployerSecret": "S...",
  "contractPath": "contracts/counter" // optional
}
```

**Response:**
```json
{
  "success": true,
  "contractId": "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...",
  "transactionHash": "abc123...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Schema (db.json)

```json
{
  "contracts": [
    {
      "id": 1,
      "contractId": "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...",
      "contractName": "counter",
      "network": "testnet",
      "wasmPath": "/path/to/counter.wasm",
      "deployerAddress": "S...",
      "transactionHash": "abc123...",
      "timestamp": "2024-01-01T00:00:00.000Z",
      "deployedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "lastId": 1
}
```

## Deployment Flow

```
1. POST /api/deploy
   ↓
2. Validate input (contractName, network, deployerSecret)
   ↓
3. compileContract(contractName)
   - Runs: soroban contract build
   - Output: target/wasm32-unknown-unknown/release/{contractName}.wasm
   ↓
4. deployContract(wasmPath, network, deployerSecret)
   - Runs: soroban contract deploy --wasm <path> --network <network> --source <key>
   - Parses: contractId, transactionHash
   ↓
5. Save to db.json
   ↓
6. Return JSON response
```

## Error Handling

All shell commands use `child_process.exec` with:
- Proper error catching
- Logging of stdout/stderr
- Error messages in responses
- Validation of file existence
- Contract ID format validation

## Logging

Comprehensive logging at each step:
- `[Compile]` - Compilation steps
- `[Deploy]` - Deployment steps
- `[Deploy Route]` - Route handler steps
- `[DB]` - Database operations

## Default Contract Support

The "counter" contract is supported by default:
- If `contractName` is "counter", uses `contracts/counter` path
- No need to specify `contractPath` for counter contract

## Usage Example

```bash
curl -X POST http://localhost:3001/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "contractName": "counter",
    "network": "testnet",
    "deployerSecret": "S..."
  }'
```

## File Locations

- **Database**: `server/data/db.json`
- **Compiled WASM**: `contracts/{contractName}/target/wasm32-unknown-unknown/release/{contractName}.wasm`
- **Services**: `server/src/services/`
- **Routes**: `server/src/routes/deploy.ts`

