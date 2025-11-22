# Stellar Contract Deployment Server

A lightweight Node.js/TypeScript backend server for deploying and tracking Soroban smart contracts.

## Features

- 🚀 **Contract Deployment**: Compile and deploy Soroban contracts via REST API
- 📊 **Contract Tracking**: Store and query deployment history using SQLite
- 🔒 **Secure**: Environment-based configuration
- ⚡ **Lightweight**: Minimal dependencies, fast startup

## Prerequisites

- **Node.js** 18+ and npm
- **Rust** and **wasm32-unknown-unknown** target
- **soroban-cli** installed and in PATH

### Install Rust & Soroban CLI

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Add wasm32 target
rustup target add wasm32-unknown-unknown

# Install soroban-cli
cargo install --locked soroban-cli
```

## Installation

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your settings
nano .env
```

## Configuration

Edit `.env` file:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DEFAULT_NETWORK=testnet
SOROBAN_CLI_PATH=soroban-cli
```

## Running the Server

### Development Mode

```bash
npm run dev
```

Server runs on `http://localhost:3001` with hot-reload.

### Production Mode

```bash
# Build TypeScript
npm run build

# Start server
npm start
```

## API Endpoints

### Health Check

```http
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

### Deploy Contract

```http
POST /api/deploy
Content-Type: application/json

{
  "contractPath": "contracts/counter",
  "contractName": "counter",
  "network": "testnet",
  "deployerSecret": "S..."
}
```

Response:
```json
{
  "success": true,
  "contractId": "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...",
  "transactionHash": "abc123..."
}
```

### List Contracts

```http
GET /api/contracts
GET /api/contracts?network=testnet
```

Response:
```json
{
  "success": true,
  "count": 2,
  "contracts": [
    {
      "id": 1,
      "contract_id": "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...",
      "contract_name": "counter",
      "network": "testnet",
      "wasm_path": "/path/to/counter.wasm",
      "deployer_address": "S...",
      "transaction_hash": "abc123...",
      "deployed_at": "2024-01-01T00:00:00.000Z",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Get Contract Details

```http
GET /api/contracts/:contractId
```

Response:
```json
{
  "success": true,
  "contract": {
    "id": 1,
    "contract_id": "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...",
    "contract_name": "counter",
    "network": "testnet",
    "wasm_path": "/path/to/counter.wasm",
    "deployer_address": "S...",
    "transaction_hash": "abc123...",
    "deployed_at": "2024-01-01T00:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Project Structure

```
server/
├── src/
│   ├── index.ts          # Express server setup
│   ├── db.ts             # SQLite database operations
│   └── routes/
│       └── deploy.ts      # Deployment routes
├── data/                 # SQLite database (auto-created)
│   └── contracts.db
├── dist/                 # Compiled JavaScript (after build)
├── .env                  # Environment variables (create from .env.example)
├── .env.example          # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Database

The server uses SQLite (via `better-sqlite3`) to store contract deployments. The database is automatically created in `./data/contracts.db` on first run.

### Schema

```sql
CREATE TABLE contracts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contract_id TEXT NOT NULL UNIQUE,
  contract_name TEXT NOT NULL,
  network TEXT NOT NULL,
  wasm_path TEXT NOT NULL,
  deployer_address TEXT NOT NULL,
  transaction_hash TEXT NOT NULL,
  deployed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Deployment Flow

1. **Client sends POST /api/deploy** with contract path and deployment details
2. **Server builds contract** using `soroban contract build`
3. **Server deploys WASM** using `soroban contract deploy`
4. **Server parses output** to extract contract ID and transaction hash
5. **Server saves to database** for tracking
6. **Server returns** contract ID and transaction hash

## Example Usage

### Using curl

```bash
# Deploy counter contract
curl -X POST http://localhost:3001/api/deploy \
  -H "Content-Type: application/json" \
  -d '{
    "contractPath": "contracts/counter",
    "contractName": "counter",
    "network": "testnet",
    "deployerSecret": "S..."
  }'

# List all contracts
curl http://localhost:3001/api/contracts

# Get specific contract
curl http://localhost:3001/api/contracts/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...
```

### Using JavaScript/TypeScript

```typescript
const response = await fetch('http://localhost:3001/api/deploy', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contractPath: 'contracts/counter',
    contractName: 'counter',
    network: 'testnet',
    deployerSecret: 'S...'
  })
});

const result = await response.json();
console.log('Contract ID:', result.contractId);
```

## Troubleshooting

### "soroban: command not found"

Ensure soroban-cli is installed and in PATH:
```bash
which soroban
# If not found:
cargo install --locked soroban-cli
```

### "Build failed" errors

- Verify contract path is correct
- Check that `Cargo.toml` exists in contract directory
- Ensure Rust and wasm32 target are installed
- Check contract code compiles: `cd contracts/counter && soroban contract build`

### Database errors

- Ensure `./data` directory is writable
- Check disk space
- Try deleting `./data/contracts.db` to reset (loses all data)

### CORS errors

Update `FRONTEND_URL` in `.env` to match your frontend URL.

## Development

### Type Checking

```bash
npm run type-check
```

### Build

```bash
npm run build
```

### Database Reset

```bash
rm -rf data/contracts.db
# Database will be recreated on next server start
```

## Security Notes

⚠️ **Important**: 
- Never commit `.env` file with real secrets
- Use environment variables for production
- Consider adding authentication for production use
- Validate and sanitize all inputs
- Rate limit deployment endpoints

## License

MIT

