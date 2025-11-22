# 🚀 Implementation Guide: Soroban Contract Dashboard

## Quick Overview

This guide provides a complete plan to add Soroban smart contract deployment, tracking, and real-time dashboard capabilities to the existing Stellar frontend template.

## 📋 What You're Building

1. **Automatic Contract Deployment**: Deploy Soroban contracts via UI using soroban-cli
2. **Contract Statistics**: Track tx count, events, fees, and latest operations
3. **Real-Time Dashboard**: Live charts and statistics updates via WebSocket
4. **Lightweight Backend**: Small Node/Express service under `/server`

## 📚 Documentation Files

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete system architecture and design
- **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** - New files and folder organization
- **[TASKS.md](./TASKS.md)** - Detailed task breakdown (8 phases)
- **[ROADMAP.md](./ROADMAP.md)** - 3-day hackathon timeline

## 🎯 Key Features

### Backend (`/server`)
- Express.js API server
- Contract deployment via soroban-cli
- Statistics tracking from Horizon API
- WebSocket server for real-time updates
- JSON file storage (lightweight, no database)

### Frontend (Existing + New)
- Contract deployment UI component
- Real-time dashboard with charts
- Statistics display cards
- WebSocket client for live updates
- Integration with existing React components

## 🏗️ Architecture Summary

```
Frontend (Next.js)  ←→  Backend (Express)  ←→  Stellar Network
     ↓                        ↓                        ↓
- React Components      - API Routes           - Soroban Contracts
- Charts (Recharts)     - Services            - Horizon API
- WebSocket Client      - CLI Integration     - Events & Operations
```

## 📦 Technology Stack

### Frontend
- Next.js 14 (React 18) - *existing*
- Tailwind CSS - *existing*
- Recharts - *new* (for charts)
- WebSocket API - *new*

### Backend
- Node.js 18+ - *new*
- Express.js - *new*
- TypeScript - *new*
- ws (WebSocket) - *new*
- multer (file upload) - *new*

### External
- soroban-cli - *required*
- Horizon API - *existing*

## 🚦 Quick Start

### 1. Prerequisites
```bash
# Check Node.js version
node --version  # Should be 18+

# Check soroban-cli
soroban-cli --version  # Should be installed
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install recharts date-fns
```

**Backend:**
```bash
cd server
npm init -y
npm install express cors ws multer dotenv
npm install -D typescript @types/express @types/ws @types/multer ts-node
```

### 3. Project Structure
```
stellar-frontend-challenge/
├── server/              # NEW - Backend service
│   ├── routes/         # API endpoints
│   ├── services/       # Business logic
│   ├── utils/          # CLI & Horizon wrappers
│   └── data/           # JSON storage
├── components/         # EXISTING + NEW components
│   ├── ContractDeployment.tsx    # NEW
│   ├── ContractDashboard.tsx     # NEW
│   └── RealTimeCharts.tsx        # NEW
└── lib/                # EXISTING + NEW utilities
    ├── api-client.ts              # NEW
    └── websocket-client.ts        # NEW
```

## 📝 Implementation Phases

### Phase 1: Backend Setup (Day 1 Morning)
- Set up Express server
- Integrate soroban-cli
- Create file upload system

### Phase 2: Deployment API (Day 1 Afternoon)
- Build deployment endpoints
- Store contract metadata
- Test deployment flow

### Phase 3: Statistics (Day 2 Morning)
- Connect to Horizon API
- Calculate statistics
- Create statistics endpoints

### Phase 4: Real-Time (Day 2 Afternoon)
- Set up WebSocket server
- Implement background polling
- Broadcast updates

### Phase 5: Frontend (Day 3)
- Build UI components
- Integrate charts
- Connect to backend

## 🎨 UI Components to Build

1. **ContractDeployment.tsx**
   - File upload (drag & drop)
   - Network selection
   - Deployment progress
   - Success/error display

2. **ContractDashboard.tsx**
   - Main dashboard container
   - Contract selector
   - Statistics cards
   - Chart integration

3. **ContractStats.tsx**
   - Transaction count
   - Total fees
   - Latest operation
   - Events count

4. **RealTimeCharts.tsx**
   - Line chart (transactions over time)
   - Area chart (fees over time)
   - Pie chart (operations by type)

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contracts/deploy` | Deploy contract |
| GET | `/api/contracts` | List contracts |
| GET | `/api/contracts/:id/stats` | Get statistics |
| GET | `/api/contracts/:id/operations` | Get operations |
| GET | `/api/contracts/:id/events` | Get events |
| WS | `/ws/contracts/:id` | Real-time updates |

## 📊 Data Flow

### Deployment Flow
```
User uploads WASM → Frontend → POST /api/contracts/deploy 
→ Backend executes soroban-cli → Stores metadata → Returns contract ID
```

### Statistics Flow
```
Backend polls Horizon (30s) → Calculates stats → Caches data 
→ Frontend requests → Returns cached stats
```

### Real-Time Flow
```
Backend detects change → WebSocket broadcast → Frontend receives 
→ Charts update automatically
```

## ⚙️ Configuration

### Backend `.env`
```env
PORT=3001
HORIZON_URL=https://horizon-testnet.stellar.org
NETWORK_PASSPHRASE=Test SDF Network ; September 2015
SOROBAN_CLI_PATH=soroban-cli
UPLOAD_DIR=./contracts
```

### Frontend API Config
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
```

## 🧪 Testing Checklist

- [ ] Backend server starts successfully
- [ ] Contract deployment works end-to-end
- [ ] Statistics API returns correct data
- [ ] WebSocket connects and receives updates
- [ ] Charts display data correctly
- [ ] Real-time updates work
- [ ] Mobile responsive
- [ ] Error handling works

## 🐛 Common Issues & Solutions

### Issue: soroban-cli not found
**Solution**: Ensure soroban-cli is in PATH or set `SOROBAN_CLI_PATH` in `.env`

### Issue: CORS errors
**Solution**: Configure CORS in Express to allow frontend origin

### Issue: WebSocket connection fails
**Solution**: Check WebSocket URL format and server is running

### Issue: Charts not updating
**Solution**: Verify WebSocket connection and data format

## 📈 Success Metrics

- ✅ Can deploy contract via UI
- ✅ Statistics display correctly
- ✅ Charts update in real-time
- ✅ Works on mobile devices
- ✅ Error handling is user-friendly

## 🎯 Demo Flow (3 minutes)

1. **Deploy Contract** (30s)
   - Upload WASM → Deploy → Show contract ID

2. **View Statistics** (30s)
   - Show transaction count, fees, latest operation

3. **Real-Time Updates** (60s)
   - Trigger operation → Watch stats update → Show charts

4. **Dashboard Tour** (60s)
   - Navigate contracts → Show charts → Mobile view

## 📖 Next Steps

1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed design
2. Review [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for file organization
3. Follow [TASKS.md](./TASKS.md) for implementation steps
4. Use [ROADMAP.md](./ROADMAP.md) for 3-day timeline

## 💡 Tips

- **Start Simple**: Get basic deployment working first
- **Test Often**: Test each feature as you build it
- **Use Libraries**: Don't reinvent charts, use Recharts
- **Keep It Light**: JSON files are fine for hackathon
- **Focus on Demo**: Working demo > perfect code

## 🔗 Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Horizon API](https://developers.stellar.org/api)
- [Recharts Documentation](https://recharts.org/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

**Ready to build? Start with [ROADMAP.md](./ROADMAP.md) Day 1! 🚀**

