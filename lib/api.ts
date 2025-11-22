/**
 * API Client for Backend Server
 * Handles communication with the contract deployment server
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface DeployRequest {
  contractPath: string;
  contractName: string;
  network: 'testnet' | 'mainnet';
  deployerSecret: string;
}

export interface DeployResponse {
  success: boolean;
  contractId?: string;
  transactionHash?: string;
  error?: string;
  warning?: string;
}

export interface Contract {
  id: number;
  contract_id: string;
  contract_name: string;
  network: string;
  wasm_path: string;
  deployer_address: string;
  transaction_hash: string;
  deployed_at: string;
  created_at: string;
}

export interface ContractsResponse {
  success: boolean;
  count: number;
  contracts: Contract[];
}

/**
 * Deploy a Soroban contract
 * 
 * Sends POST request to /api/deploy endpoint
 * 
 * @param request - Deployment request with contractPath, contractName, network, deployerSecret
 * @returns DeployResponse with contractId and transactionHash on success
 */
export async function deployContract(
  request: DeployRequest
): Promise<DeployResponse> {
  try {
    console.log(`[API] Deploying contract: ${request.contractName} on ${request.network}`);
    console.log(`[API] Connecting to: ${API_BASE_URL}/api/deploy`);
    
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 2 minute timeout
    
    const response = await fetch(`${API_BASE_URL}/api/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      console.error(`[API] Deployment failed:`, data.error);
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    console.log(`[API] Deployment successful:`, data.contractId);
    return data as DeployResponse;
  } catch (error: any) {
    console.error(`[API] Deployment error:`, error);
    
    // Provide more helpful error messages
    let errorMessage = 'Failed to connect to deployment server';
    
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      errorMessage = 'Request timed out. The server may be taking too long to respond.';
    } else if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
      errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the server is running on port 3001.`;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get all deployed contracts
 */
export async function getContracts(
  network?: 'testnet' | 'mainnet'
): Promise<ContractsResponse> {
  try {
    const url = network
      ? `${API_BASE_URL}/api/contracts?network=${network}`
      : `${API_BASE_URL}/api/contracts`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data as ContractsResponse;
  } catch (error: any) {
    return {
      success: false,
      count: 0,
      contracts: [],
    };
  }
}

/**
 * Get a specific contract by ID
 */
export async function getContract(
  contractId: string
): Promise<{ success: boolean; contract?: Contract; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch contract',
    };
  }
}

/**
 * Check if the API server is available
 */
export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Contract Statistics Types
 */
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

export interface ContractEvent {
  id: string;
  type: string;
  ledger: number;
  ledgerClosedAt: string;
  contractId: string;
  topic: string[];
  value: any;
  txHash: string;
}

export interface ContractStats {
  contractId: string;
  contractName: string;
  network: string;
  totalTransactions: number;
  totalEvents: number;
  recentTransactions: ContractTransaction[];
  averageFee: string;
  lastInteraction: string | null;
  // New format properties (from /api/stats/:contractId)
  totalTx?: number;
  totalEvents?: number;
  avgFee?: string;
  lastActivity?: string | null;
  transactions?: ContractTransaction[];
  events?: ContractEvent[];
  accountInfo?: {
    exists: boolean;
    balance?: string;
  };
}

export interface StatsResponse {
  success: boolean;
  stats?: ContractStats;
  error?: string;
}

/**
 * Get contract statistics
 * Uses the new /api/stats/:contractId endpoint
 */
export async function getContractStats(
  contractId: string
): Promise<StatsResponse> {
  try {
    // Try new endpoint first
    const response = await fetch(`${API_BASE_URL}/api/stats/${contractId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      // Fallback to legacy endpoint
      return getContractStatsLegacy(contractId);
    }

    return data as StatsResponse;
  } catch (error: any) {
    // Fallback to legacy endpoint
    return getContractStatsLegacy(contractId);
  }
}

/**
 * Legacy stats endpoint (backward compatibility)
 */
async function getContractStatsLegacy(
  contractId: string
): Promise<StatsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/contracts/${contractId}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return data as StatsResponse;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch contract statistics',
    };
  }
}

/**
 * Get contract transactions
 */
export async function getContractTransactions(
  contractId: string,
  limit: number = 50
): Promise<{ success: boolean; transactions?: ContractTransaction[]; error?: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/contracts/${contractId}/transactions?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch transactions',
    };
  }
}

/**
 * Get contract events
 */
export async function getContractEvents(
  contractId: string,
  limit: number = 50
): Promise<{ success: boolean; events?: ContractEvent[]; error?: string }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/contracts/${contractId}/events?limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}`,
      };
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to fetch events',
    };
  }
}

