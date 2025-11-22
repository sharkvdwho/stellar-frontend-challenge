/**
 * Fetch events emitted by a Soroban contract using Soroban RPC
 * 
 * Queries Soroban RPC to get events emitted by a specific contract
 */

const SOROBAN_RPC_URL = 'https://soroban-testnet.stellar.org';

export interface ContractEvent {
  id: string;
  type: string;
  ledger: number;
  ledgerClosedAt: string;
  contractId: string;
  topic: string[];
  value: any;
  txHash: string;
  timestamp: string;
}

/**
 * Get contract events using Soroban RPC
 * 
 * @param contractId - The contract ID (address)
 * @returns Array of events with type, topics, and timestamp
 */
export async function getContractEvents(
  contractId: string
): Promise<ContractEvent[]> {
  try {
    console.log(`[FetchEvents] Fetching events for contract: ${contractId}`);

    // Soroban RPC getEvents request
    const requestBody = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getEvents',
      params: {
        startLedger: 0,
        filters: [
          {
            contractIds: [contractId],
          },
        ],
        pagination: {
          limit: 1000, // Get all events (can be paginated later)
        },
      },
    };

    const response = await fetch(SOROBAN_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Soroban RPC error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Soroban RPC error: ${data.error.message || JSON.stringify(data.error)}`);
    }

    const events = data.result?.events || [];

    console.log(`[FetchEvents] Found ${events.length} events`);

    // Transform RPC events to our format
    return events.map((event: any, index: number) => {
      // Extract event type from topics (first topic is usually the event type)
      const eventType = event.type || 
                       (event.topic && event.topic.length > 0 ? String(event.topic[0]) : 'contract');
      
      // Extract topics (array of strings/values)
      const topics = event.topic || [];
      
      // Extract timestamp
      const timestamp = event.ledgerClosedAt || 
                       event.timestamp || 
                       new Date().toISOString();
      
      // Extract transaction hash
      const txHash = event.txHash || event.transactionHash || '';

      return {
        id: `${event.ledger || 0}-${index}`,
        type: eventType,
        ledger: event.ledger || 0,
        ledgerClosedAt: timestamp,
        contractId: contractId,
        topic: topics.map((t: any) => String(t)), // Ensure all topics are strings
        value: event.value || event.data || null,
        txHash: txHash,
        timestamp: timestamp,
      };
    });
  } catch (error: any) {
    console.error(`[FetchEvents] Error fetching events:`, error);
    console.error(`[FetchEvents] Error details:`, error.message);
    return [];
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use getContractEvents instead
 */
export async function fetchEvents(
  contractId: string,
  network: 'testnet' | 'mainnet' = 'testnet',
  limit: number = 200
): Promise<ContractEvent[]> {
  return getContractEvents(contractId).then(events => events.slice(0, limit));
}

/**
 * Fetch recent events (last N) for a contract
 */
export async function fetchRecentEvents(
  contractId: string,
  network: 'testnet' | 'mainnet' = 'testnet',
  limit: number = 10
): Promise<ContractEvent[]> {
  const events = await getContractEvents(contractId);
  // Events are typically returned in reverse chronological order
  return events.slice(0, limit);
}

/**
 * Count total events for a contract
 */
export async function countEvents(
  contractId: string,
  network: 'testnet' | 'mainnet' = 'testnet'
): Promise<number> {
  try {
    const events = await getContractEvents(contractId);
    return events.length;
  } catch (error) {
    console.error('Error counting events:', error);
    return 0;
  }
}
