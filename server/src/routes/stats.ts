/**
 * Contract Statistics Routes
 * 
 * Provides statistics endpoints for deployed contracts
 * Uses Soroban RPC for analytics
 */

import { Router, Request, Response } from 'express';
import { dbOperations } from '../db';
import { getContractTransactions } from '../stellar/fetchTransactions';
import { getContractEvents } from '../stellar/fetchEvents';
import { getContractStats } from '../stellar/computeStats';

const router = Router();

/**
 * GET /stats/:contractId
 * Get full statistics for a contract
 * 
 * Returns:
 * - totalTx: Total number of transactions
 * - totalEvents: Total number of events
 * - avgFee: Average transaction fee
 * - lastActivity: Timestamp of last activity
 * - transactions: Latest 20 transactions
 * - events: Latest 20 events
 */
router.get('/stats/:contractId', async (req: Request, res: Response) => {
  try {
    const { contractId } = req.params;

    console.log(`[Stats Route] Fetching stats for contract: ${contractId}`);

    if (!contractId) {
      return res.status(400).json({
        success: false,
        error: 'Contract ID is required',
      });
    }

    // Get contract from database (optional - for metadata)
    let contractName = 'Unknown';
    let network = 'testnet';
    
    try {
      const contract = dbOperations.getContractById(contractId);
      contractName = contract.contractName;
      network = contract.network;
    } catch (error) {
      // Contract not in database, but we can still fetch stats
      console.log(`[Stats Route] Contract not in database, fetching stats anyway`);
    }

    // Compute statistics using Soroban RPC
    const stats = await getContractStats(contractId);

    // Enhance stats with contract metadata
    const fullStats = {
      ...stats,
      contractName,
      network,
    };

    return res.status(200).json({
      success: true,
      stats: fullStats,
    });
  } catch (error: any) {
    console.error(`[Stats Route] Error:`, error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch contract statistics',
    });
  }
});

/**
 * GET /contracts/:id/stats
 * Legacy endpoint for backward compatibility
 * Get comprehensive statistics for a contract
 */
router.get('/contracts/:id/stats', async (req: Request, res: Response) => {
  try {
    const { id: contractId } = req.params;
    const { network } = req.query;

    // Get contract from database
    let contract;
    try {
      contract = dbOperations.getContractById(contractId);
    } catch (error: any) {
      // Contract not in database, but we can still fetch stats
      const contractNetwork = (network as string) || 'testnet';
      contract = {
        contract_id: contractId,
        contract_name: 'Unknown',
        network: contractNetwork,
      } as any;
    }

    const contractNetwork = (contract.network || network || 'testnet') as 'testnet' | 'mainnet';

    console.log(`[Stats] Fetching statistics for contract ${contractId} on ${contractNetwork}`);

    // Compute statistics
    const stats = await getContractStats(contractId);

    // Format response for legacy endpoint
    const response = {
      contractId: contractId,
      contractName: contract.contract_name || 'Unknown',
      network: contractNetwork,
      totalTransactions: stats.totalTx,
      totalEvents: stats.totalEvents,
      recentTransactions: stats.transactions.slice(0, 10),
      averageFee: stats.avgFee,
      lastInteraction: stats.lastActivity,
    };

    return res.status(200).json({
      success: true,
      stats: response,
    });
  } catch (error: any) {
    console.error(`[Stats] Error:`, error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch contract statistics',
    });
  }
});

/**
 * GET /contracts/:id/transactions
 * Get transactions for a contract
 */
router.get('/contracts/:id/transactions', async (req: Request, res: Response) => {
  try {
    const { id: contractId } = req.params;
    const { limit } = req.query;

    const txLimit = limit ? parseInt(limit as string) : 20;

    const transactions = await getContractTransactions(contractId);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions: transactions.slice(0, txLimit),
    });
  } catch (error: any) {
    console.error(`[Stats] Error fetching transactions:`, error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transactions',
    });
  }
});

/**
 * GET /contracts/:id/events
 * Get events for a contract
 */
router.get('/contracts/:id/events', async (req: Request, res: Response) => {
  try {
    const { id: contractId } = req.params;
    const { limit } = req.query;

    const eventLimit = limit ? parseInt(limit as string) : 20;

    const events = await getContractEvents(contractId);

    return res.status(200).json({
      success: true,
      count: events.length,
      events: events.slice(0, eventLimit),
    });
  } catch (error: any) {
    console.error(`[Stats] Error fetching events:`, error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch events',
    });
  }
});

export default router;
