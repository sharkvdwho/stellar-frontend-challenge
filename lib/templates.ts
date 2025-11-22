/**
 * Contract Template System
 * 
 * Loads and manages contract templates from JSON files
 */

export interface ContractFunction {
  name: string;
  description: string;
  parameters: any[];
  returns: string;
}

export interface ContractEvent {
  name: string;
  description: string;
  data: string;
}

export interface ContractTemplate {
  id: string;
  name: string;
  description: string;
  version?: string;
  category?: string;
  author?: string;
  contractPath: string;
  contractName: string;
  functions?: ContractFunction[];
  events?: ContractEvent[];
  features?: string[];
  tags?: string[];
  icon?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedDeployTime?: string;
}

/**
 * Load all available templates
 * Only returns templates for contracts that actually exist
 * Currently only "counter" contract is available
 */
export async function loadTemplates(): Promise<ContractTemplate[]> {
  try {
    // List of all template definitions
    const allTemplates: ContractTemplate[] = [
      {
        id: 'counter',
        name: 'Counter Contract',
        description: 'A simple counter contract with increment, decrement, and get operations',
        version: '1.0.0',
        category: 'basic',
        author: 'Stellar Community',
        contractPath: 'contracts/counter',
        contractName: 'counter',
        functions: [
          {
            name: 'init',
            description: 'Initialize the counter to 0',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'increment',
            description: 'Increment the counter by 1',
            parameters: [],
            returns: 'i32',
          },
          {
            name: 'decrement',
            description: 'Decrement the counter by 1',
            parameters: [],
            returns: 'i32',
          },
          {
            name: 'get_count',
            description: 'Get the current counter value',
            parameters: [],
            returns: 'i32',
          },
        ],
        events: [
          {
            name: 'increment',
            description: 'Emitted when counter is incremented',
            data: 'new_count: i32',
          },
          {
            name: 'decrement',
            description: 'Emitted when counter is decremented',
            data: 'new_count: i32',
          },
        ],
        features: ['Persistent storage', 'Event emission', 'Simple state management'],
        tags: ['counter', 'state', 'basic', 'tutorial'],
        icon: '🔢',
        difficulty: 'beginner',
        estimatedDeployTime: '30-60 seconds',
      },
      {
        id: 'token',
        name: 'Token Contract',
        description: 'ERC-20 style token contract with mint, burn, transfer, and balance operations',
        version: '1.0.0',
        category: 'token',
        author: 'Stellar Community',
        contractPath: 'contracts/token',
        contractName: 'token',
        functions: [
          {
            name: 'init',
            description: 'Initialize the token with name, symbol, and decimals',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'mint',
            description: 'Mint new tokens to an address',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'burn',
            description: 'Burn tokens from an address',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'transfer',
            description: 'Transfer tokens between addresses',
            parameters: [],
            returns: 'bool',
          },
          {
            name: 'balance',
            description: 'Get token balance for an address',
            parameters: [],
            returns: 'i128',
          },
        ],
        events: [
          {
            name: 'transfer',
            description: 'Emitted when tokens are transferred',
            data: 'from: Address, to: Address, amount: i128',
          },
          {
            name: 'mint',
            description: 'Emitted when new tokens are minted',
            data: 'to: Address, amount: i128',
          },
        ],
        features: ['Token minting', 'Token burning', 'Transfer functionality', 'Balance tracking'],
        tags: ['token', 'erc20', 'fungible', 'intermediate'],
        icon: '🪙',
        difficulty: 'intermediate',
        estimatedDeployTime: '45-90 seconds',
      },
      {
        id: 'nft',
        name: 'NFT Contract',
        description: 'Non-fungible token contract for unique digital assets with minting and ownership',
        version: '1.0.0',
        category: 'nft',
        author: 'Stellar Community',
        contractPath: 'contracts/nft',
        contractName: 'nft',
        functions: [
          {
            name: 'init',
            description: 'Initialize the NFT contract',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'mint',
            description: 'Mint a new NFT to an address',
            parameters: [],
            returns: 'u32',
          },
          {
            name: 'transfer',
            description: 'Transfer NFT ownership',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'owner_of',
            description: 'Get the owner of a specific token ID',
            parameters: [],
            returns: 'Address',
          },
          {
            name: 'token_uri',
            description: 'Get the metadata URI for a token',
            parameters: [],
            returns: 'String',
          },
        ],
        events: [
          {
            name: 'transfer',
            description: 'Emitted when NFT is transferred',
            data: 'from: Address, to: Address, token_id: u32',
          },
          {
            name: 'mint',
            description: 'Emitted when new NFT is minted',
            data: 'to: Address, token_id: u32',
          },
        ],
        features: ['Unique token IDs', 'Ownership tracking', 'Metadata support', 'Transfer functionality'],
        tags: ['nft', 'non-fungible', 'collectibles', 'intermediate'],
        icon: '🖼️',
        difficulty: 'intermediate',
        estimatedDeployTime: '60-120 seconds',
      },
      {
        id: 'voting',
        name: 'Voting Contract',
        description: 'Decentralized voting system with proposal creation, voting, and result tracking',
        version: '1.0.0',
        category: 'governance',
        author: 'Stellar Community',
        contractPath: 'contracts/voting',
        contractName: 'voting',
        functions: [
          {
            name: 'init',
            description: 'Initialize the voting contract',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'create_proposal',
            description: 'Create a new voting proposal',
            parameters: [],
            returns: 'u32',
          },
          {
            name: 'vote',
            description: 'Cast a vote on a proposal',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'get_votes',
            description: 'Get vote count for a proposal',
            parameters: [],
            returns: 'i128',
          },
          {
            name: 'get_result',
            description: 'Get the result of a proposal',
            parameters: [],
            returns: 'bool',
          },
        ],
        events: [
          {
            name: 'proposal_created',
            description: 'Emitted when a new proposal is created',
            data: 'proposal_id: u32, description: String',
          },
          {
            name: 'vote_cast',
            description: 'Emitted when a vote is cast',
            data: 'proposal_id: u32, voter: Address, support: bool',
          },
        ],
        features: ['Proposal creation', 'Vote tracking', 'Result calculation', 'Governance'],
        tags: ['voting', 'governance', 'dao', 'advanced'],
        icon: '🗳️',
        difficulty: 'advanced',
        estimatedDeployTime: '90-180 seconds',
      },
      {
        id: 'escrow',
        name: 'Escrow Contract',
        description: 'Secure escrow service for holding funds until conditions are met',
        version: '1.0.0',
        category: 'finance',
        author: 'Stellar Community',
        contractPath: 'contracts/escrow',
        contractName: 'escrow',
        functions: [
          {
            name: 'init',
            description: 'Initialize an escrow agreement',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'deposit',
            description: 'Deposit funds into escrow',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'release',
            description: 'Release funds to the beneficiary',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'refund',
            description: 'Refund funds to the depositor',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'get_balance',
            description: 'Get the current escrow balance',
            parameters: [],
            returns: 'i128',
          },
        ],
        events: [
          {
            name: 'deposit',
            description: 'Emitted when funds are deposited',
            data: 'amount: i128, depositor: Address',
          },
          {
            name: 'release',
            description: 'Emitted when funds are released',
            data: 'amount: i128, beneficiary: Address',
          },
        ],
        features: ['Secure fund holding', 'Conditional release', 'Refund capability', 'Multi-party'],
        tags: ['escrow', 'finance', 'payment', 'intermediate'],
        icon: '🔒',
        difficulty: 'intermediate',
        estimatedDeployTime: '60-120 seconds',
      },
      {
        id: 'multisig',
        name: 'Multi-Signature Wallet',
        description: 'Multi-signature wallet requiring multiple approvals for transactions',
        version: '1.0.0',
        category: 'wallet',
        author: 'Stellar Community',
        contractPath: 'contracts/multisig',
        contractName: 'multisig',
        functions: [
          {
            name: 'init',
            description: 'Initialize multisig with owners and threshold',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'submit_transaction',
            description: 'Submit a new transaction for approval',
            parameters: [],
            returns: 'u32',
          },
          {
            name: 'approve',
            description: 'Approve a pending transaction',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'execute',
            description: 'Execute an approved transaction',
            parameters: [],
            returns: 'void',
          },
          {
            name: 'get_owners',
            description: 'Get list of wallet owners',
            parameters: [],
            returns: 'Vec<Address>',
          },
        ],
        events: [
          {
            name: 'transaction_submitted',
            description: 'Emitted when transaction is submitted',
            data: 'tx_id: u32, to: Address, value: i128',
          },
          {
            name: 'approval',
            description: 'Emitted when transaction is approved',
            data: 'tx_id: u32, approver: Address',
          },
        ],
        features: ['Multiple owners', 'Threshold approval', 'Transaction queue', 'Security'],
        tags: ['multisig', 'wallet', 'security', 'advanced'],
        icon: '👥',
        difficulty: 'advanced',
        estimatedDeployTime: '90-180 seconds',
      },
    ];

    // Return all templates - all contracts have been created
    return allTemplates;
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
}

/**
 * Load a specific template by ID
 */
export async function loadTemplate(templateId: string): Promise<ContractTemplate | null> {
  const templates = await loadTemplates();
  return templates.find((t) => t.id === templateId) || null;
}

/**
 * Get templates by category
 */
export async function getTemplatesByCategory(
  category: string
): Promise<ContractTemplate[]> {
  const templates = await loadTemplates();
  return templates.filter((t) => t.category === category);
}

/**
 * Search templates by query
 */
export async function searchTemplates(query: string): Promise<ContractTemplate[]> {
  const templates = await loadTemplates();
  const lowerQuery = query.toLowerCase();
  
  return templates.filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

