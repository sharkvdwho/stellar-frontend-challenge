# Contract Analytics Page - Complete Implementation

## Overview

Complete analytics dashboard for deployed contracts showing statistics, charts, and event lists.

## Files Created/Updated

### 1. **`app/contract-analytics/[contractId]/page.tsx`** - Analytics Page
   - Dynamic route for contract analytics
   - Calls `GET /api/stats/:contractId`
   - Displays statistics cards
   - Shows charts and event tables
   - Refresh functionality

### 2. **`components/StatsChart.tsx`** - Chart Component (Updated)
   - Line chart for transactions over time
   - Bar chart for events by type
   - Uses Recharts library
   - Responsive design

### 3. **`components/EventList.tsx`** - Event Table Component (Updated)
   - Table format for events
   - Shows: Type, Topics, Value, Ledger, Timestamp, Transaction
   - Clickable transaction links
   - Responsive table

### 4. **`lib/api.ts`** - API Helper (Updated)
   - Updated `getContractStats()` to use `/api/stats/:contractId`
   - Fallback to legacy endpoint
   - Handles both response formats

## Features

### Statistics Cards
- ✅ **Total Transactions** - Blue gradient card
- ✅ **Total Events** - Purple gradient card
- ✅ **Avg Fee** - Green gradient card (XLM)
- ✅ **Last Activity** - Orange gradient card (timestamp)

### Charts
- ✅ **Line Chart** - Transactions over time (last 30 days)
- ✅ **Bar Chart** - Events grouped by type
- ✅ Uses Recharts library
- ✅ Responsive containers
- ✅ Custom styling matching template

### Event List
- ✅ **Table Format** - Clean, organized display
- ✅ Columns: Type, Topics, Value, Ledger, Timestamp, Transaction
- ✅ Clickable transaction links (Stellar Expert)
- ✅ Truncated long values
- ✅ Empty state handling

## API Integration

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

## Routing

**Next.js App Router:**
- Route: `/contract-analytics/[contractId]`
- Dynamic route parameter: `contractId`
- Example: `/contract-analytics/CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNCH...`

## Components

### StatsChart
```tsx
<StatsChart
  transactions={transactions}
  events={events}
  chartType="line" | "bar"
/>
```

**Props:**
- `transactions: ContractTransaction[]` - For line chart
- `events?: ContractEvent[]` - For bar chart
- `chartType?: 'line' | 'bar'` - Chart type

### EventList
```tsx
<EventList
  events={events}
  contractId={contractId}
/>
```

**Props:**
- `events: ContractEvent[]` - Array of events
- `contractId: string` - Contract ID for links

## UI Features

### Header
- Contract name display
- Back button
- Refresh button with loading state

### Contract ID Display
- Full contract ID with copy button
- Visual feedback on copy

### Statistics Cards
- Gradient backgrounds
- Large numbers
- Color-coded by metric
- Responsive grid (4 columns on desktop)

### Charts
- Responsive containers
- Custom tooltips
- Styled axes and legends
- Empty state handling

### Event Table
- Sortable columns
- Hover effects
- External links to Stellar Expert
- Truncated long values

## Styling

- ✅ Matches existing template design
- ✅ Gradient backgrounds
- ✅ Glass-morphism effects
- ✅ Responsive layout
- ✅ Color-coded cards
- ✅ Consistent spacing

## Error Handling

- ✅ Loading states
- ✅ Error alerts
- ✅ Empty states for charts
- ✅ Fallback to legacy API endpoint
- ✅ Graceful error recovery

## Usage

1. Navigate to `/contract-analytics/[contractId]`
2. Page loads statistics automatically
3. View statistics cards
4. See transaction line chart
5. See events bar chart
6. Browse event table
7. Click "Refresh" to update data
8. Click transaction links to view on Stellar Expert

## Notes

- Page uses Next.js App Router (not React Router)
- Route is at `app/contract-analytics/[contractId]/page.tsx`
- API helper handles both new and legacy endpoints
- Charts use Recharts library
- All styling matches existing template

