# Activity Timeline Component - Complete Implementation

## Overview

Timeline component that visualizes contract activity in chronological order, combining events and transactions into a unified timeline view.

## Files Created/Updated

### 1. **`components/ActivityTimeline.tsx`** - Timeline Component (NEW)
   - Combines events and transactions into a single timeline
   - Shows chronological activity
   - Displays timestamps, tx hash, event type
   - Visual timeline with dots and connecting line

### 2. **`app/contract-analytics/[contractId]/page.tsx`** - Analytics Page (UPDATED)
   - Integrated ActivityTimeline component
   - Placed above Event List Table
   - Passes events and transactions to timeline

## Features

### Timeline Items
- ✅ **Events** - Purple badges with event type
- ✅ **Transactions** - Blue badges (success) or red badges (failed)
- ✅ **Chronological Order** - Sorted by timestamp (newest first)
- ✅ **Visual Timeline** - Vertical line with colored dots

### Display Information
- ✅ **Timestamp** - Formatted date and time
- ✅ **Time Ago** - Human-readable relative time
- ✅ **Transaction Hash** - Truncated hash with link to Stellar Expert
- ✅ **Event Type** - Type of event (if applicable)
- ✅ **Ledger Number** - Ledger where activity occurred
- ✅ **Transaction Fee** - Fee for transactions
- ✅ **Success Status** - Success/failed indicator for transactions
- ✅ **Event Topics** - First 3 topics for events

### Visual Design
- ✅ **Timeline Line** - Gradient vertical line connecting items
- ✅ **Colored Dots** - Purple for events, blue for success, red for failed
- ✅ **Hover Effects** - Cards highlight on hover
- ✅ **Responsive Layout** - Works on all screen sizes
- ✅ **Empty State** - Friendly message when no activity

## Component Props

```typescript
interface ActivityTimelineProps {
  events: ContractEvent[];
  transactions: ContractTransaction[];
}
```

## Timeline Item Structure

```typescript
interface TimelineItem {
  id: string;
  type: 'event' | 'transaction';
  timestamp: string;
  txHash?: string;
  eventType?: string;
  ledger?: number;
  successful?: boolean;
  fee?: string;
  data?: any;
}
```

## Integration

### In ContractAnalytics Page

```tsx
<ActivityTimeline 
  events={events} 
  transactions={transactions} 
/>
```

**Placement:**
- Located above Event List Table
- Shows combined activity view
- Provides chronological context

## Visual Features

### Timeline Line
- Vertical gradient line connecting all items
- Colors: blue → purple → violet
- Positioned on the left side

### Timeline Dots
- **Events**: Purple circle with purple border
- **Success Transactions**: Blue circle with blue border
- **Failed Transactions**: Red circle with red border
- Size: 12px (48px container)

### Item Cards
- Glass-morphism effect
- Hover state: increased opacity
- Border: white/10
- Rounded corners

### Badges
- **Event Badge**: Purple background, "📢 Event"
- **Transaction Badge**: Blue/red background, "💸 Transaction"
- **Success Indicator**: Green checkmark or red X
- **Event Type**: Displayed next to event badge

## Time Display

### Timestamp Format
- **Full Date**: "MMM dd, HH:mm" (e.g., "Jan 15, 14:30")
- **Time Ago**: Relative time (e.g., "2h ago", "3d ago")
- **Just Now**: For very recent activity (< 1 minute)

### Time Ago Logic
- < 1 minute: "Just now"
- < 60 minutes: "Xm ago"
- < 24 hours: "Xh ago"
- < 7 days: "Xd ago"
- ≥ 7 days: Full date

## Links

### Transaction Links
- Clickable "View TX" link
- Opens Stellar Expert explorer
- External link icon
- Testnet explorer URL

## Styling

- ✅ Matches existing template design
- ✅ Gradient backgrounds
- ✅ Glass-morphism effects
- ✅ Color-coded by type
- ✅ Responsive layout
- ✅ Consistent spacing

## Empty State

When no activity:
- Large emoji icon (📭)
- "No activity recorded yet" message
- Helpful hint about future activity

## Usage Example

```tsx
import ActivityTimeline from '@/components/ActivityTimeline';

<ActivityTimeline
  events={[
    {
      id: '1',
      type: 'contract',
      timestamp: '2024-01-15T10:00:00Z',
      txHash: 'abc123...',
      topic: ['increment', 'counter'],
      ledger: 12345,
    }
  ]}
  transactions={[
    {
      id: '1',
      hash: 'abc123...',
      created_at: '2024-01-15T10:00:00Z',
      successful: true,
      fee_charged: '0.0000100',
      ledger: 12345,
    }
  ]}
/>
```

## Notes

- Timeline combines both events and transactions
- Sorted by timestamp (newest first)
- Visual distinction between event types
- Clickable transaction links
- Responsive design for mobile/desktop
- Empty state handling

