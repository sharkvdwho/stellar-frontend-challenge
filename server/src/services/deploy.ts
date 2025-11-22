/**
 * Contract Deployment Service
 * 
 * Handles deployment of compiled Soroban contracts to Stellar network
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export interface DeployResult {
  success: boolean;
  contractId?: string;
  transactionHash?: string;
  timestamp?: string;
  error?: string;
  output?: string;
}

/**
 * Deploy a compiled Soroban contract
 * 
 * @param wasmPath - Full path to the compiled WASM file
 * @param network - Network to deploy to ('testnet' or 'mainnet')
 * @param deployerSecret - Secret key of the deployer account
 * @returns DeployResult with contract ID, transaction hash, and timestamp
 */
export async function deployContract(
  wasmPath: string,
  network: 'testnet' | 'mainnet',
  deployerSecret: string
): Promise<DeployResult> {
  try {
    console.log(`[Deploy] Starting deployment to ${network}`);
    console.log(`[Deploy] WASM path: ${wasmPath}`);

    // Verify WASM file exists
    if (!fs.existsSync(wasmPath)) {
      const error = `WASM file not found: ${wasmPath}`;
      console.error(`[Deploy] ${error}`);
      return {
        success: false,
        error,
      };
    }

    // Get file size for logging
    const stats = fs.statSync(wasmPath);
    const fileSizeKB = (stats.size / 1024).toFixed(2);
    console.log(`[Deploy] WASM file size: ${fileSizeKB} KB`);

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
      console.error(`[Deploy] ${errorMsg}`);
      return {
        success: false,
        error: errorMsg,
      };
    }

    // Build deployment command
    // soroban contract deploy --wasm <path> --network <network> --source <secret>
    const deployCommand = [
      'soroban',
      'contract',
      'deploy',
      '--wasm', wasmPath,
      '--network', network,
      '--source', deployerSecret,
    ].join(' ');

    console.log(`[Deploy] Executing deployment command...`);
    console.log(`[Deploy] Command: soroban contract deploy --wasm ${path.basename(wasmPath)} --network ${network} --source <hidden>`);

    let stdout = '';
    let stderr = '';

    try {
      const result = await execAsync(deployCommand, {
        maxBuffer: 10 * 1024 * 1024, // 10MB buffer
        env: { ...process.env, PATH: enhancedPath }, // Use enhanced PATH with cargo bin
      });
      stdout = result.stdout || '';
      stderr = result.stderr || '';
    } catch (execError: any) {
      // execAsync throws on non-zero exit codes, but we might still have useful output
      stdout = execError.stdout || '';
      stderr = execError.stderr || execError.message || '';
      
      // Log the error but continue to try parsing output
      console.warn(`[Deploy] Command exited with error, but checking output...`);
      console.warn(`[Deploy] Error: ${stderr.substring(0, 200)}`);
    }

    // Combine outputs for analysis
    const fullOutput = stdout + stderr;
    
    // Log output (truncated for security)
    const safeOutput = fullOutput.replace(/--source\s+\S+/g, '--source <hidden>');
    console.log(`[Deploy] Deployment output (first 1000 chars):`);
    console.log(safeOutput.substring(0, 1000));

    // Check for common error patterns
    if (fullOutput.includes('error:') || fullOutput.includes('Error:') || fullOutput.includes('ERROR')) {
      const errorMatch = fullOutput.match(/(error|Error|ERROR)[:\s]+([^\n]+)/i);
      const errorMessage = errorMatch ? errorMatch[2] : 'Unknown deployment error';
      console.error(`[Deploy] Deployment error detected: ${errorMessage}`);
      
      // Check for specific error types
      if (fullOutput.includes('not found') || fullOutput.includes('No such file')) {
        return {
          success: false,
          error: `File not found or soroban-cli not installed: ${errorMessage}`,
          output: fullOutput,
        };
      }
      
      if (fullOutput.includes('insufficient') || fullOutput.includes('balance')) {
        return {
          success: false,
          error: `Insufficient balance for deployment: ${errorMessage}`,
          output: fullOutput,
        };
      }
      
      if (fullOutput.includes('network') || fullOutput.includes('connection')) {
        return {
          success: false,
          error: `Network connection error: ${errorMessage}`,
          output: fullOutput,
        };
      }
      
      return {
        success: false,
        error: `Deployment failed: ${errorMessage}`,
        output: fullOutput,
      };
    }

    // Parse contract ID from output - try multiple patterns
    // Stellar contract IDs start with 'C' and are 56 characters
    const contractIdPatterns = [
      /Contract\s+ID[:\s]+([CA-Z0-9]{56})/i,
      /contract\s+id[:\s]+([CA-Z0-9]{56})/i,
      /ContractId[:\s]+([CA-Z0-9]{56})/i,
      /contractId[:\s]+([CA-Z0-9]{56})/i,
      /([CA-Z0-9]{56})/g, // Fallback: any 56-char string starting with C
    ];

    let contractId: string | null = null;
    
    for (const pattern of contractIdPatterns) {
      const match = fullOutput.match(pattern);
      if (match && match[1] && match[1].startsWith('C') && match[1].length === 56) {
        contractId = match[1];
        break;
      }
    }

    if (!contractId) {
      console.error(`[Deploy] Could not parse contract ID from output`);
      console.error(`[Deploy] Full output length: ${fullOutput.length}`);
      console.error(`[Deploy] Output preview: ${fullOutput.substring(0, 500)}`);
      
      // If we have output but no contract ID, it might still be a success
      // Some soroban-cli versions might output differently
      if (fullOutput.includes('success') || fullOutput.includes('deployed') || fullOutput.includes('Success')) {
        return {
          success: false,
          error: 'Deployment may have succeeded but contract ID could not be parsed. Please check the output manually.',
          output: fullOutput,
        };
      }
      
      return {
        success: false,
        error: 'Could not parse contract ID from deployment output. The deployment may have failed.',
        output: fullOutput,
      };
    }

    console.log(`[Deploy] ✅ Contract deployed! ID: ${contractId}`);

    // Parse transaction hash from output
    // Expected format: "Transaction hash: <hash>" or similar
    // Transaction hashes are typically 64 hex characters
    const fullOutputForTx = stdout + stderr;
    const txHashPatterns = [
      /Transaction\s+hash[:\s]+([a-f0-9]{64})/i,
      /tx\s+hash[:\s]+([a-f0-9]{64})/i,
      /txHash[:\s]+([a-f0-9]{64})/i,
      /hash[:\s]+([a-f0-9]{64})/i,
      /([a-f0-9]{64})/g, // Fallback: any 64-char hex string
    ];

    let transactionHash = 'pending';
    
    for (const pattern of txHashPatterns) {
      const match = fullOutputForTx.match(pattern);
      if (match && match[1] && match[1].length === 64) {
        transactionHash = match[1];
        break;
      }
    }

    if (transactionHash !== 'pending') {
      console.log(`[Deploy] Transaction hash: ${transactionHash}`);
    } else {
      console.warn(`[Deploy] Could not parse transaction hash from output`);
    }

    const timestamp = new Date().toISOString();

    return {
      success: true,
      contractId,
      transactionHash,
      timestamp,
      output: stdout,
    };
  } catch (error: any) {
    const errorMessage = error.message || 'Unknown deployment error';
    console.error(`[Deploy] Exception: ${errorMessage}`);
    console.error(`[Deploy] Error details:`, error);
    console.error(`[Deploy] Error stack:`, error.stack);

    // Try to extract error message from stderr if available
    const errorOutput = error.stderr || error.stdout || errorMessage;
    
    // Provide more helpful error messages
    let userFriendlyError = errorMessage;
    
    if (errorMessage.includes('ENOENT') || errorMessage.includes('not found')) {
      userFriendlyError = 'soroban-cli not found. Please ensure soroban-cli is installed and in your PATH.';
    } else if (errorMessage.includes('EACCES') || errorMessage.includes('permission')) {
      userFriendlyError = 'Permission denied. Please check file permissions and soroban-cli access.';
    } else if (errorMessage.includes('timeout')) {
      userFriendlyError = 'Deployment timed out. Please check your network connection and try again.';
    }

    return {
      success: false,
      error: `Deployment failed: ${userFriendlyError}`,
      output: errorOutput,
    };
  }
}

/**
 * Verify deployment by checking contract ID format
 * 
 * @param contractId - Contract ID to verify
 * @returns true if contract ID format is valid
 */
export function isValidContractId(contractId: string): boolean {
  // Stellar contract IDs are typically 56 characters, alphanumeric
  // Format: Starts with 'C' followed by 55 alphanumeric characters
  return /^C[A-Z0-9]{55}$/.test(contractId);
}

