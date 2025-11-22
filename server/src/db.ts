/**
 * JSON-based Database for Contract Deployments
 * 
 * Lightweight file-based storage using JSON
 */

import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'db.json');

export interface ContractRecord {
  id: number;
  contractId: string;
  contractName: string;
  network: string;
  wasmPath: string;
  deployerAddress: string;
  transactionHash: string;
  timestamp: string;
  deployedAt: string;
}

interface Database {
  contracts: ContractRecord[];
  lastId: number;
}

/**
 * Read database from JSON file
 */
function readDatabase(): Database {
  try {
    if (!fs.existsSync(dbPath)) {
      return {
        contracts: [],
        lastId: 0,
      };
    }

    const data = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(data) as Database;
  } catch (error) {
    console.error('[DB] Error reading database:', error);
    return {
      contracts: [],
      lastId: 0,
    };
  }
}

/**
 * Write database to JSON file
 */
function writeDatabase(db: Database): void {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf-8');
  } catch (error) {
    console.error('[DB] Error writing database:', error);
    throw new Error('Failed to save to database');
  }
}

export const dbOperations = {
  /**
   * Insert a new contract deployment
   */
  insertContract: (contract: Omit<ContractRecord, 'id'>): ContractRecord => {
    const db = readDatabase();
    
    // Check if contract already exists
    const existing = db.contracts.find((c) => c.contractId === contract.contractId);
    if (existing) {
      // Update existing contract
      const updated: ContractRecord = {
        ...existing,
        ...contract,
      };
      const index = db.contracts.findIndex((c) => c.contractId === contract.contractId);
      db.contracts[index] = updated;
      writeDatabase(db);
      return updated;
    }

    // Create new contract record
    db.lastId += 1;
    const newContract: ContractRecord = {
      id: db.lastId,
      ...contract,
    };

    db.contracts.push(newContract);
    writeDatabase(db);

    console.log(`[DB] Contract saved: ${newContract.contractId} (ID: ${newContract.id})`);
    return newContract;
  },

  /**
   * Get all contracts
   */
  getAllContracts: (): ContractRecord[] => {
    const db = readDatabase();
    return db.contracts.sort((a, b) => {
      return new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime();
    });
  },

  /**
   * Get contract by ID
   */
  getContractById: (contractId: string): ContractRecord => {
    const db = readDatabase();
    const contract = db.contracts.find((c) => c.contractId === contractId);

    if (!contract) {
      throw new Error(`Contract with ID ${contractId} not found`);
    }

    return contract;
  },

  /**
   * Get contracts by network
   */
  getContractsByNetwork: (network: string): ContractRecord[] => {
    const db = readDatabase();
    return db.contracts
      .filter((c) => c.network === network)
      .sort((a, b) => {
        return new Date(b.deployedAt).getTime() - new Date(a.deployedAt).getTime();
      });
  },

  /**
   * Delete contract by ID
   */
  deleteContract: (contractId: string): boolean => {
    const db = readDatabase();
    const initialLength = db.contracts.length;
    db.contracts = db.contracts.filter((c) => c.contractId !== contractId);
    
    if (db.contracts.length < initialLength) {
      writeDatabase(db);
      return true;
    }
    
    return false;
  },

  /**
   * Get contract count
   */
  getContractCount: (): number => {
    const db = readDatabase();
    return db.contracts.length;
  },

  /**
   * Clear all contracts (use with caution)
   */
  clearAll: (): void => {
    const db: Database = {
      contracts: [],
      lastId: 0,
    };
    writeDatabase(db);
    console.log('[DB] All contracts cleared');
  },
};

// Initialize database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
  const initialDb: Database = {
    contracts: [],
    lastId: 0,
  };
  writeDatabase(initialDb);
  console.log('[DB] Initialized new database file');
}

export default dbOperations;
