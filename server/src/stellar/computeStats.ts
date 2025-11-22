/**
 * Contract Statistics Computation
 * 
 * Computes aggregated statistics for a contract from transactions and events
 */

import { getContractTransactions, ContractTransaction } from './fetchTransactions';
import { getContractEvents, ContractEvent } from './fetchEvents';

export interface ContractStats {
  contractId: string;
  totalTx: number;
  totalEvents: number;
  avgFee: string;
  lastActivity: string | null;
  transactions: ContractTransaction[];
  events: ContractEvent[];
}

/**
 * Get comprehensive contract statistics
 * 
 * @param contractId - The contract ID (address)
 * @returns ContractStats with totalTx, totalEvents, avgFee, lastActivity
 */
export async function getContractStats(
  contractId: string
): Promise<ContractStats> {
  try {
    console.log(`[ComputeStats] Computing statistics for contract: ${contractId}`);

    // Fetch transactions and events in parallel
    const [transactions, events] = await Promise.all([
      getContractTransactions(contractId).catch((error) => {
        console.error(`[ComputeStats] Error fetching transactions:`, error);
        return [];
      }),
      getContractEvents(contractId).catch((error) => {
        console.error(`[ComputeStats] Error fetching events:`, error);
        return [];
      }),
    ]);

    console.log(`[ComputeStats] Found ${transactions.length} transactions, ${events.length} events`);

    // Calculate total transactions
    const totalTx = transactions.length;

    // Calculate total events
    const totalEvents = events.length;

    // Calculate average fee
    let avgFee = '0';
    if (transactions.length > 0) {
      const totalFees = transactions.reduce((sum, tx) => {
        const fee = parseFloat(tx.fee_charged || '0');
        return sum + fee;
      }, 0);
      avgFee = (totalFees / transactions.length).toFixed(7);
    }

    // Get last activity timestamp
    let lastActivity: string | null = null;

    // Get latest transaction timestamp
    if (transactions.length > 0) {
      const sortedTxs = [...transactions].sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeB - timeA; // Descending order
      });
      lastActivity = sortedTxs[0].created_at;
    }

    // Get latest event timestamp if no transactions or if event is newer
    if (events.length > 0) {
      const sortedEvents = [...events].sort((a, b) => {
        const timeA = new Date(a.timestamp || a.ledgerClosedAt).getTime();
        const timeB = new Date(b.timestamp || b.ledgerClosedAt).getTime();
        return timeB - timeA; // Descending order
      });
      
      const latestEvent = sortedEvents[0];
      const eventTime = latestEvent.timestamp || latestEvent.ledgerClosedAt;
      
      if (!lastActivity || new Date(eventTime) > new Date(lastActivity)) {
        lastActivity = eventTime;
      }
    }

    const stats: ContractStats = {
      contractId,
      totalTx,
      totalEvents,
      avgFee,
      lastActivity,
      transactions: transactions.slice(0, 20), // Latest 20 transactions
      events: events.slice(0, 20), // Latest 20 events
    };

    console.log(`[ComputeStats] Statistics computed:`);
    console.log(`[ComputeStats] - Total TX: ${totalTx}`);
    console.log(`[ComputeStats] - Total Events: ${totalEvents}`);
    console.log(`[ComputeStats] - Avg Fee: ${avgFee} XLM`);
    console.log(`[ComputeStats] - Last Activity: ${lastActivity || 'Never'}`);

    return stats;
  } catch (error: any) {
    console.error(`[ComputeStats] Error computing statistics:`, error);
    throw new Error(`Failed to compute contract statistics: ${error.message}`);
  }
}

