# Complete WSL Setup for Linera Build

## Quick Fix - Run This in WSL

```bash
sudo apt update
sudo apt install -y build-essential pkg-config libssl-dev libclang-dev
```

This installs all dependencies needed for building Linera.

## Then Build

```bash
cd /mnt/d/Koding/PredaMark/linera-protocol
cargo build --release -p linera-service -p linera-storage-service
```

## What Each Package Does

- **build-essential** - GCC, G++, Make, and other build tools
- **pkg-config** - Finds libraries  
- **libssl-dev** - OpenSSL dev libraries for crypto
- **libclang-dev** - Clang libraries needed by bindgen

## Build Time

First build: 20-30 minutes
Subsequent builds: 5-10 minutes

## Troubleshooting

If you get "permission denied" errors:
```bash
sudo chown -R $USER:$USER /mnt/d/Koding/PredaMark
```

