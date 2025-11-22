/**
 * Deployment Routes
 * 
 * Handles contract compilation and deployment requests
 */

import { Router, Request, Response } from 'express';
import { compileContract } from '../services/compile';
import { deployContract } from '../services/deploy';
import { dbOperations } from '../db';

const router = Router();

interface DeployRequest {
  contractPath?: string;      // Optional path to contract directory
  contractName: string;       // Name of the contract (e.g., "counter")
  network: 'testnet' | 'mainnet';
  deployerSecret: string;     // Secret key for deployment
}

interface DeployResponse {
  success: boolean;
  contractId?: string;
  transactionHash?: string;
  timestamp?: string;
  error?: string;
}

/**
 * POST /deploy
 * Compiles and deploys a Soroban contract
 * 
 * Supports "counter" contract by default if contractName is "counter"
 */
router.post('/deploy', async (req: Request, res: Response) => {
  try {
    const { contractPath, contractName, network, deployerSecret }: DeployRequest = req.body;

    console.log(`[Deploy Route] Received deployment request`);
    console.log(`[Deploy Route] Contract: ${contractName}, Network: ${network}`);

    // Validate input
    if (!contractName || !network || !deployerSecret) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: contractName, network, deployerSecret',
      } as DeployResponse);
    }

    if (network !== 'testnet' && network !== 'mainnet') {
      return res.status(400).json({
        success: false,
        error: 'Network must be either "testnet" or "mainnet"',
      } as DeployResponse);
    }

    // Step 1: Compile the contract
    console.log(`[Deploy Route] Step 1: Compiling contract...`);
    const compileResult = await compileContract(contractName, contractPath);

    if (!compileResult.success || !compileResult.wasmPath) {
      console.error(`[Deploy Route] Compilation failed: ${compileResult.error}`);
      return res.status(500).json({
        success: false,
        error: compileResult.error || 'Compilation failed',
      } as DeployResponse);
    }

    console.log(`[Deploy Route] ✅ Compilation successful`);
    console.log(`[Deploy Route] WASM path: ${compileResult.wasmPath}`);

    // Step 2: Deploy the contract
    console.log(`[Deploy Route] Step 2: Deploying contract...`);
    const deployResult = await deployContract(
      compileResult.wasmPath,
      network,
      deployerSecret
    );

    if (!deployResult.success || !deployResult.contractId) {
      console.error(`[Deploy Route] Deployment failed: ${deployResult.error}`);
      return res.status(500).json({
        success: false,
        error: deployResult.error || 'Deployment failed',
      } as DeployResponse);
    }

    console.log(`[Deploy Route] ✅ Deployment successful`);
    console.log(`[Deploy Route] Contract ID: ${deployResult.contractId}`);

    // Step 3: Save to database
    console.log(`[Deploy Route] Step 3: Saving to database...`);
    try {
      const contractRecord = dbOperations.insertContract({
        contractId: deployResult.contractId,
        contractName: contractName,
        network: network,
        wasmPath: compileResult.wasmPath,
        deployerAddress: deployerSecret.substring(0, 8) + '...', // Partial for privacy
        transactionHash: deployResult.transactionHash || 'pending',
        timestamp: deployResult.timestamp || new Date().toISOString(),
        deployedAt: new Date().toISOString(),
      });

      console.log(`[Deploy Route] ✅ Contract saved to database (ID: ${contractRecord.id})`);

      // Return success response
      return res.status(200).json({
        success: true,
        contractId: deployResult.contractId,
        transactionHash: deployResult.transactionHash,
        timestamp: deployResult.timestamp,
      } as DeployResponse);
    } catch (dbError: any) {
      console.error(`[Deploy Route] Database error:`, dbError);
      // Still return success if deployment worked, but log DB error
      return res.status(200).json({
        success: true,
        contractId: deployResult.contractId,
        transactionHash: deployResult.transactionHash,
        timestamp: deployResult.timestamp,
        error: 'Deployment succeeded but failed to save to database',
      } as DeployResponse);
    }
  } catch (error: any) {
    console.error(`[Deploy Route] Unexpected error:`, error);
    return res.status(500).json({
      success: false,
      error: `Unexpected error: ${error.message}`,
    } as DeployResponse);
  }
});

/**
 * GET /contracts
 * List all deployed contracts
 */
router.get('/contracts', (req: Request, res: Response) => {
  try {
    const { network } = req.query;

    let contracts;
    if (network && (network === 'testnet' || network === 'mainnet')) {
      contracts = dbOperations.getContractsByNetwork(network);
    } else {
      contracts = dbOperations.getAllContracts();
    }

    return res.status(200).json({
      success: true,
      count: contracts.length,
      contracts: contracts,
    });
  } catch (error: any) {
    console.error(`[Deploy Route] Error fetching contracts:`, error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /contracts/:contractId
 * Get details of a specific contract
 */
router.get('/contracts/:contractId', (req: Request, res: Response) => {
  try {
    const { contractId } = req.params;
    const contract = dbOperations.getContractById(contractId);

    return res.status(200).json({
      success: true,
      contract: contract,
    });
  } catch (error: any) {
    return res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
