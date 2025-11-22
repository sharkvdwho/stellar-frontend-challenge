# Contract Statistics Implementation

## Files Created

### 1. `/server/src/stellar/fetchTransactions.ts`
Fetches transactions that interacted with a contract from Horizon API.

**Key Functions:**
- `fetchTransactions()` - Fetch all transactions for a contract
- `fetchRecentTransactions()` - Fetch last N transactions

**Features:**
- Filters transactions by contract ID
- Handles pagination
- Returns transaction details (hash, fee, timestamp, etc.)

### 2. `/server/src/stellar/fetchEvents.ts`
Fetches events emitted by a contract using Soroban RPC API.

**Key Functions:**
- `fetchEvents()` - Fetch all events for a contract
- `fetchRecentEvents()` - Fetch last N events
- `countEvents()` - Count total events

**Features:**
- Uses Soroban RPC `getEvents` method
- Falls back to Horizon if RPC fails
- Transforms RPC events to standardized format

### 3. `/server/src/stellar/fetchContractBalance.ts`
Fetches contract account information from Horizon API.

**Key Functions:**
- `fetchContractBalance()` - Get contract account info
- `contractExists()` - Check if contract account exists

**Features:**
- Checks if contract account exists
- Gets balance and account flags
- Handles non-existent accounts gracefully

### 4. `/server/src/routes/stats.ts`
Main statistics route handler.

**Endpoints:**
- `GET /api/contracts/:id/stats` - Comprehensive statistics
- `GET /api/contracts/:id/transactions` - List transactions
- `GET /api/contracts/:id/events` - List events

**Statistics Returned:**
- Total transactions count
- Total events count
- Recent transactions (10 items)
- Average fee/gas
- Last interaction timestamp
- Account information

## API Response Format

### GET /api/contracts/:id/stats

```json
{
  "success": true,
  "stats": {
    "contractId": "CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...",
    "contractName": "counter",
    "network": "testnet",
    "totalTransactions": 42,
    "totalEvents": 38,
    "recentTransactions": [
      {
        "id": "1234567890",
        "hash": "abc123...",
        "ledger": 12345,
        "created_at": "2024-01-01T00:00:00Z",
        "fee_charged": "0.00001",
        "operation_count": 1,
        "successful": true,
        "paging_token": "1234567890"
      }
    ],
    "averageFee": "0.0000100",
    "lastInteraction": "2024-01-01T00:00:00Z",
    "accountInfo": {
      "exists": true,
      "balance": "0.5"
    }
  }
}
```

## Usage Examples

### Fetch Statistics
```bash
curl http://localhost:3001/api/contracts/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH.../stats
```

### Fetch Transactions
```bash
curl http://localhost:3001/api/contracts/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH.../transactions?limit=20
```

### Fetch Events
```bash
curl http://localhost:3001/api/contracts/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH.../events?limit=50
```

## Implementation Details

### Transaction Fetching
- Uses Horizon API `/transactions` endpoint
- Filters transactions by checking operations for contract involvement
- Handles pagination with cursor-based approach
- Default limit: 200 transactions

### Event Fetching
- Primary: Soroban RPC `getEvents` method
- Fallback: Horizon API (limited support)
- Filters by contract ID
- Default limit: 200 events

### Statistics Calculation
- **Total Transactions**: Count of all transactions involving contract
- **Total Events**: Count of all events emitted by contract
- **Average Fee**: Sum of fees / transaction count
- **Last Interaction**: Most recent transaction or event timestamp

## Performance Considerations

- All data fetching happens in parallel using `Promise.all()`
- Transactions and events are fetched with reasonable limits
- Statistics are calculated on-demand (no caching yet)
- Future: Add caching layer for frequently accessed contracts

## Error Handling

- Graceful degradation if APIs fail
- Returns empty arrays instead of errors where appropriate
- Logs errors for debugging
- Returns user-friendly error messages

## Network Support

- **Testnet**: `https://horizon-testnet.stellar.org` and `https://soroban-testnet.stellar.org:443`
- **Mainnet**: `https://horizon.stellar.org` and `https://soroban-mainnet.stellar.org:443`

## Next Steps

- [ ] Add caching layer for statistics
- [ ] Implement polling service for automatic updates
- [ ] Add WebSocket support for real-time updates
- [ ] Add statistics aggregation over time periods
- [ ] Add filtering and sorting options

