# Fix: linker `cc` not found in WSL

## The Problem
Your WSL Ubuntu environment is missing the C compiler and build tools needed to compile Rust with native dependencies.

## The Fix

Run these commands in your WSL terminal:

```bash
# Update package list
sudo apt update

# Install build essentials (gcc, g++, make, etc.)
sudo apt install -y build-essential pkg-config libssl-dev

# Verify installation
gcc --version
```

## Then Continue Building

After installing the build tools, run:

```bash
cd /mnt/d/Koding/PredaMark/linera-protocol
cargo build --release -p linera-service -p linera-storage-service
```

This should now work!

## What This Installs

- `build-essential` - GCC, G++, Make, and other essential build tools
- `pkg-config` - Helper for finding libraries
- `libssl-dev` - OpenSSL development libraries (needed for crypto operations)

## Expected Build Time

The first build will take 20-30 minutes. Subsequent builds will be faster.

# Fix: libclang not found in WSL

## The Problem
You need libclang for `bindgen` (used to generate Rust bindings for C code).

## The Fix

Run this command in your WSL terminal:

```bash
sudo apt install -y libclang-dev
```

This will install libclang (LLVM Clang compiler libraries).

## Alternative (if the above doesn't work)

You can install the full LLVM toolchain:

```bash
sudo apt install -y llvm libclang-dev
```

## Then Continue Building

After installing libclang, run:

```bash
cd /mnt/d/Koding/PredaMark/linera-protocol
cargo build --release -p linera-service -p linera-storage-service
```

## Complete Dependencies

To install all dependencies at once:

```bash
sudo apt update
sudo apt install -y build-essential pkg-config libssl-dev libclang-dev
```

This installs:
- **build-essential** - GCC, G++, Make
- **pkg-config** - Library finder
- **libssl-dev** - OpenSSL dev libraries
- **libclang-dev** - Clang compiler libraries (for bindgen)

