# Counter Contract

A simple Soroban smart contract that implements a counter with increment, decrement, and get operations.

## Contract Functions

- `init()` - Initialize the counter to 0
- `increment()` - Increment the counter by 1 and emit an event
- `decrement()` - Decrement the counter by 1 and emit an event
- `get_count()` - Get the current counter value

## Prerequisites

1. **Rust** (latest stable version)
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **wasm32 target**
   ```bash
   rustup target add wasm32-unknown-unknown
   ```

3. **soroban-cli** (version 21.0.0 or compatible)
   ```bash
   cargo install --locked soroban-cli
   ```

## Build Instructions

### 1. Navigate to the contract directory
```bash
cd contracts/counter
```

### 2. Build the contract
```bash
soroban contract build
```

This will:
- Compile the Rust code to WebAssembly
- Optimize the WASM output
- Generate the contract binary at `target/wasm32-unknown-unknown/release/counter.wasm`

### 3. Verify the build
```bash
# Check that the WASM file was created
ls -lh target/wasm32-unknown-unknown/release/counter.wasm
```

## Run Tests

```bash
# Run unit tests
cargo test

# Run tests with output
cargo test -- --nocapture
```

## Deploy to Testnet

### 1. Configure the network (if not already done)
```bash
soroban network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### 2. Deploy the contract
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/counter.wasm \
  --source <YOUR_SECRET_KEY> \
  --network testnet
```

Replace `<YOUR_SECRET_KEY>` with your Stellar account secret key.

### 3. Initialize the contract
```bash
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <YOUR_SECRET_KEY> \
  --network testnet \
  -- init
```

### 4. Interact with the contract
```bash
# Increment
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <YOUR_SECRET_KEY> \
  --network testnet \
  -- increment

# Get count
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <YOUR_SECRET_KEY> \
  --network testnet \
  -- get_count

# Decrement
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source <YOUR_SECRET_KEY> \
  --network testnet \
  -- decrement
```

## Build Output

The compiled WASM file will be located at:
```
target/wasm32-unknown-unknown/release/counter.wasm
```

This file can be:
- Deployed to Stellar/Soroban networks
- Used for testing
- Uploaded via the frontend deployment UI

## Troubleshooting

### Build fails with "soroban-sdk not found"
- Ensure you're using soroban-cli version 21.0.0 or compatible
- Try: `cargo update`

### WASM file not found
- Check that the build completed successfully
- Verify you're in the `contracts/counter` directory
- Run `soroban contract build` again

### Tests fail
- Ensure you have the testutils feature enabled (already in Cargo.toml)
- Try: `cargo clean && cargo test`

## Contract Events

The contract emits events on state changes:
- `increment` event: Emitted when counter is incremented (includes new count value)
- `decrement` event: Emitted when counter is decremented (includes new count value)

Events can be queried via Horizon API or Soroban RPC for tracking contract activity.

