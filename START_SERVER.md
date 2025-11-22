# Starting the Backend Server

If you're getting "Failed to fetch" errors, the backend server is not running.

## Quick Start

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm run build
   npm start
   ```

4. **Verify server is running:**
   - You should see: `🚀 Server running on http://localhost:3001`
   - Test in browser: http://localhost:3001/health

## Troubleshooting

### Port 3001 already in use
```bash
# Find what's using the port
lsof -i :3001

# Kill the process or change PORT in server/.env
```

### Missing dependencies
```bash
cd server
npm install
```

### Environment variables
Create `server/.env` file:
```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Running Both Frontend and Backend

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Both should be running:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

