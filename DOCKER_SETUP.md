# Docker Setup Guide

## Overview

This project includes Docker support for both the backend and frontend services. Both services are configured to run on testnet by default.

## Files Created

- **`server/Dockerfile`** - Backend service container
- **`Dockerfile`** - Frontend service container (root)
- **`docker-compose.yml`** - Orchestrates both services
- **`.dockerignore`** - Frontend build exclusions
- **`server/.dockerignore`** - Backend build exclusions

## Quick Start

### Build and Run All Services

```bash
docker compose up --build
```

This will:
1. Build both backend and frontend images
2. Start both services
3. Backend available at `http://localhost:3001`
4. Frontend available at `http://localhost:3000`

### Run in Background

```bash
docker compose up -d --build
```

### View Logs

```bash
# All services
docker compose logs -f

# Backend only
docker compose logs -f backend

# Frontend only
docker compose logs -f frontend
```

### Stop Services

```bash
docker compose down
```

### Stop and Remove Volumes

```bash
docker compose down -v
```

## Services

### Backend Service

- **Container**: `stellar-backend`
- **Port**: `3001`
- **Health Check**: `/health` endpoint
- **Volumes**:
  - `./server/data` → SQLite database persistence
  - `./contracts` → Contract source code (read-only)

### Frontend Service

- **Container**: `stellar-frontend`
- **Port**: `3000`
- **Health Check**: HTTP check on port 3000
- **Depends on**: Backend service (waits for healthy)

## Environment Variables

### Backend (docker-compose.yml)

```yaml
environment:
  - NODE_ENV=production
  - PORT=3001
  - FRONTEND_URL=http://localhost:3000
  - DEFAULT_NETWORK=testnet
  - SOROBAN_CLI_PATH=soroban-cli
  - LOG_LEVEL=info
```

### Frontend (docker-compose.yml)

```yaml
environment:
  - NODE_ENV=production
  - NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Customization

### Change Network (Mainnet)

Edit `docker-compose.yml`:

```yaml
backend:
  environment:
    - DEFAULT_NETWORK=mainnet
```

### Change Ports

Edit `docker-compose.yml`:

```yaml
services:
  backend:
    ports:
      - "3002:3001"  # Host:Container
  frontend:
    ports:
      - "3001:3000"  # Host:Container
```

### Add Environment Variables

Edit `docker-compose.yml` and add to `environment` section:

```yaml
backend:
  environment:
    - YOUR_VAR=value
```

Or use `.env` file:

```bash
# Create .env file
cat > .env << EOF
BACKEND_PORT=3001
FRONTEND_PORT=3000
DEFAULT_NETWORK=testnet
EOF
```

Then reference in `docker-compose.yml`:

```yaml
backend:
  ports:
    - "${BACKEND_PORT}:3001"
```

## Building Individual Services

### Build Backend Only

```bash
docker build -t stellar-backend ./server
```

### Build Frontend Only

```bash
docker build -t stellar-frontend .
```

### Run Individual Container

```bash
# Backend
docker run -p 3001:3001 \
  -v $(pwd)/server/data:/app/data \
  -v $(pwd)/contracts:/app/contracts:ro \
  -e DEFAULT_NETWORK=testnet \
  stellar-backend

# Frontend
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3001 \
  stellar-frontend
```

## Troubleshooting

### Backend Won't Start

1. Check logs: `docker compose logs backend`
2. Verify port 3001 is available: `lsof -i :3001`
3. Check database directory permissions: `ls -la server/data`

### Frontend Won't Connect to Backend

1. Verify backend is healthy: `curl http://localhost:3001/health`
2. Check `NEXT_PUBLIC_API_URL` environment variable
3. Ensure backend service is running: `docker compose ps`

### Build Fails

1. Clear Docker cache: `docker compose build --no-cache`
2. Check Dockerfile syntax
3. Verify all dependencies are listed in package.json

### Database Not Persisting

1. Check volume mount: `docker compose config | grep volumes`
2. Verify `server/data` directory exists
3. Check file permissions: `ls -la server/data`

## Production Considerations

### Security

- Don't commit `.env` files
- Use Docker secrets for sensitive data
- Run containers as non-root user (already configured)
- Use HTTPS in production

### Performance

- Use multi-stage builds (already implemented)
- Enable Next.js standalone output (already configured)
- Consider using Docker layer caching
- Use production Node.js images

### Monitoring

- Add health checks (already included)
- Set up logging aggregation
- Monitor container resources
- Use Docker stats: `docker stats`

## Notes

- **Soroban CLI**: The backend Dockerfile doesn't include soroban-cli. For contract deployment, you may need to:
  1. Install soroban-cli in the container
  2. Use a base image with Rust/soroban-cli
  3. Mount soroban-cli binary as volume

- **Database**: SQLite database is persisted in `./server/data` volume

- **Contracts**: Contract source code is mounted read-only from `./contracts`

- **Network**: Both services default to testnet. Change `DEFAULT_NETWORK` for mainnet.

## Example Workflow

```bash
# 1. Build and start services
docker compose up --build

# 2. In another terminal, check services
docker compose ps

# 3. View backend logs
docker compose logs -f backend

# 4. Access frontend
open http://localhost:3000

# 5. Access backend API
curl http://localhost:3001/health

# 6. Stop services
docker compose down
```

## Additional Commands

### Rebuild Specific Service

```bash
docker compose build backend
docker compose up -d backend
```

### Execute Command in Container

```bash
# Backend
docker compose exec backend sh

# Frontend
docker compose exec frontend sh
```

### View Container Resource Usage

```bash
docker stats
```

### Clean Up

```bash
# Remove containers
docker compose down

# Remove containers and volumes
docker compose down -v

# Remove images
docker compose down --rmi all

# Remove everything (containers, volumes, images)
docker compose down -v --rmi all
```

