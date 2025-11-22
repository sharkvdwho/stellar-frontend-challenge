# 🗓️ 3-Day Hackathon Roadmap

## Day 1: Backend Foundation & Contract Deployment (8-10 hours)

### Morning (4-5 hours): Setup & Core Infrastructure

**Hour 1-2: Project Setup**
- [ ] Create `server/` directory structure
- [ ] Initialize backend with Express + TypeScript
- [ ] Set up environment variables and configuration
- [ ] Create basic Express server with CORS
- [ ] Test server runs on port 3001

**Hour 3-4: CLI Integration**
- [ ] Install and verify soroban-cli availability
- [ ] Create `sorobanCli.ts` wrapper utility
- [ ] Implement basic contract deployment function
- [ ] Test deployment with sample WASM file
- [ ] Add error handling for CLI failures

**Hour 5: File Upload System**
- [ ] Set up Multer for file uploads
- [ ] Create upload directory structure
- [ ] Implement WASM file validation
- [ ] Test file upload endpoint

### Afternoon (4-5 hours): Deployment API

**Hour 6-7: Deployment Service**
- [ ] Create ContractDeploymentService
- [ ] Implement full deployment workflow
- [ ] Add contract metadata storage (JSON)
- [ ] Test end-to-end deployment flow

**Hour 8-9: API Routes**
- [ ] Create `/api/contracts/deploy` endpoint
- [ ] Create `/api/contracts` list endpoint
- [ ] Create `/api/contracts/:id` detail endpoint
- [ ] Test all endpoints with Postman/curl

**Hour 10: Integration Testing**
- [ ] Test deployment from frontend
- [ ] Fix any CORS/connection issues
- [ ] Verify contract metadata storage
- [ ] Document API endpoints

### End of Day 1 Deliverables
✅ Backend server running  
✅ Contract deployment working  
✅ API endpoints functional  
✅ Basic error handling  

---

## Day 2: Statistics Tracking & Real-Time Updates (8-10 hours)

### Morning (4-5 hours): Statistics System

**Hour 1-2: Horizon Integration**
- [ ] Create Horizon API client
- [ ] Implement contract operations fetching
- [ ] Implement events fetching
- [ ] Test data retrieval from Horizon

**Hour 3-4: Statistics Service**
- [ ] Create StatisticsService
- [ ] Implement transaction count calculation
- [ ] Implement fees calculation
- [ ] Implement latest operation tracking
- [ ] Add caching mechanism (30s TTL)

**Hour 5: Statistics API**
- [ ] Create `/api/contracts/:id/stats` endpoint
- [ ] Create `/api/contracts/:id/operations` endpoint
- [ ] Create `/api/contracts/:id/events` endpoint
- [ ] Test endpoints return correct data

### Afternoon (4-5 hours): Real-Time System

**Hour 6-7: WebSocket Server**
- [ ] Install and set up `ws` package
- [ ] Create WebSocket server
- [ ] Implement room-based subscriptions
- [ ] Test WebSocket connections

**Hour 8-9: Real-Time Tracking**
- [ ] Create ContractTrackingService
- [ ] Implement background polling (30s intervals)
- [ ] Integrate with WebSocket broadcasting
- [ ] Test real-time updates

**Hour 10: Frontend API Client**
- [ ] Create `lib/api-client.ts`
- [ ] Implement all API calls
- [ ] Create `lib/websocket-client.ts`
- [ ] Test frontend-backend communication

### End of Day 2 Deliverables
✅ Statistics tracking working  
✅ Real-time updates via WebSocket  
✅ Frontend can fetch contract data  
✅ Background polling operational  

---

## Day 3: Frontend Dashboard & Polish (8-10 hours)

### Morning (4-5 hours): Dashboard Components

**Hour 1-2: Contract Deployment UI**
- [ ] Create `ContractDeployment.tsx`
- [ ] Add file upload with drag & drop
- [ ] Add network selection
- [ ] Add deployment progress indicator
- [ ] Style with Tailwind CSS

**Hour 3-4: Statistics Display**
- [ ] Create `ContractStats.tsx` component
- [ ] Display transaction count, fees, events
- [ ] Add loading states
- [ ] Style stat cards

**Hour 5: Contract List**
- [ ] Create `ContractList.tsx`
- [ ] Display deployed contracts
- [ ] Add navigation to dashboard
- [ ] Style with grid layout

### Afternoon (4-5 hours): Charts & Integration

**Hour 6-7: Real-Time Charts**
- [ ] Install chart library (Recharts recommended)
- [ ] Create `RealTimeCharts.tsx`
- [ ] Implement transaction count line chart
- [ ] Implement fees area chart
- [ ] Implement operations pie chart
- [ ] Connect to WebSocket for updates

**Hour 8-9: Dashboard Integration**
- [ ] Create `ContractDashboard.tsx` main component
- [ ] Integrate all sub-components
- [ ] Add contract selector
- [ ] Update `app/page.tsx` with new sections
- [ ] Ensure responsive design

**Hour 10: Polish & Testing**
- [ ] Add error handling throughout
- [ ] Add loading skeletons
- [ ] Test on mobile devices
- [ ] Fix any UI/UX issues
- [ ] Add final styling touches

### End of Day 3 Deliverables
✅ Complete dashboard UI  
✅ Real-time charts working  
✅ All features integrated  
✅ Mobile responsive  
✅ Ready for demo!  

---

## Quick Start Checklist (Before Starting)

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] soroban-cli installed and in PATH
- [ ] Stellar wallet (Freighter/xBull) installed
- [ ] Testnet account with XLM for deployment fees
- [ ] Sample WASM contract file for testing

### Initial Setup (30 minutes)
```bash
# 1. Install frontend dependencies
npm install

# 2. Install chart library
npm install recharts date-fns

# 3. Create server directory
mkdir server
cd server

# 4. Initialize backend
npm init -y
npm install express cors ws multer dotenv
npm install -D typescript @types/express @types/ws @types/multer ts-node

# 5. Set up TypeScript
npx tsc --init

# 6. Create .env file
cp .env.example .env
# Edit .env with your settings
```

---

## Daily Milestones

### Day 1 Milestone
**Goal**: Deploy a contract successfully via API
- ✅ Backend server running
- ✅ Upload WASM file
- ✅ Execute deployment
- ✅ Return contract ID

### Day 2 Milestone
**Goal**: See contract statistics updating in real-time
- ✅ Statistics API working
- ✅ WebSocket broadcasting updates
- ✅ Frontend receiving real-time data

### Day 3 Milestone
**Goal**: Complete dashboard with charts
- ✅ All UI components built
- ✅ Charts displaying data
- ✅ Real-time updates working
- ✅ Mobile responsive

---

## Time Management Tips

1. **Prioritize Core Features**: Get deployment and basic stats working first
2. **Skip Non-Essentials**: Don't spend time on advanced features
3. **Reuse Components**: Leverage existing UI components
4. **Test Incrementally**: Test each feature as you build it
5. **Keep It Simple**: Use JSON files instead of databases
6. **Use Libraries**: Don't reinvent charts, use Recharts
7. **Focus on Demo**: Make sure demo flow works end-to-end

---

## Stretch Goals (If Time Permits)

- [ ] Contract interaction UI (invoke functions)
- [ ] Multiple contract comparison
- [ ] Export statistics to CSV
- [ ] Contract search/filter
- [ ] Dark mode toggle
- [ ] Contract deployment history
- [ ] Advanced chart types (candlestick, etc.)

---

## Troubleshooting Quick Reference

### Backend won't start
- Check port 3001 is available
- Verify Node.js version (18+)
- Check `.env` file exists

### Contract deployment fails
- Verify soroban-cli is installed: `soroban-cli --version`
- Check network passphrase matches
- Ensure deployer account has XLM

### WebSocket not connecting
- Check WebSocket URL format
- Verify server is running
- Check CORS settings

### Charts not updating
- Verify WebSocket connection
- Check data format matches chart expectations
- Look for console errors

---

## Demo Script (3 minutes)

1. **Show Contract Deployment** (30s)
   - Upload WASM file
   - Deploy to testnet
   - Show contract ID

2. **Show Statistics** (30s)
   - Display transaction count
   - Show total fees
   - Highlight latest operation

3. **Show Real-Time Updates** (60s)
   - Trigger a contract operation
   - Watch statistics update automatically
   - Show charts updating in real-time

4. **Show Dashboard** (60s)
   - Navigate through different contracts
   - Show various chart types
   - Highlight mobile responsiveness

---

**Good luck! 🚀 Remember: Working demo > Perfect code**

