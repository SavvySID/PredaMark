# PredaMark - Linera Prediction Market Application

This is the Linera version of PredaMark, a decentralized prediction market application built on Linera's microchain infrastructure.

## Features

- **Place Bets**: Users can place bets on outcomes (Yes/No predictions)
- **Resolve Bets**: Oracle or authorized accounts can resolve bets
- **Real-time Updates**: Built for Linera's real-time Web3 applications

## Architecture

- **Contract** (`src/contract.rs`): Core prediction market logic
- **Service** (`src/service.rs`): GraphQL API for querying state
- **State** (`src/state.rs`): Application state management using Linera views
- **ABI** (`src/lib.rs`): Application binary interface definitions

## Building

Build the WebAssembly binaries:

```bash
cd linera-app
cargo build --release --target wasm32-unknown-unknown
```

This will create:
- `target/wasm32-unknown-unknown/release/prediction_market_contract.wasm`
- `target/wasm32-unknown-unknown/release/prediction_market_service.wasm`

## Deployment

1. Start Linera testnet (from parent repo):
```bash
cd ../linera-protocol
export PATH="$PWD/target/debug:$PATH"
source <(linera net helper)
linera_spawn linera net up --with-faucet --faucet-port 8079
```

2. Deploy to Linera:
```bash
cd ../linera-app
LINERA_APPLICATION_ID=$(linera publish-and-create \
  ../target/wasm32-unknown-unknown/release/prediction_market_{contract,service}.wasm \
  --json-argument '{}')
```

3. Set environment variables:
```bash
export LINERA_WALLET="$LINERA_TMP_DIR/wallet.json"
export LINERA_KEYSTORE="$LINERA_TMP_DIR/keystore.json"
export LINERA_STORAGE="rocksdb:$LINERA_TMP_DIR/client.db"
```

## GraphQL API

Start the Linera service:

```bash
PORT=8080
linera service --port $PORT
```

Visit: `http://localhost:8080/chains/$CHAIN/applications/$LINERA_APPLICATION_ID`

### Available Queries

```graphql
# Get bet count
query {
  betCount
}

# Place a bet
mutation {
  placeBet(prediction: true)
}

# Resolve a bet
mutation {
  resolveBet(betId: 0, actualOutcome: true)
}
```

## Operations

- `PlaceBet`: Place a bet with a boolean prediction
- `ResolveBet`: Resolve a bet by bet ID with actual outcome

## Development

Install dependencies:
```bash
cargo build
```

Run tests:
```bash
cargo test
```

## Integration with Frontend

The frontend is in `../frontend/` and needs to be updated to connect to Linera instead of traditional EVM chains.

## Resources

- [Linera Documentation](https://linera.dev)
- [Linera GitHub](https://github.com/linera-io/linera-protocol)
- [Linera Examples](../../linera-protocol/examples)

