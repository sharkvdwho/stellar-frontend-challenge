/**
 * Fetch transactions for a Soroban contract using Soroban RPC
 * 
 * Queries Soroban RPC to get transactions involving a specific contract
 */

const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

export interface ContractTransaction {
  id: string;
  hash: string;
  ledger: number;
  created_at: string;
  fee_charged: string;
  operation_count: number;
  successful: boolean;
  paging_token: string;
}

/**
 * Get contract transactions using Soroban RPC and Horizon API
 * 
 * @param contractId - The contract ID (address)
 * @returns Array of latest 20 transactions involving the contract
 */
export async function getContractTransactions(
  contractId: string
): Promise<ContractTransaction[]> {
  try {
    console.log(`[FetchTransactions] Fetching transactions for contract: ${contractId}`);

    // Use Horizon API to find transactions involving the contract
    // Soroban RPC doesn't have a direct getTransactions method
    return await fetchTransactionsFromHorizon(contractId);
  } catch (error: any) {
    console.error(`[FetchTransactions] Error fetching transactions:`, error);
    return [];
  }
}

/**
 * Fetch transactions from Horizon API
 * Searches for transactions involving the contract by checking operations
 */
async function fetchTransactionsFromHorizon(
  contractId: string
): Promise<ContractTransaction[]> {
  try {
    console.log(`[FetchTransactions] Querying Horizon API for contract transactions`);
    const horizonUrl = 'https://horizon-testnet.stellar.org';
    
    const contractTransactions: ContractTransaction[] = [];
    let cursor: string | undefined = undefined;
    const maxPages = 10; // Limit to 10 pages (2000 transactions max)
    let pageCount = 0;

    // Search through recent transactions
    while (contractTransactions.length < 20 && pageCount < maxPages) {
      let url = `${horizonUrl}/transactions?limit=200&order=desc`;
      if (cursor) {
        url += `&cursor=${cursor}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Horizon API error: ${response.status}`);
      }

      const data = await response.json();
      const records = data._embedded?.records || [];

      if (records.length === 0) {
        break;
      }

      // Check each transaction's operations for contract involvement
      for (const tx of records) {
        const involvesContract = await checkTransactionInvolvesContract(
          tx,
          contractId,
          horizonUrl
        );

        if (involvesContract) {
          contractTransactions.push({
            id: tx.id,
            hash: tx.hash,
            ledger: tx.ledger,
            created_at: tx.created_at,
            fee_charged: tx.fee_charged,
            operation_count: tx.operation_count,
            successful: tx.successful,
            paging_token: tx.paging_token,
          });

          if (contractTransactions.length >= 20) {
            break;
          }
        }

        cursor = tx.paging_token;
      }

      pageCount++;
      
      if (records.length < 200) {
        break; // Reached the end
      }
    }

    console.log(`[FetchTransactions] Found ${contractTransactions.length} transactions`);
    return contractTransactions.slice(0, 20); // Return latest 20
  } catch (error: any) {
    console.error(`[FetchTransactions] Horizon API error:`, error);
    return [];
  }
}

/**
 * Check if a transaction involves a specific contract
 * by examining its operations
 */
async function checkTransactionInvolvesContract(
  tx: any,
  contractId: string,
  horizonUrl: string
): Promise<boolean> {
  try {
    // Fetch transaction operations
    const opsUrl = `${horizonUrl}/transactions/${tx.hash}/operations`;
    const opsResponse = await fetch(opsUrl);
    
    if (!opsResponse.ok) {
      return false;
    }

    const opsData = await opsResponse.json();
    const operations = opsData._embedded?.records || [];

    // Check each operation for contract involvement
    for (const op of operations) {
      // Check for Soroban contract operations
      if (op.type === 'invoke_host_function' || op.type === 'extend_ttl' || op.type === 'restore_footprint') {
        // Contract operations might have contract_id in various fields
        const contractStr = JSON.stringify(op);
        if (contractStr.includes(contractId)) {
          return true;
        }
      }

      // Check for contract address in operation details
      if (op.contract_id === contractId || 
          op.source_account === contractId ||
          (op.function && op.contract === contractId)) {
        return true;
      }
    }

    return false;
  } catch (error) {
    // If we can't check operations, return false
    return false;
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getContractTransactions instead
 */
export async function fetchTransactions(
  contractId: string,
  network: 'testnet' | 'mainnet' = 'testnet',
  limit: number = 200
): Promise<ContractTransaction[]> {
  return getContractTransactions(contractId).then(txs => txs.slice(0, limit));
}

/**
 * Fetch recent transactions (last N) for a contract
 */
export async function fetchRecentTransactions(
  contractId: string,
  network: 'testnet' | 'mainnet' = 'testnet',
  limit: number = 10
): Promise<ContractTransaction[]> {
  const transactions = await getContractTransactions(contractId);
  return transactions.slice(0, limit);
}
