#!/bin/bash
# Build script for Linera Prediction Market

echo "Building Linera Prediction Market application..."

# Build the WASM binaries
cargo build --release --target wasm32-unknown-unknown

echo "Build complete!"
echo "Binaries are in: target/wasm32-unknown-unknown/release/"
echo "  - prediction_market_contract.wasm"
echo "  - prediction_market_service.wasm"

