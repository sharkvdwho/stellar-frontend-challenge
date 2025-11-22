# 🚀 AstroDeploy - Smart Contract Deployment & Analytics Platform

> **One-click deployment and real-time analytics for Soroban smart contracts on Stellar**

AstroDeploy is a full-stack platform that simplifies the deployment, monitoring, and analysis of Soroban smart contracts on the Stellar network. Built with Next.js, Express.js, and Rust, it provides a seamless experience from contract selection to deployment and analytics.

[![Stellar](https://img.shields.io/badge/Stellar-Testnet-blue)](https://stellar.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![Soroban](https://img.shields.io/badge/Soroban-Smart%20Contracts-purple)](https://soroban.stellar.org)

---

## 📋 Table of Contents

- [Features](#-features)
- [Screenshots](#-screenshots)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Features](#-key-features)
- [API Endpoints](#-api-endpoints)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎯 Core Functionality

- **One-Click Deployment** - Deploy Soroban contracts with automatic compilation
- **Contract Templates** - Browse and deploy from a library of pre-built contract templates
- **Real-Time Analytics** - Monitor contract activity with live statistics and charts
- **Code Audit** - Automated security checks and code quality analysis before deployment
- **Transaction Tracking** - View detailed transaction history and event logs
- **Wallet Integration** - Connect with Stellar wallets (Freighter, xBull, etc.)
- **Multi-Contract Management** - Track and manage multiple deployed contracts

### 🔒 Security & Quality

- **Pre-deployment Validation** - Security checks and code quality analysis
- **Fee Estimation** - Know deployment costs before deploying
- **Network Status** - Real-time network connectivity and latency monitoring
- **Access Control** - Secure wallet-based authentication

### 📊 Analytics & Monitoring

- **Statistics Dashboard** - Total transactions, events, average fees, last activity
- **Interactive Charts** - Visualize transaction trends and event patterns
- **Activity Timeline** - Chronological view of contract interactions
- **Event Logs** - Detailed event emission tracking
- **Auto-Refresh** - Real-time updates every 10 seconds

---

## 📸 Screenshots

### Dashboard Overview

![Dashboard](./screenshots/dashboard.png)

The main dashboard provides an overview of all deployed contracts with key statistics and recent activity.

### Deployment Interface

![Deployment](./screenshots/deployment.png)

One-click contract deployment with code audit, security checks, and fee estimation.

### Code Audit & Security

![Code Audit](./screenshots/code-audit.png)

Automated security vulnerability scanning and code quality analysis before deployment.

### Contract Analytics

![Analytics](./screenshots/analytics.png)

Real-time contract analytics with interactive charts, transaction history, and event logs.

### Contract Templates

![Templates](./screenshots/templates.png)

Browse and deploy from a library of pre-built contract templates with detailed information.

### My Contracts

![My Contracts](./screenshots/my-contracts.png)

Manage all your deployed contracts in one place with quick access to analytics.

---

## 🏗️ Architecture

AstroDeploy consists of three main components:

### 1. **Frontend** (Next.js 14 + TypeScript)
- React-based UI with App Router
- Tailwind CSS for styling
- Client-side state management with localStorage
- Real-time data visualization with Recharts

### 2. **Backend** (Express.js + TypeScript)
- RESTful API for contract operations
- Shell command execution for Soroban CLI
- JSON-based database for deployment tracking
- Integration with Stellar Horizon API and Soroban RPC

### 3. **Smart Contracts** (Rust + Soroban SDK)
- Soroban smart contracts in `contracts/` directory
- Automatic compilation to WASM
- Template-based contract structure

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Rust 1.70+** - [Install Rust](https://rustup.rs/)
- **soroban-cli** - Soroban command-line tool (see [Installation](#installation))

### Optional

- **Stellar Wallet** - [Freighter](https://freighter.app) (recommended) or [xBull](https://xbull.app)
- **Git** - For cloning the repository

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd stellar-frontend-challenge
```

### Step 2: Install Frontend Dependencies

```bash
# Install frontend dependencies
npm install
```

### Step 3: Install Backend Dependencies

```bash
# Navigate to server directory
cd server
npm install
cd ..
```

### Step 4: Install Rust and Soroban CLI

#### Install Rust

```bash
# Install Rust using rustup
curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Reload your shell configuration
source ~/.cargo/env
```

#### Add WASM Target

```bash
# Add the wasm32 target for Soroban contracts
rustup target add wasm32-unknown-unknown
```

#### Install Soroban CLI

```bash
# Install soroban-cli using Cargo
cargo install --locked soroban-cli

# Verify installation
soroban --version
```

> **Note**: This may take 10-30 minutes as it compiles from source. See [INSTALL_SOROBAN.md](./INSTALL_SOROBAN.md) for detailed instructions.

### Step 5: Verify Installation

```bash
# Check Rust version
rustc --version

# Check Cargo version
cargo --version

# Check Soroban CLI
soroban --version

# Verify wasm32 target
rustup target list --installed | grep wasm32-unknown-unknown
```

---

## 🎬 Getting Started

### Starting the Backend Server

1. **Navigate to server directory:**

```bash
cd server
```

2. **Start the development server:**

```bash
npm run dev
```

The backend server will start on `http://localhost:3001`

> **Note**: Make sure `soroban-cli` is installed and in your PATH. The server will automatically detect it in `$HOME/.cargo/bin`.

### Starting the Frontend

1. **Open a new terminal** (keep the backend running)

2. **Navigate to project root:**

```bash
cd /path/to/stellar-frontend-challenge
```

3. **Start the Next.js development server:**

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

### Access the Application

Open your browser and navigate to:
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

---

## 📁 Project Structure

```
stellar-frontend-challenge/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Main dashboard
│   ├── deploy/                   # Deployment interface
│   │   └── page.tsx
│   ├── my-contracts/             # Contract management
│   │   └── page.tsx
│   ├── templates/                # Contract templates
│   │   └── page.tsx
│   └── contract-analytics/       # Analytics dashboard
│       └── [contractId]/
│           └── page.tsx
├── components/                   # React components
│   ├── Navbar.tsx                # Shared navigation
│   ├── StatsChart.tsx            # Chart components
│   ├── EventList.tsx             # Event display
│   └── ActivityTimeline.tsx     # Timeline component
├── lib/                          # Utility libraries
│   ├── api.ts                    # API client
│   ├── storage.ts                # localStorage helpers
│   ├── templates.ts              # Template loader
│   ├── useWallet.ts              # Wallet hook
│   └── stellar-helper.ts         # Stellar SDK wrapper
├── server/                       # Backend Express server
│   ├── src/
│   │   ├── index.ts              # Server entry point
│   │   ├── routes/               # API routes
│   │   │   ├── deploy.ts        # Deployment endpoint
│   │   │   └── stats.ts         # Analytics endpoint
│   │   ├── services/            # Business logic
│   │   │   ├── compile.ts       # Contract compilation
│   │   │   └── deploy.ts        # Contract deployment
│   │   ├── stellar/             # Stellar integration
│   │   │   ├── fetchTransactions.ts
│   │   │   ├── fetchEvents.ts
│   │   │   └── computeStats.ts
│   │   └── db.ts                # JSON database
│   └── package.json
├── contracts/                    # Soroban smart contracts
│   ├── counter/                  # Counter contract example
│   │   ├── Cargo.toml
│   │   └── src/lib.rs
│   ├── token/                    # Token contract
│   ├── nft/                      # NFT contract
│   └── ...                       # More contracts
├── contract-templates/           # Contract template definitions
│   ├── counter.json
│   └── template-schema.json
└── package.json                 # Frontend dependencies
```

---

## 🔑 Key Features

### 1. Contract Deployment

- **Template Selection**: Choose from pre-built contract templates
- **Automatic Compilation**: Contracts are compiled to WASM automatically
- **Network Selection**: Deploy to Testnet or Mainnet
- **Deployment Tracking**: All deployments saved to localStorage

### 2. Code Audit & Security

- **Security Checks**: Automated vulnerability scanning
  - Reentrancy protection
  - Integer overflow/underflow checks
  - Access control validation
  - Input validation
- **Code Quality**: Structure and best practices analysis
- **Fee Estimation**: Know costs before deploying
- **Network Status**: Real-time connectivity monitoring

### 3. Contract Analytics

- **Statistics Dashboard**: 
  - Total transactions
  - Total events
  - Average fees
  - Last activity timestamp
- **Interactive Charts**: 
  - Transaction trends over time
  - Event distribution
- **Activity Timeline**: Chronological view of all interactions
- **Event Logs**: Detailed event emission tracking

### 4. Contract Management

- **My Contracts**: View all deployed contracts
- **Quick Access**: Direct links to analytics
- **Transaction Counts**: Track activity per contract
- **Local Storage**: Persistent contract tracking

---

## 🔌 API Endpoints

### Deployment

- `POST /api/deploy` - Deploy a contract
  ```json
  {
    "contractPath": "contracts/counter",
    "contractName": "counter",
    "network": "testnet",
    "deployerSecret": "S..."
  }
  ```

### Analytics

- `GET /api/stats/:contractId` - Get contract statistics
- `GET /api/contracts` - List all deployments
- `GET /api/contracts/:id` - Get specific contract details

---

## 🛠️ Development

### Frontend Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Backend Development

```bash
cd server

# Start development server with hot reload
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Type check
npm run type-check
```

### Contract Development

```bash
# Navigate to contract directory
cd contracts/counter

# Build contract
soroban contract build

# Test contract (if tests exist)
cargo test
```

---

## 🐛 Troubleshooting

### Backend Issues

#### `soroban: not found`

**Problem**: Soroban CLI is not installed or not in PATH.

**Solution**:
1. Install soroban-cli: `cargo install --locked soroban-cli`
2. Add to PATH: `export PATH="$HOME/.cargo/bin:$PATH"`
3. Restart the backend server

See [INSTALL_SOROBAN.md](./INSTALL_SOROBAN.md) for detailed instructions.

#### Contract compilation fails

**Problem**: Contract directory not found or compilation errors.

**Solution**:
1. Verify contract exists in `contracts/` directory
2. Check `Cargo.toml` is present
3. Ensure Rust and wasm32 target are installed
4. Check server logs for detailed error messages

#### Port already in use

**Problem**: Port 3001 is already in use.

**Solution**:
```bash
# Find process using port 3001
lsof -i :3001

# Kill the process or change port in server/src/index.ts
```

### Frontend Issues

#### `Failed to fetch` error

**Problem**: Backend server is not running.

**Solution**:
1. Ensure backend is running on `http://localhost:3001`
2. Check CORS settings in backend
3. Verify API URL in `lib/api.ts`

#### Wallet connection fails

**Problem**: Wallet extension not installed or not connected.

**Solution**:
1. Install a Stellar wallet (Freighter recommended)
2. Create or import a testnet account
3. Refresh the page and try again

#### Mock data not showing

**Problem**: localStorage might be cleared or mock data not initialized.

**Solution**:
1. Clear localStorage and refresh
2. Mock data initializes automatically on first load
3. Check browser console for errors

---

## 📚 Additional Documentation

- [INSTALL_SOROBAN.md](./INSTALL_SOROBAN.md) - Detailed Soroban CLI installation
- [START_SERVER.md](./START_SERVER.md) - Server startup guide
- [server/DEPLOYMENT_PIPELINE.md](./server/DEPLOYMENT_PIPELINE.md) - Deployment architecture
- [server/ANALYTICS_ENGINE.md](./server/ANALYTICS_ENGINE.md) - Analytics implementation
- [CONTRACT_TEMPLATES_ARCHITECTURE.md](./CONTRACT_TEMPLATES_ARCHITECTURE.md) - Template system

---

## 🎯 Quick Start Checklist

- [ ] Install Node.js 18+
- [ ] Install Rust and Cargo
- [ ] Install soroban-cli
- [ ] Clone repository
- [ ] Install frontend dependencies (`npm install`)
- [ ] Install backend dependencies (`cd server && npm install`)
- [ ] Start backend server (`cd server && npm run dev`)
- [ ] Start frontend server (`npm run dev`)
- [ ] Open [http://localhost:3000](http://localhost:3000)
- [ ] Connect wallet
- [ ] Deploy your first contract!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

MIT License - Feel free to use this project for learning, development, or commercial purposes!

---

## 🙏 Acknowledgments

- [Stellar Development Foundation](https://stellar.org) - For the amazing blockchain platform
- [Soroban](https://soroban.stellar.org) - Smart contract platform
- [Stellar Wallets Kit](https://github.com/Creit-Tech/Stellar-Wallets-Kit) - Multi-wallet support

---

## 💡 Tips

1. **Use Testnet**: Always test on Stellar Testnet before deploying to Mainnet
2. **Get Testnet XLM**: Use [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test) to fund testnet accounts
3. **Check Logs**: Both frontend and backend logs provide helpful debugging information
4. **Start Simple**: Begin with the Counter contract template
5. **Explore Templates**: Check out different contract templates to understand patterns

---

**Made with ❤️ for the Stellar Community**

Happy Deploying! 🚀✨
