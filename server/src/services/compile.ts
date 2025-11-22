/**
 * Contract Compilation Service
 * 
 * Handles compilation of Soroban contracts using soroban-cli
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export interface CompileResult {
  success: boolean;
  wasmPath?: string;
  error?: string;
  output?: string;
}

/**
 * Compile a Soroban contract
 * 
 * @param contractName - Name of the contract (e.g., "counter")
 * @param contractPath - Optional path to contract directory (defaults to contracts/{contractName})
 * @returns CompileResult with WASM path or error
 */
export async function compileContract(
  contractName: string,
  contractPath?: string
): Promise<CompileResult> {
  try {
    // Resolve contract path - handle different execution contexts
    // When running with ts-node-dev: __dirname = server/src/services
    // When compiled: __dirname = server/dist/src/services
    // We need to find the project root (where contracts/ directory is)
    
    let projectRoot: string;
    
    // Strategy 1: Try going up from __dirname
    const fromDirname = path.resolve(__dirname, '../../..');
    if (fs.existsSync(path.join(fromDirname, 'contracts'))) {
      projectRoot = fromDirname;
    } else {
      // Strategy 2: Try from process.cwd() (where server was started)
      const fromCwd = process.cwd();
      if (fs.existsSync(path.join(fromCwd, 'contracts'))) {
        projectRoot = fromCwd;
      } else if (fs.existsSync(path.join(fromCwd, '..', 'contracts'))) {
        // If server was started from server/ directory, go up one level
        projectRoot = path.resolve(fromCwd, '..');
      } else {
        // Strategy 3: Try to find contracts relative to server directory
        const serverDir = path.resolve(__dirname, '../..');
        const parentOfServer = path.resolve(serverDir, '..');
        if (fs.existsSync(path.join(parentOfServer, 'contracts'))) {
          projectRoot = parentOfServer;
        } else {
          // Fallback: use fromDirname and let the error message be more helpful
          projectRoot = fromDirname;
        }
      }
    }
    
    const defaultPath = path.join(projectRoot, 'contracts', contractName);
    const fullContractPath = contractPath 
      ? path.resolve(projectRoot, contractPath)
      : defaultPath;

    console.log(`[Compile] Compiling contract: ${contractName}`);
    console.log(`[Compile] __dirname: ${__dirname}`);
    console.log(`[Compile] process.cwd(): ${process.cwd()}`);
    console.log(`[Compile] Project root resolved to: ${projectRoot}`);
    console.log(`[Compile] Contract path: ${fullContractPath}`);

    // Verify contract directory exists
    if (!fs.existsSync(fullContractPath)) {
      const contractsDir = path.join(projectRoot, 'contracts');
      const availableContracts = fs.existsSync(contractsDir)
        ? fs.readdirSync(contractsDir).filter(f => 
            fs.statSync(path.join(contractsDir, f)).isDirectory()
          ).join(', ')
        : 'contracts directory not found';
      
      const error = `Contract directory not found: ${fullContractPath}\n` +
                   `Project root: ${projectRoot}\n` +
                   `Available contracts: ${availableContracts}`;
      console.error(`[Compile] ${error}`);
      return {
        success: false,
        error: `Contract files not found. Please ensure the contract exists at ${contractPath || `contracts/${contractName}`}`,
      };
    }

    // Verify Cargo.toml exists
    const cargoTomlPath = path.join(fullContractPath, 'Cargo.toml');
    if (!fs.existsSync(cargoTomlPath)) {
      const error = `Cargo.toml not found in ${fullContractPath}`;
      console.error(`[Compile] ${error}`);
      return {
        success: false,
        error,
      };
    }

    // Check if soroban-cli is available
    // Try with enhanced PATH that includes common cargo bin locations
    const cargoBinPath = process.env.HOME ? `${process.env.HOME}/.cargo/bin` : '';
    const enhancedPath = cargoBinPath 
      ? `${cargoBinPath}:${process.env.PATH || ''}`
      : process.env.PATH || '';
    
    try {
      await execAsync('soroban --version', { 
        timeout: 5000,
        env: { ...process.env, PATH: enhancedPath }
      });
    } catch (error: any) {
      const errorMsg = 'soroban-cli is not installed or not in PATH.\n\n' +
                      'To install:\n' +
                      '1. Install Rust: curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh\n' +
                      '2. Add wasm32 target: rustup target add wasm32-unknown-unknown\n' +
                      '3. Install soroban-cli: cargo install --locked soroban-cli\n' +
                      '4. Add to PATH: export PATH="$HOME/.cargo/bin:$PATH"\n\n' +
                      'See INSTALL_SOROBAN.md for detailed instructions.';
      console.error(`[Compile] ${errorMsg}`);
      return {
        success: false,
        error: errorMsg,
      };
    }

    // Build command: soroban contract build
    // This will output to target/wasm32-unknown-unknown/release/{contractName}.wasm
    const buildCommand = `cd "${fullContractPath}" && soroban contract build`;
    
    console.log(`[Compile] Executing: ${buildCommand}`);
    
    const { stdout, stderr } = await execAsync(buildCommand, {
      cwd: fullContractPath,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer for large outputs
      env: { ...process.env, PATH: enhancedPath }, // Use enhanced PATH with cargo bin
    });

    // Check for build errors
    if (stderr && !stdout.includes('Finished')) {
      console.error(`[Compile] Build stderr: ${stderr}`);
      // Some warnings might go to stderr, but if there's no "Finished" in stdout, it likely failed
      if (!stdout.includes('Finished') && !stdout.includes('success')) {
        return {
          success: false,
          error: `Build failed: ${stderr || 'Unknown error'}`,
          output: stdout + stderr,
        };
      }
    }

    console.log(`[Compile] Build output: ${stdout.substring(0, 200)}...`);

    // Expected WASM file path
    const wasmPath = path.join(
      fullContractPath,
      'target',
      'wasm32-unknown-unknown',
      'release',
      `${contractName}.wasm`
    );

    // Verify WASM file was created
    if (!fs.existsSync(wasmPath)) {
      const error = `WASM file not found at expected path: ${wasmPath}`;
      console.error(`[Compile] ${error}`);
      return {
        success: false,
        error,
        output: stdout + stderr,
      };
    }

    // Get file size for logging
    const stats = fs.statSync(wasmPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);

    console.log(`[Compile] ✅ Build successful!`);
    console.log(`[Compile] WASM file: ${wasmPath} (${fileSizeKB} KB)`);

    return {
      success: true,
      wasmPath,
      output: stdout,
    };
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown compilation error';
    console.error(`[Compile] Exception: ${errorMessage}`);
    console.error(`[Compile] Error details:`, error);
    
    // Provide helpful error messages for common issues
    let userFriendlyError = errorMessage;
    
    if (error.code === 127 || errorMessage.includes('not found') || errorMessage.includes('soroban: command not found')) {
      userFriendlyError = 'soroban-cli is not installed or not in PATH. ' +
                         'Please install it with: cargo install --locked soroban-cli. ' +
                         'Make sure Rust and Cargo are installed first.';
    } else if (errorMessage.includes('Permission denied')) {
      userFriendlyError = 'Permission denied. Please check file permissions and ensure soroban-cli is executable.';
    } else if (errorMessage.includes('No such file') || errorMessage.includes('ENOENT')) {
      userFriendlyError = `File or directory not found: ${errorMessage}`;
    }
    
    return {
      success: false,
      error: `Compilation failed: ${userFriendlyError}`,
      output: error.stdout || error.stderr || '',
    };
  }
}

/**
 * Check if a contract is already compiled
 * 
 * @param contractName - Name of the contract
 * @param contractPath - Optional path to contract directory
 * @returns Path to WASM file if exists, null otherwise
 */
export function getCompiledWasmPath(
  contractName: string,
  contractPath?: string
): string | null {
  try {
    const projectRoot = path.resolve(__dirname, '../../..');
    const defaultPath = path.join(projectRoot, 'contracts', contractName);
    const fullContractPath = contractPath 
      ? path.resolve(projectRoot, contractPath)
      : defaultPath;

    const wasmPath = path.join(
      fullContractPath,
      'target',
      'wasm32-unknown-unknown',
      'release',
      `${contractName}.wasm`
    );

    if (fs.existsSync(wasmPath)) {
      return wasmPath;
    }

    return null;
  } catch (error) {
    console.error(`[Compile] Error checking WASM path:`, error);
    return null;
  }
}

