# Windows Build Requirements for Linera

## Problem
Building Linera CLI from source on Windows requires:
1. ✅ Rust 1.90+ (you have this)
2. ✅ wasm32 target (installed)
3. ❌ **Visual Studio Build Tools** (missing)

## Solutions

### Option 1: Install Visual Studio Build Tools (Recommended if staying on Windows)

1. **Download Visual Studio Installer**: [Download VS Community 2022](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

2. **Install C++ Build Tools**:
   - Run the installer
   - Select "Desktop development with C++"
   - Include: MSVC v143, Windows 10/11 SDK
   - Click Install

3. **After installation**, restart your terminal and try building again:
   ```powershell
   cd D:\Koding\PredaMark\linera-protocol
   cargo build --release -p linera-service -p linera-storage-service
   ```

### Option 2: Use WSL2 (Windows Subsystem for Linux) - **EASIER**

This is often easier than configuring Windows build tools:

1. **Install WSL2**:
   ```powershell
   wsl --install
   # Restart computer when prompted
   ```

2. **Open Ubuntu in WSL** and run:
   ```bash
   # Update packages
   sudo apt update && sudo apt upgrade -y
   
   # Install Rust
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source ~/.cargo/env
   
   # Install wasm32 target
   rustup target add wasm32-unknown-unknown
   
   # Navigate to your project
   cd /mnt/d/Koding/PredaMark
   
   # Build Linera CLI
   cd linera-protocol
   cargo build --release -p linera-service -p linera-storage-service
   
   # Add to PATH
   export PATH="$PWD/target/release:$PATH"
   ```

3. **Continue with setup in WSL**

### Option 3: Use Docker (Alternative)

If you have Docker Desktop installed:

```powershell
# Pull Linera image
docker pull linera/localnet

# Run Linera network
docker run -d -p 8080:8080 -p 8079:8079 linera/localnet

# Then use Docker container for CLI operations
docker exec -it <container-id> bash
```

## What We've Done So Far

1. ✅ Updated Rust from 1.81 to 1.90
2. ✅ Installed wasm32-unknown-unknown target
3. ✅ Fixed rust-toolchain.toml
4. ❌ Need MSVC Build Tools or WSL to continue

## Recommendation

**Use WSL2** - It's the easiest path for Rust development on Windows. Many developers use this approach.

## Quick Start After Installing Prerequisites

Once you have the build environment ready:

### In PowerShell (with MSVC):
```powershell
cd D:\Koding\PredaMark\linera-protocol
cargo build --release -p linera-service -p linera-storage-service
$env:PATH = "$PWD/target/release;$env:PATH"
```

### In WSL:
```bash
cd /mnt/d/Koding/PredaMark/linera-protocol
cargo build --release -p linera-service -p linera-storage-service
export PATH="$PWD/target/release:$PATH"
```

Then continue with the rest of the setup from WINDOWS_SETUP_STEPS.md

