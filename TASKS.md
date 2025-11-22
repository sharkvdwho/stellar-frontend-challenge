# ✅ Task List: Adapting Template for Soroban Contracts

## Phase 1: Backend Setup & Infrastructure

### 1.1 Backend Foundation
- [ ] Create `server/` directory structure
- [ ] Initialize `server/package.json` with Express dependencies
- [ ] Set up `server/tsconfig.json` for TypeScript compilation
- [ ] Create `server/index.ts` with basic Express server
- [ ] Configure CORS for frontend communication
- [ ] Set up environment variables (`.env.example`)
- [ ] Create `.gitignore` entries for backend files

### 1.2 CLI Integration
- [ ] Create `server/utils/sorobanCli.ts` wrapper
- [ ] Implement `deployContract()` function using child_process
- [ ] Add error handling for CLI execution
- [ ] Test soroban-cli availability check
- [ ] Implement contract deployment with proper error messages

### 1.3 File Upload System
- [ ] Install and configure `multer` for file uploads
- [ ] Create `server/utils/fileUpload.ts` for WASM file handling
- [ ] Add file validation (only .wasm files)
- [ ] Set up upload directory (`contracts/`)
- [ ] Implement file size limits

### 1.4 Data Storage
- [ ] Create `server/data/` directory
- [ ] Implement JSON file storage for contracts metadata
- [ ] Create `ContractMetadata` interface
- [ ] Implement `saveContract()` and `getContract()` functions
- [ ] Add file locking mechanism for concurrent writes

## Phase 2: Contract Deployment API

### 2.1 Deployment Routes
- [ ] Create `server/routes/contracts.ts`
- [ ] Implement `POST /api/contracts/deploy` endpoint
- [ ] Add request validation (file, network, deployer address)
- [ ] Integrate with ContractDeploymentService
- [ ] Return contract ID and deployment transaction hash
- [ ] Add error handling and status codes

### 2.2 Deployment Service
- [ ] Create `server/services/ContractDeploymentService.ts`
- [ ] Implement contract deployment workflow:
  - Save uploaded WASM file
  - Execute soroban-cli deploy command
  - Parse contract ID from output
  - Store metadata in contracts.json
  - Return deployment result
- [ ] Add rollback mechanism on failure

### 2.3 Contract Management
- [ ] Implement `GET /api/contracts` - List all contracts
- [ ] Implement `GET /api/contracts/:id` - Get contract details
- [ ] Add contract deletion endpoint (optional)
- [ ] Create contract metadata retrieval functions

## Phase 3: Statistics Tracking

### 3.1 Horizon Integration
- [ ] Create `server/utils/horizonClient.ts`
- [ ] Implement Horizon API client wrapper
- [ ] Add functions to fetch contract operations
- [ ] Implement event fetching from Horizon
- [ ] Add transaction history retrieval

### 3.2 Statistics Service
- [ ] Create `server/services/StatisticsService.ts`
- [ ] Implement `getContractStats(contractId)` function
- [ ] Calculate transaction count
- [ ] Calculate total fees paid
- [ ] Get latest operation details
- [ ] Count contract events
- [ ] Implement caching mechanism (30-second TTL)

### 3.3 Statistics API
- [ ] Create `server/routes/stats.ts`
- [ ] Implement `GET /api/contracts/:id/stats` endpoint
- [ ] Implement `GET /api/contracts/:id/operations` endpoint
- [ ] Implement `GET /api/contracts/:id/events` endpoint
- [ ] Add pagination for operations/events
- [ ] Return formatted JSON responses

### 3.4 Background Polling
- [ ] Create `server/services/ContractTrackingService.ts`
- [ ] Implement polling mechanism (30-second intervals)
- [ ] Update statistics cache automatically
- [ ] Track multiple contracts simultaneously
- [ ] Add graceful shutdown handling

## Phase 4: Real-Time Updates

### 4.1 WebSocket Server
- [ ] Install `ws` package
- [ ] Create WebSocket server in `server/index.ts`
- [ ] Implement connection handling
- [ ] Add room-based subscriptions (per contract)
- [ ] Handle client disconnections gracefully

### 4.2 Real-Time Data Streaming
- [ ] Integrate WebSocket with ContractTrackingService
- [ ] Broadcast statistics updates to subscribed clients
- [ ] Send new operation notifications
- [ ] Send new event notifications
- [ ] Implement message queuing for slow clients

### 4.3 WebSocket Routes
- [ ] Implement `/ws/contracts/:id` endpoint
- [ ] Add connection authentication (optional)
- [ ] Handle reconnection logic
- [ ] Add heartbeat/ping mechanism

## Phase 5: Frontend Components

### 5.1 API Client
- [ ] Create `lib/api-client.ts`
- [ ] Implement `deployContract()` function
- [ ] Implement `getContractStats()` function
- [ ] Implement `getContractOperations()` function
- [ ] Implement `getContractEvents()` function
- [ ] Add error handling and retry logic
- [ ] Add loading states management

### 5.2 WebSocket Client
- [ ] Create `lib/websocket-client.ts`
- [ ] Implement WebSocket connection wrapper
- [ ] Add automatic reconnection logic
- [ ] Implement subscription/unsubscription
- [ ] Add message queue for offline handling
- [ ] Create React hook `useContractUpdates()`

### 5.3 Contract Deployment UI
- [ ] Create `components/ContractDeployment.tsx`
- [ ] Add file upload input (drag & drop)
- [ ] Add network selection (testnet/mainnet)
- [ ] Add deployer address input/selection
- [ ] Show deployment progress
- [ ] Display deployment result (success/error)
- [ ] Add contract ID display with copy button

### 5.4 Contract Dashboard
- [ ] Create `components/ContractDashboard.tsx`
- [ ] Integrate ContractStats component
- [ ] Integrate RealTimeCharts component
- [ ] Add contract selector dropdown
- [ ] Implement refresh button
- [ ] Add loading and error states
- [ ] Make responsive for mobile

### 5.5 Statistics Display
- [ ] Create `components/ContractStats.tsx`
- [ ] Display transaction count card
- [ ] Display total fees card
- [ ] Display latest operation card
- [ ] Display events count card
- [ ] Add last updated timestamp
- [ ] Style with Tailwind CSS

### 5.6 Real-Time Charts
- [ ] Install chart library (Recharts or Chart.js)
- [ ] Create `components/RealTimeCharts.tsx`
- [ ] Implement transaction count over time (line chart)
- [ ] Implement fees over time (area chart)
- [ ] Implement operations by type (pie/bar chart)
- [ ] Add chart data formatting utilities
- [ ] Implement real-time chart updates
- [ ] Add chart configuration (colors, labels)

### 5.7 Contract List
- [ ] Create `components/ContractList.tsx`
- [ ] Display list of deployed contracts
- [ ] Show contract ID, name, network
- [ ] Add "View Dashboard" button
- [ ] Add contract deletion (optional)
- [ ] Style with cards/grid layout

### 5.8 Chart Utilities
- [ ] Create `lib/chart-utils.ts`
- [ ] Implement data aggregation functions
- [ ] Add time series formatting
- [ ] Implement data normalization
- [ ] Add color scheme helpers

## Phase 6: Integration & UI Updates

### 6.1 Main Page Integration
- [ ] Modify `app/page.tsx`
- [ ] Add ContractDeployment section
- [ ] Add ContractDashboard section
- [ ] Add navigation/routing between sections
- [ ] Update layout to accommodate new components
- [ ] Ensure responsive design

### 6.2 Styling & UX
- [ ] Match new components with existing design system
- [ ] Add loading skeletons for charts
- [ ] Add error boundaries
- [ ] Implement smooth transitions
- [ ] Add tooltips for statistics
- [ ] Ensure mobile responsiveness

### 6.3 Error Handling
- [ ] Add error messages for deployment failures
- [ ] Handle network errors gracefully
- [ ] Add retry mechanisms
- [ ] Display user-friendly error messages
- [ ] Log errors for debugging

## Phase 7: Testing & Documentation

### 7.1 Testing
- [ ] Test contract deployment flow end-to-end
- [ ] Test statistics tracking accuracy
- [ ] Test WebSocket reconnection
- [ ] Test with multiple contracts
- [ ] Test error scenarios
- [ ] Test mobile responsiveness

### 7.2 Documentation
- [ ] Update README.md with backend setup
- [ ] Add API documentation
- [ ] Document environment variables
- [ ] Add deployment instructions
- [ ] Create troubleshooting guide

### 7.3 Configuration
- [ ] Add configuration file for polling intervals
- [ ] Make chart update frequency configurable
- [ ] Add feature flags (optional)
- [ ] Document all configuration options

## Phase 8: Optimization & Polish

### 8.1 Performance
- [ ] Optimize chart rendering (debounce updates)
- [ ] Implement virtual scrolling for long lists
- [ ] Add request caching
- [ ] Optimize WebSocket message size
- [ ] Add loading states to prevent UI blocking

### 8.2 Code Quality
- [ ] Add TypeScript strict mode
- [ ] Add ESLint rules
- [ ] Format code with Prettier
- [ ] Add JSDoc comments
- [ ] Remove console.logs

### 8.3 Final Polish
- [ ] Add animations for chart updates
- [ ] Improve error messages
- [ ] Add success notifications
- [ ] Test on different browsers
- [ ] Verify all features work together

## Estimated Time Breakdown

- **Phase 1**: 4-6 hours
- **Phase 2**: 3-4 hours
- **Phase 3**: 4-5 hours
- **Phase 4**: 2-3 hours
- **Phase 5**: 6-8 hours
- **Phase 6**: 3-4 hours
- **Phase 7**: 2-3 hours
- **Phase 8**: 2-3 hours

**Total**: ~26-36 hours (3-4 days of focused work)

