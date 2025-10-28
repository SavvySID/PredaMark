# PredaMark Deployment Guide - Linera

This guide walks you through deploying PredaMark on Linera testnet.

## Prerequisites

- Rust 1.81+ installed
- Cargo installed
- Linera CLI built and in PATH

## Step 1: Build Linera CLI

```bash
cd linera-protocol
cargo build --release -p linera-service -p linera-storage-service
export PATH="$PWD/target/release:$PATH"
```

Verify installation:
```bash
linera --version
```

## Step 2: Start Local Linera Network

```bash
# Load helper functions
source <(linera net helper)

# Start network with faucet
export LINERA_FAUCET_PORT=8079
linera_spawn linera net up --with-faucet --faucet-port $LINERA_FAUCET_PORT

# Set environment variables
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"
```

## Step 3: Initialize Wallet

```bash
linera wallet init --faucet $LINERA_FAUCET_URL
```

If you need a chain:
```bash
INFO=($(linera wallet request-chain --faucet $LINERA_FAUCET_URL))
CHAIN="${INFO[0]}"
OWNER="${INFO[1]}"
```

## Step 4: Build the Application

```bash
cd ../linera-app
cargo build --release --target wasm32-unknown-unknown
```

This creates:
- `target/wasm32-unknown-unknown/release/prediction_market_contract.wasm`
- `target/wasm32-unknown-unknown/release/prediction_market_service.wasm`

## Step 5: Publish and Deploy

```bash
LINERA_APPLICATION_ID=$(linera publish-and-create \
  target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm \
  --json-argument '{}')

echo "Application ID: $LINERA_APPLICATION_ID"
```

Save this application ID for the frontend.

## Step 6: Test the Application

Start the Linera service:

```bash
PORT=8080
linera service --port $PORT
```

Visit the GraphQL playground:
```
http://localhost:8080/chains/$CHAIN/applications/$LINERA_APPLICATION_ID
```

### Test Queries

Get bet count:
```graphql
query {
  betCount
}
```

Place a bet:
```graphql
mutation {
  placeBet(prediction: true)
}
```

Resolve a bet:
```graphql
mutation {
  resolveBet(betId: 0, actualOutcome: true)
}
```

## Step 7: Configure Frontend

Update `frontend/src/config.ts` or create it with:

```typescript
export const LINERA_APPLICATION_ID = "YOUR_APPLICATION_ID";
export const LINERA_SERVICE_URL = "http://localhost:8080";
```

## Troubleshooting

### "linera: command not found"
- Ensure `linera` is in your PATH
- Run: `export PATH="$PWD/target/release:$PATH"`

### "Failed to build WASM"
- Install wasm32 target: `rustup target add wasm32-unknown-unknown`
- Install build tools: `cargo install cargo-generate`

### Network connection issues
- Check if the faucet is running: `curl $LINERA_FAUCET_URL`
- Restart the network if needed

## Next Steps

- Integrate frontend with Linera GraphQL client
- Deploy to Linera testnet (replace localhost with testnet URL)
- Set up oracle for automatic resolution

## Resources

- [Linera Documentation](https://linera.dev)
- [Linera GitHub](https://github.com/linera-io/linera-protocol)
- [Linera Discord](https://discord.gg/linera)

