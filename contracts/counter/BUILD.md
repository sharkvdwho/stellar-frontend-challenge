# Build Instructions for Counter Contract

## Prerequisites

### 1. Install Rust
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Install wasm32 target
```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install soroban-cli
```bash
cargo install --locked soroban-cli
```

Verify installation:
```bash
soroban --version
# Should show version 21.0.0 or compatible
```

## Build Steps

### From Repository Root

```bash
# Navigate to contract directory
cd contracts/counter

# Build the contract
soroban contract build

# Verify WASM file was created
ls -lh target/wasm32-unknown-unknown/release/counter.wasm
```

### Expected Output

The build should complete successfully and produce:
```
target/wasm32-unknown-unknown/release/counter.wasm
```

File size should be approximately 10-50 KB (optimized).

## Run Tests

```bash
# From contracts/counter directory
cargo test

# With verbose output
cargo test -- --nocapture
```

## Troubleshooting

### Error: "soroban-sdk not found"
```bash
# Update dependencies
cargo update

# Clean and rebuild
cargo clean
soroban contract build
```

### Error: "wasm32-unknown-unknown target not found"
```bash
rustup target add wasm32-unknown-unknown
```

### Error: "soroban: command not found"
```bash
# Install soroban-cli
cargo install --locked soroban-cli

# Add to PATH if needed
export PATH="$HOME/.cargo/bin:$PATH"
```

### Build succeeds but WASM file missing
```bash
# Check if build actually completed
soroban contract build --verbose

# Check target directory
find . -name "*.wasm" -type f
```

## Verify Build Quality

```bash
# Check WASM file size (should be optimized)
ls -lh target/wasm32-unknown-unknown/release/counter.wasm

# Verify it's a valid WASM file
file target/wasm32-unknown-unknown/release/counter.wasm
# Should output: WebAssembly (wasm) binary module version 0x1
```

## Quick Build Script

Create a `build.sh` in `contracts/counter/`:

```bash
#!/bin/bash
set -e

echo "Building counter contract..."
soroban contract build

if [ -f "target/wasm32-unknown-unknown/release/counter.wasm" ]; then
    echo "✅ Build successful!"
    ls -lh target/wasm32-unknown-unknown/release/counter.wasm
else
    echo "❌ Build failed - WASM file not found"
    exit 1
fi
```

Make it executable:
```bash
chmod +x build.sh
./build.sh
```

