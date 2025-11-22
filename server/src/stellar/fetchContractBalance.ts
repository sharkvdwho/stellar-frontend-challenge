/**
 * Fetch contract balance and account information
 * Note: Contracts don't have balances in the traditional sense,
 * but we can check if the contract account exists and get its details
 */

export interface ContractAccountInfo {
  accountId: string;
  exists: boolean;
  balance?: string;
  sequenceNumber?: string;
  numSubEntries?: number;
  flags?: {
    authRequired: boolean;
    authRevocable: boolean;
    authImmutable: boolean;
  };
}

/**
 * Fetch account information for a contract
 * @param contractId - The contract ID (address)
 * @param network - Network: 'testnet' or 'mainnet'
 * @returns Contract account information
 */
export async function fetchContractBalance(
  contractId: string,
  network: 'testnet' | 'mainnet' = 'testnet'
): Promise<ContractAccountInfo> {
  const horizonUrl =
    network === 'testnet'
      ? 'https://horizon-testnet.stellar.org'
      : 'https://horizon.stellar.org';

  try {
    const response = await fetch(`${horizonUrl}/accounts/${contractId}`);

    if (response.status === 404) {
      return {
        accountId: contractId,
        exists: false,
      };
    }

    if (!response.ok) {
      throw new Error(`Horizon API error: ${response.status} ${response.statusText}`);
    }

    const account = await response.json();

    return {
      accountId: contractId,
      exists: true,
      balance: account.balances?.find((b: any) => b.asset_type === 'native')?.balance || '0',
      sequenceNumber: account.sequence,
      numSubEntries: account.subentry_count,
      flags: {
        authRequired: account.flags?.auth_required || false,
        authRevocable: account.flags?.auth_revocable || false,
        authImmutable: account.flags?.auth_immutable || false,
      },
    };
  } catch (error: any) {
    if (error.message.includes('404')) {
      return {
        accountId: contractId,
        exists: false,
      };
    }

    console.error(`Error fetching contract balance for ${contractId}:`, error);
    throw new Error(`Failed to fetch contract balance: ${error.message}`);
  }
}

/**
 * Check if a contract account exists
 */
export async function contractExists(
  contractId: string,
  network: 'testnet' | 'mainnet' = 'testnet'
): Promise<boolean> {
  try {
    const info = await fetchContractBalance(contractId, network);
    return info.exists;
  } catch (error) {
    return false;
  }
}

