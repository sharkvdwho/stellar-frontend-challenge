# Docker Quick Start

## 🚀 Quick Start Command

```bash
docker compose up --build
```

This will:
- Build both backend and frontend images
- Start both services
- Backend: `http://localhost:3001`
- Frontend: `http://localhost:3000`

## 📋 Services

### Backend
- **Port**: 3001
- **Health**: `http://localhost:3001/health`
- **Network**: Testnet (default)

### Frontend
- **Port**: 3000
- **URL**: `http://localhost:3000`
- **API**: Connects to `http://localhost:3001`

## 🔧 Common Commands

```bash
# Start services
docker compose up --build

# Start in background
docker compose up -d --build

# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild specific service
docker compose build backend
docker compose up -d backend
```

## 🌐 Network Configuration

Both services are configured for **testnet** by default.

To switch to mainnet, edit `docker-compose.yml`:
```yaml
backend:
  environment:
    - DEFAULT_NETWORK=mainnet
```

## 📦 Volumes

- `./server/data` - SQLite database (persisted)
- `./contracts` - Contract source code (read-only)

## ✅ Verification

After starting, verify services:

```bash
# Check backend
curl http://localhost:3001/health

# Check frontend
curl http://localhost:3000

# View running containers
docker compose ps
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Change ports in docker-compose.yml
ports:
  - "3002:3001"  # Backend
  - "3001:3000"  # Frontend
```

### Build fails
```bash
# Clean build
docker compose build --no-cache
```

### Services won't start
```bash
# Check logs
docker compose logs backend
docker compose logs frontend
```

For more details, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)

