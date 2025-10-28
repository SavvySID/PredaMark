# Windows Setup Guide for PredaMark on Linera

## Prerequisites Check
✅ Rust installed (v1.81.0 confirmed)
✅ Cargo available

## Step-by-Step Instructions

### Step 1: Build Linera CLI

Open PowerShell in the project root and run:

```powershell
cd linera-protocol
cargo build --release -p linera-service -p linera-storage-service
```

This will take several minutes (first build can take 10-20 minutes).

After building, add to PATH:
```powershell
$env:PATH = "$PWD/target/release;$env:PATH"
```

### Step 2: Start Linera Network

⚠️ **Note**: The `linera net up` command requires Unix/Linux environment. On Windows, you have two options:

#### Option A: Use WSL (Windows Subsystem for Linux)
```bash
# In WSL terminal
cd /mnt/d/Koding/PredaMark/linera-protocol
export PATH="$PWD/target/release:$PATH"
source <(linera net helper)
linera_spawn linera net up --with-faucet --faucet-port 8079
```

#### Option B: Use Docker (recommended if you have Docker)
```powershell
docker run -d -p 8080:8080 -p 8079:8079 linera/localnet
```

### Step 3: Initialize Wallet and Get Chain ID

```powershell
# If using WSL:
linera wallet init

# Get a chain from faucet
linera wallet request-chain
# Copy the chain ID from the output

# Or set environment variables
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"
```

### Step 4: Build Linera App (Rust to WASM)

```powershell
cd ../linera-app
cargo build --release --target wasm32-unknown-unknown
```

This will create:
- `target/wasm32-unknown-unknown/release/prediction_market_contract.wasm`
- `target/wasm32-unknown-unknown/release/prediction_market_service.wasm`

### Step 5: Deploy App and Get Application ID

```powershell
$appId = linera publish-and-create `
  target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm `
  --json-argument '{}'

echo "Application ID: $appId"
```

**Save this Application ID!** You'll need it for the frontend.

### Step 6: Update Frontend Configuration

Open `frontend/src/config/linera.js` and update:

```javascript
// Replace with your actual IDs
export const LINERA_APPLICATION_ID = 'YOUR_APPLICATION_ID_HERE';
export const LINERA_CHAIN_ID = 'YOUR_CHAIN_ID_HERE';
```

### Step 7: Start Linera Service

```powershell
# Start Linera service on port 8080
linera service --port 8080
```

Keep this terminal running.

### Step 8: Start Frontend

Open a **new PowerShell terminal**:

```powershell
cd frontend
npm install
npm start
```

Visit: `http://localhost:3000`

## Important Notes

1. **Windows Limitations**: The Linera network spawn command (`linera net up`) is designed for Unix-like systems. Use WSL or Docker if needed.

2. **Build Time**: First build of Linera CLI takes 15-30 minutes on Windows due to the large codebase.

3. **Path Issues**: If commands aren't found after building, ensure the PATH is set:
   ```powershell
   $env:PATH = "D:\Koding\PredaMark\linera-protocol\target\release;$env:PATH"
   ```

4. **WASM Target**: Ensure wasm32 target is installed:
   ```powershell
   rustup target add wasm32-unknown-unknown
   ```

## Troubleshooting

**"Command not found: linera"**
→ Rebuild the CLI and set PATH as shown in Step 1

**"wasm32 target not installed"**
→ Run: `rustup target add wasm32-unknown-unknown`

**"Failed to connect to service"**
→ Make sure Linera service is running (Step 7)

**Frontend shows "Application ID not set"**
→ Update `frontend/src/config/linera.js` with your IDs from Step 5 & 3

**Build fails**
→ Make sure you have the latest Rust (1.81+) and enough disk space (~2GB for Linera CLI build)

