/**
 * Client-side Storage Helper
 * 
 * Manages localStorage for tracking deployed contracts
 */

export interface StoredContract {
  contractId: string;
  contractName?: string;
  network?: string;
  deployedAt: string;
  lastSeenTxCount?: number;
  lastUpdated?: string;
}

const STORAGE_KEY = 'stellar_deployed_contracts';

/**
 * Save a contract to localStorage
 */
export function saveContract(contract: {
  contractId: string;
  contractName?: string;
  network?: string;
  lastSeenTxCount?: number;
}): void {
  try {
    const contracts = loadContracts();
    
    // Check if contract already exists
    const existingIndex = contracts.findIndex(
      (c) => c.contractId === contract.contractId
    );

    const contractData: StoredContract = {
      contractId: contract.contractId,
      contractName: contract.contractName,
      network: contract.network,
      deployedAt: existingIndex >= 0 
        ? contracts[existingIndex].deployedAt 
        : new Date().toISOString(),
      lastSeenTxCount: contract.lastSeenTxCount ?? contracts[existingIndex]?.lastSeenTxCount,
      lastUpdated: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      // Update existing contract
      contracts[existingIndex] = contractData;
    } else {
      // Add new contract
      contracts.push(contractData);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
  } catch (error) {
    console.error('Error saving contract to localStorage:', error);
  }
}

/**
 * Load all contracts from localStorage
 */
export function loadContracts(): StoredContract[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const contracts = JSON.parse(stored) as StoredContract[];
    
    // Validate and clean up data
    return contracts.filter((contract) => {
      return contract && contract.contractId;
    });
  } catch (error) {
    console.error('Error loading contracts from localStorage:', error);
    return [];
  }
}

/**
 * Update contract's last seen transaction count
 */
export function updateContractTxCount(
  contractId: string,
  txCount: number
): void {
  try {
    const contracts = loadContracts();
    const contractIndex = contracts.findIndex(
      (c) => c.contractId === contractId
    );

    if (contractIndex >= 0) {
      contracts[contractIndex].lastSeenTxCount = txCount;
      contracts[contractIndex].lastUpdated = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(contracts));
    }
  } catch (error) {
    console.error('Error updating contract tx count:', error);
  }
}

/**
 * Remove a contract from localStorage
 */
export function removeContract(contractId: string): void {
  try {
    const contracts = loadContracts();
    const filtered = contracts.filter(
      (c) => c.contractId !== contractId
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing contract from localStorage:', error);
  }
}

/**
 * Get a specific contract by ID
 */
export function getContract(contractId: string): StoredContract | null {
  const contracts = loadContracts();
  return contracts.find((c) => c.contractId === contractId) || null;
}

/**
 * Clear all stored contracts
 */
export function clearContracts(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing contracts from localStorage:', error);
  }
}

/**
 * Initialize with mock contracts for demonstration
 */
export function initializeMockContracts(): void {
  try {
    const existing = loadContracts();
    if (existing.length > 0) {
      return; // Don't overwrite existing contracts
    }

    const mockContracts: StoredContract[] = [
      {
        contractId: 'CA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZLKERYNZGGA5SOAOPIH6RTLYF4D',
        contractName: 'Counter Contract',
        network: 'testnet',
        deployedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        lastSeenTxCount: 47,
        lastUpdated: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      },
      {
        contractId: 'CB4E6LSTN7DC8PXQ7UXZSS4Z5U8HOAMLFSTZAHHB5TPBPQJI7SULZG5E',
        contractName: 'Token Contract',
        network: 'testnet',
        deployedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        lastSeenTxCount: 123,
        lastUpdated: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      },
      {
        contractId: 'CC5F7MTUO8ED9QYR8VYATT5Z6V9IPBNMGUTABIIC6UQCQRKJ8TVMAH6F',
        contractName: 'NFT Contract',
        network: 'testnet',
        deployedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        lastSeenTxCount: 89,
        lastUpdated: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      },
      {
        contractId: 'CD6G8NUVP9FE0RZS9WZBUU6Z7W0JQCONHVVUBCJJD7VRDRSLK9UWNB7G',
        contractName: 'Voting Contract',
        network: 'testnet',
        deployedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        lastSeenTxCount: 156,
        lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        contractId: 'CE7H9OWVQ0GF1SAT0XACVV7Z8X1KRDOPOIWWVCDKKE8WSESTML0VXOC8H',
        contractName: 'Escrow Contract',
        network: 'testnet',
        deployedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        lastSeenTxCount: 34,
        lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      },
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockContracts));
  } catch (error) {
    console.error('Error initializing mock contracts:', error);
  }
}

