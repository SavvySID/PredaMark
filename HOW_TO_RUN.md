# How to Run PredaMark on Linera

## ⚠️ IT'S DIFFERENT NOW!

**Old way (won't work):**
```bash
npm install
cd frontend && npm install && cd ..
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
cd frontend && npm start
```

**New way (Linera):**

## Step-by-Step Run Instructions

### 1️⃣ Build Linera CLI (First Time Only)

```bash
cd linera-protocol
cargo build --release -p linera-service -p linera-storage-service
export PATH="$PWD/target/release:$PATH"
```

### 2️⃣ Start Linera Network

```bash
source <(linera net helper)
export LINERA_FAUCET_PORT=8079
linera_spawn linera net up --with-faucet --faucet-port $LINERA_FAUCET_PORT

# Set environment
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"
```

### 3️⃣ Initialize Wallet

```bash
linera wallet init --faucet $LINERA_FAUCET_URL

# Get a chain
INFO=($(linera wallet request-chain --faucet $LINERA_FAUCET_URL))
CHAIN="${INFO[0]}"
OWNER="${INFO[1]}"
echo "Chain ID: $CHAIN"
```

### 4️⃣ Build the Linera App

```bash
cd ../linera-app
cargo build --release --target wasm32-unknown-unknown
```

### 5️⃣ Deploy the Linera App

```bash
LINERA_APPLICATION_ID=$(linera publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm \
  --json-argument '{}')

echo "Application ID: $LINERA_APPLICATION_ID"
echo "💡 SAVE THESE IDs!"
```

### 6️⃣ Configure Frontend

Create `frontend/.env`:

```env
REACT_APP_LINERA_SERVICE_URL=http://localhost:8080
REACT_APP_LINERA_APPLICATION_ID=<your-application-id>
REACT_APP_LINERA_CHAIN_ID=<your-chain-id>
```

OR edit `frontend/src/config/linera.js` and update the values.

### 7️⃣ Start Linera Service

```bash
PORT=8080
linera service --port $PORT &
```

### 8️⃣ Start Frontend

```bash
cd ../frontend
npm install  # Already done!
npm start
```

Visit: `http://localhost:3000`

## Differences from Old Setup

| Old (EVM) | New (Linera) |
|-----------|--------------|
| `npx hardhat node` | `linera net up` |
| MetaMask/ethers.js | Linera GraphQL client |
| Deploy Solidity contract | Build Rust WASM |
| EVM network | Linera microchain |
| `http://localhost:8545` | `http://localhost:8080` |
| Contract address | Application ID |

## Quick Start (Windows PowerShell)

```powershell
# 1. Build Linera
cd linera-protocol
cargo build --release -p linera-service -p linera-storage-service
$env:PATH = "$PWD/target/release;$env:PATH"

# 2. Start network (Linux/Mac only - use WSL for Windows)
# Or use Docker: docker run -it -p8080:8080 linera/localnet

# 3. Build app
cd ../linera-app
cargo build --release --target wasm32-unknown-unknown

# 4. Deploy (get IDs)
$appId = linera publish-and-create target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm --json-argument '{}'

# 5. Edit frontend/src/config/linera.js with the IDs

# 6. Start service & frontend
# In one terminal: linera service --port 8080
# In another: cd frontend && npm start
```

## Troubleshooting

**"Command not found: linera"**
→ Build Linera CLI (step 1)

**"Failed to connect" in frontend**
→ Make sure Linera service is running on port 8080

**"Application ID not set"**
→ Deploy the app and update configuration

**Frontend won't start**
→ Run `cd frontend && npm install` first

---

**TL;DR:** It's completely different. You need Rust, Linera CLI, and a different deployment process. See COMPLETE_SETUP_GUIDE.md for details.

