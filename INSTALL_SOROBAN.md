# Installing soroban-cli

The `soroban-cli` tool is required to compile and deploy Soroban smart contracts.

## Quick Installation

### 1. Install Rust (if not already installed)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env
```

### 2. Add wasm32 target

```bash
rustup target add wasm32-unknown-unknown
```

### 3. Install soroban-cli

```bash
cargo install --locked soroban-cli
```

This may take 10-20 minutes as it compiles from source.

### 4. Verify Installation

```bash
soroban --version
```

You should see something like: `soroban 21.0.0` (or similar version)

### 5. Configure Testnet Network (if needed)

```bash
soroban network add --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

## Troubleshooting

### soroban command not found

If `soroban --version` doesn't work after installation:

1. **Check if Cargo bin directory is in PATH:**
   ```bash
   echo $PATH | grep -o "$HOME/.cargo/bin"
   ```

2. **Add to PATH (add to ~/.bashrc or ~/.zshrc):**
   ```bash
   export PATH="$HOME/.cargo/bin:$PATH"
   source ~/.bashrc  # or source ~/.zshrc
   ```

3. **Verify installation location:**
   ```bash
   ls -la $HOME/.cargo/bin/soroban
   ```

### Installation takes too long

The installation compiles from source, which can take 10-20 minutes. This is normal. Make sure you have:
- At least 2GB free disk space
- Stable internet connection
- Sufficient RAM (4GB+ recommended)

### Permission errors

If you get permission errors, you may need to use `sudo` (not recommended) or install Rust for your user only (recommended):

```bash
# Install Rust for current user (recommended)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Or use sudo (not recommended)
sudo cargo install --locked soroban-cli
```

## After Installation

Restart your backend server:

```bash
cd server
npm run dev
```

The server will now be able to compile and deploy contracts!

