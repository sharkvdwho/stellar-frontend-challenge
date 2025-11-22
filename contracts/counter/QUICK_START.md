# Quick Start Guide

## Files Created

```
contracts/counter/
├── Cargo.toml          # Contract dependencies and build config
├── src/
│   ├── lib.rs         # Main contract implementation
│   └── test.rs        # Unit tests
├── README.md          # Full documentation
├── BUILD.md           # Detailed build instructions
└── QUICK_START.md     # This file
```

## Contract Functions

- `init()` - Initialize counter to 0
- `increment()` - Increment by 1, emit event, return new count
- `decrement()` - Decrement by 1, emit event, return new count  
- `get_count()` - Get current counter value

## Quick Build

```bash
cd contracts/counter
soroban contract build
```

Output: `target/wasm32-unknown-unknown/release/counter.wasm`

## Quick Test

```bash
cd contracts/counter
cargo test
```

## Prerequisites

1. Rust: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
2. wasm32 target: `rustup target add wasm32-unknown-unknown`
3. soroban-cli: `cargo install --locked soroban-cli`

## Verify Build

```bash
# Check WASM file exists
ls -lh target/wasm32-unknown-unknown/release/counter.wasm

# Should be ~10-50 KB optimized WASM file
```

## Next Steps

1. Build the contract: `soroban contract build`
2. Run tests: `cargo test`
3. Deploy to testnet (see README.md)
4. Use in frontend deployment UI

For detailed instructions, see [README.md](./README.md) or [BUILD.md](./BUILD.md).

