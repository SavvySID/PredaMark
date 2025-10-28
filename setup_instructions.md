# Complete Setup Instructions for PredaMark on Linera

## Current Issue
Your Windows system needs either:
1. **Visual Studio Build Tools** (large download, ~3GB)
2. **WSL2** (easier, recommended)

## Recommended Path: WSL2

### Step 1: Install WSL2 (If not already installed)

Open PowerShell as Administrator:
```powershell
wsl --install
```
**Note**: You'll need to restart your computer after this.

### Step 2: Open WSL and Install Rust

After restarting, open Ubuntu (from Start Menu) and run:

```bash
# Install Rust in WSL
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install wasm32 target
rustup target add wasm32-unknown-unknown

# Install required system dependencies
sudo apt update
sudo apt install -y build-essential pkg-config libssl-dev
```

### Step 3: In WSL, Navigate to Your Project

```bash
cd /mnt/d/Koding/PredaMark
```

### Step 4: Build Linera CLI

```bash
cd linera-protocol
cargo build --release -p linera-service -p linera-storage-service
```

**Note**: This first build will take 20-30 minutes.

### Step 5: Add Linera to PATH

```bash
export PATH="$PWD/target/release:$PATH"
echo 'export PATH="$HOME/PredaMark/linera-protocol/target/release:$PATH"' >> ~/.bashrc
```

### Step 6: Start Linera Network

```bash
# Source the helper
source <(linera net helper)

# Start network with faucet
export LINERA_FAUCET_PORT=8079
linera_spawn linera net up --with-faucet --faucet-port $LINERA_FAUCET_PORT

# Set environment variables
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"
```

### Step 7: Initialize Wallet & Get Chain ID

```bash
# Initialize wallet
linera wallet init --faucet "http://127.0.0.1:$LINERA_FAUCET_PORT"

# Request a new chain from the faucet
linera wallet request-chain --faucet "http://127.0.0.1:$LINERA_FAUCET_PORT"

# Save the Chain ID from the output (you'll need it!)
```

### Step 8: Build Your Linera App

```bash
cd ../linera-app
cargo build --release --target wasm32-unknown-unknown
```

This creates:
- `target/wasm32-unknown-unknown/release/prediction_market_contract.wasm`
- `target/wasm32-unknown-unknown/release/prediction_market_service.wasm`

### Step 9: Deploy the App

```bash
LINERA_APPLICATION_ID=$(linera publish-and-create \
  ../target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm \
  --json-argument '{}')

echo "Application ID: $LINERA_APPLICATION_ID"
```

**Save this Application ID!**

### Step 10: Update Frontend Config

**Back in your Windows PowerShell:**

Edit `frontend/src/config/linera.js`:

```javascript
export const LINERA_APPLICATION_ID = 'YOUR_APPLICATION_ID_HERE';
export const LINERA_CHAIN_ID = 'YOUR_CHAIN_ID_HERE';
```

Replace with the actual IDs from Steps 7 and 9.

### Step 11: Start Linera Service

**In WSL:**

```bash
linera service --port 8080
```

Keep this running.

### Step 12: Start Frontend

**In PowerShell (separate window):**

```powershell
cd D:\Koding\PredaMark\frontend
npm start
```

Visit: `http://localhost:3000`

---

## Alternative: Install Visual Studio Build Tools

If you prefer to stay in PowerShell:

1. Download and install: https://visualstudio.microsoft.com/visual-cpp-build-tools/
2. During installation, select "Desktop development with C++"
3. After installation, restart terminal and run:

```powershell
cd D:\Koding\PredaMark\linera-protocol
cargo build --release -p linera-service -p linera-storage-service
```

Then continue with Steps 2-12 above (adapting paths for Windows).

---

## Summary of Commands

### Quick reference for WSL:

```bash
# 1. Install prerequisites (first time only)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
rustup target add wasm32-unknown-unknown
sudo apt install -y build-essential pkg-config libssl-dev

# 2. Build Linera (takes 20-30 min, first time only)
cd /mnt/d/Koding/PredaMark/linera-protocol
cargo build --release -p linera-service -p linera-storage-service
export PATH="$PWD/target/release:$PATH"

# 3. Start network
source <(linera net helper)
export LINERA_FAUCET_PORT=8079
linera_spawn linera net up --with-faucet --faucet-port $LINERA_FAUCET_PORT
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"

# 4. Get chain ID
linera wallet init --faucet "http://127.0.0.1:$LINERA_FAUCET_PORT"
linera wallet request-chain --faucet "http://127.0.0.1:$LINERA_FAUCET_PORT"

# 5. Build app
cd ../linera-app
cargo build --release --target wasm32-unknown-unknown

# 6. Deploy app
LINERA_APPLICATION_ID=$(linera publish-and-create \
  ../target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm \
  --json-argument '{}')
echo "Application ID: $LINERA_APPLICATION_ID"

# 7. Start service
linera service --port 8080
```

## Troubleshooting

**WSL installation issues:**
- Run: `wsl --update`
- Check: `wsl --status`

**Can't find linera command:**
- Make sure you ran: `export PATH="$PWD/target/release:$PATH"`

**Build fails:**
- Ensure you're in WSL (not PowerShell)
- Check Rust version: `rustc --version` (should be 1.81+)

**Frontend can't connect:**
- Verify Linera service is running on port 8080
- Check firewall settings

