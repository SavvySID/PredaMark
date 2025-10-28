## PredaMark – Linera Prediction Market

This repository contains a full-stack prediction market built on **Linera**, a decentralized protocol for real-time Web3 applications.

### Architecture

- **Linera Application** in `linera-app/` - Rust/WASM prediction market app
- **React frontend** in `frontend/` for placing and viewing bets
- **Smart contracts** in `contracts/` - Legacy Solidity/EVM contracts (for reference)

### Repository Structure
- `contracts/` – Solidity sources (see `PredictionMarket.sol`)
- `scripts/` – Deployment scripts (see `scripts/deploy.js`)
- `ignition/` – Optional Hardhat Ignition deployment module (sample `Lock.js`)
- `test/` – Hardhat tests (sample `Lock.js`)
- `frontend/` – React application
- `oracle/` – Example resolver script (`resolver.py`)

## Prerequisites
- **Rust 1.81+** ([Install Rust](https://rustup.rs))
- Node.js 18+ and npm
- Cargo (comes with Rust)

## Quick Start with Linera

### 1. Install Linera CLI

```bash
cd linera-protocol
cargo build --release -p linera-service -p linera-storage-service
export PATH="$PWD/target/release:$PATH"
```

### 2. Start Linera Network

```bash
source <(linera net helper)
linera_spawn linera net up --with-faucet --faucet-port 8079
```

### 3. Build the Application

```bash
cd ../linera-app
cargo build --release --target wasm32-unknown-unknown
```

### 4. Deploy to Linera

```bash
LINERA_APPLICATION_ID=$(linera publish-and-create \
  ../target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm \
  --json-argument '{}')
echo "Application ID: $LINERA_APPLICATION_ID"
```

### 5. Start Frontend

```bash
cd ../frontend
npm install
npm start
```

Visit `http://localhost:3000` to use the application.

## Linera Application

### `linera-app/src/contract.rs`
Core prediction market logic in Rust/WASM:
- `PlaceBet { prediction: bool }` – Place a bet on an outcome
- `ResolveBet { bet_id: u64, actual_outcome: bool }` – Resolve and payout

State management:
- `bet_counter`: RegisterView<u64> - Counter for bet IDs
- `bets`: MapView<u64, Bet> - Mapping from bet ID to bet

Built with Linera SDK for real-time Web3 applications.

### GraphQL API (`src/service.rs`)
Query and mutate the application state:
- Query: `bet_count` - Get total number of bets
- Mutation: `placeBet(prediction: bool)` - Place a bet
- Mutation: `resolveBet(betId: u64, actualOutcome: bool)` - Resolve a bet

### Build, Test, and Deploy
```bash
# Compile
npx hardhat compile

# Test (sample tests included)
npx hardhat test

# Local node
npx hardhat node

# Deploy (local)
npx hardhat run scripts\deploy.js --network localhost

# Help
npx hardhat help
```

If you prefer Ignition, there’s a sample module:
```bash
npx hardhat ignition deploy .\ignition\modules\Lock.js --network localhost
```

## Frontend
Located in `frontend/` (Create React App).

### Run locally
```bash
cd frontend
npm start
```

### Notes
- The app expects a deployed `PredictionMarket` contract. Point your wallet (e.g., MetaMask) to the same network where the contract is deployed (localhost for development).
- If you wire the contract address into the UI, store it in a small configuration module or environment variable as you prefer.

## Oracle / Resolver (optional)
You can implement an off-chain resolver to call `resolveBet(betId, actualOutcome)` as needed.
Python environment:
```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Project Scripts (Common)
- **Compile contracts**: `npx hardhat compile`
- **Run tests**: `npx hardhat test`
- **Run local node**: `npx hardhat node`
- **Deploy**: `npx hardhat run scripts\deploy.js --network <network>`
- **Ignition deploy (optional)**: `npx hardhat ignition deploy .\ignition\modules\Lock.js`

## Troubleshooting
- **Frontend can’t find contract**: Ensure you’ve deployed to the same network your wallet is connected to, and the address is configured where the frontend expects it.
- **Windows paths**: The README uses backslashes for Windows. On macOS/Linux, replace `scripts\deploy.js` with `scripts/deploy.js` and remove drive letters.

## License
MIT

# 1. Build Linera CLI (Rust)
cd linera-protocol
cargo build --release -p linera-service

# 2. Start Linera network
linera_spawn linera net up --with-faucet

# 3. Initialize wallet & get chain ID
linera wallet init
# Get chain ID from output

# 4. Build Linera app (Rust to WASM)
cd linera-app
cargo build --release --target wasm32-unknown-unknown

# 5. Deploy app & get application ID
linera publish-and-create ...

# 6. Edit frontend/src/config/linera.js with IDs
# Application ID and Chain ID

# 7. Start Linera service on port 8080
linera service --port 8080

# 8. Run frontend
cd frontend && npm start