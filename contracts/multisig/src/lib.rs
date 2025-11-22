#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol, Map, Vec};

const OWNERS: Symbol = symbol_short!("OWNERS");
const THRESHOLD: Symbol = symbol_short!("THRESHOLD");
const TRANSACTIONS: Symbol = symbol_short!("TXS");
const APPROVALS: Symbol = symbol_short!("APPROVALS");
const NEXT_TX_ID: Symbol = symbol_short!("NEXT_TX");

#[derive(Clone)]
#[contracttype]
pub struct Transaction {
    pub to: Address,
    pub value: i128,
    pub executed: bool,
}

#[contract]
pub struct Multisig;

#[contractimpl]
impl Multisig {
    /// Initialize multisig with owners and threshold
    pub fn init(env: Env, owners: Vec<Address>, threshold: u32) {
        env.storage().persistent().set(&OWNERS, &owners);
        env.storage().persistent().set(&THRESHOLD, &threshold);
        env.storage().persistent().set(&NEXT_TX_ID, &0u32);
    }

    /// Submit a new transaction for approval
    pub fn submit_transaction(env: Env, from: Address, to: Address, value: i128) -> u32 {
        from.require_auth();
        let owners: Vec<Address> = env.storage().persistent().get(&OWNERS).unwrap();
        if !owners.contains(from.clone()) {
            panic!("not owner");
        }
        
        let mut next_id: u32 = env.storage().persistent().get(&NEXT_TX_ID).unwrap_or(0u32);
        let tx_id = next_id;
        next_id += 1;
        env.storage().persistent().set(&NEXT_TX_ID, &next_id);
        
        let tx = Transaction {
            to: to.clone(),
            value,
            executed: false,
        };
        
        let mut transactions: Map<u32, Transaction> = env.storage().persistent().get(&TRANSACTIONS).unwrap_or(Map::new(&env));
        transactions.set(tx_id, tx);
        env.storage().persistent().set(&TRANSACTIONS, &transactions);
        
        env.events().publish((symbol_short!("transaction_submitted"), tx_id), (to.clone(), value));
        tx_id
    }

    /// Approve a pending transaction
    pub fn approve(env: Env, owner: Address, tx_id: u32) {
        owner.require_auth();
        let owners: Vec<Address> = env.storage().persistent().get(&OWNERS).unwrap();
        if !owners.contains(owner.clone()) {
            panic!("not owner");
        }
        
        let mut approvals: Map<(u32, Address), bool> = env.storage().persistent().get(&APPROVALS).unwrap_or(Map::new(&env));
        approvals.set((tx_id, owner.clone()), true);
        env.storage().persistent().set(&APPROVALS, &approvals);
        
        env.events().publish((symbol_short!("approval"), tx_id), owner.clone());
    }

    /// Execute an approved transaction
    pub fn execute(env: Env, tx_id: u32) {
        let transactions: Map<u32, Transaction> = env.storage().persistent().get(&TRANSACTIONS).unwrap();
        let tx = transactions.get(tx_id).unwrap();
        if tx.executed {
            panic!("already executed");
        }
        
        let threshold: u32 = env.storage().persistent().get(&THRESHOLD).unwrap();
        let approvals: Map<(u32, Address), bool> = env.storage().persistent().get(&APPROVALS).unwrap_or(Map::new(&env));
        let owners: Vec<Address> = env.storage().persistent().get(&OWNERS).unwrap();
        
        let mut approval_count = 0u32;
        for owner in owners.iter() {
            if approvals.get((tx_id, owner.clone())).unwrap_or(false) {
                approval_count += 1;
            }
        }
        
        if approval_count < threshold {
            panic!("insufficient approvals");
        }
        
        let mut tx = tx;
        tx.executed = true;
        let mut transactions = transactions;
        transactions.set(tx_id, tx);
        env.storage().persistent().set(&TRANSACTIONS, &transactions);
    }

    /// Get list of wallet owners
    pub fn get_owners(env: Env) -> Vec<Address> {
        env.storage().persistent().get(&OWNERS).unwrap_or(Vec::new(&env))
    }
}

