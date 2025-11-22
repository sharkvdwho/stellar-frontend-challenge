#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol};

const DEPOSITOR: Symbol = symbol_short!("DEPOSITOR");
const BENEFICIARY: Symbol = symbol_short!("BENEFICIARY");
const BALANCE: Symbol = symbol_short!("BALANCE");

#[contract]
pub struct Escrow;

#[contractimpl]
impl Escrow {
    /// Initialize an escrow agreement
    pub fn init(env: Env, depositor: Address, beneficiary: Address) {
        env.storage().persistent().set(&DEPOSITOR, &depositor);
        env.storage().persistent().set(&BENEFICIARY, &beneficiary);
        env.storage().persistent().set(&BALANCE, &0i128);
    }

    /// Deposit funds into escrow
    pub fn deposit(env: Env, from: Address, amount: i128) {
        from.require_auth();
        let depositor: Address = env.storage().persistent().get(&DEPOSITOR).unwrap();
        if from != depositor {
            panic!("not depositor");
        }
        
        let mut balance: i128 = env.storage().persistent().get(&BALANCE).unwrap_or(0i128);
        balance += amount;
        env.storage().persistent().set(&BALANCE, &balance);
        
        env.events().publish((symbol_short!("deposit"), from.clone()), amount);
    }

    /// Release funds to the beneficiary
    pub fn release(env: Env, from: Address) {
        from.require_auth();
        let depositor: Address = env.storage().persistent().get(&DEPOSITOR).unwrap();
        if from != depositor {
            panic!("not depositor");
        }
        
        let balance: i128 = env.storage().persistent().get(&BALANCE).unwrap_or(0i128);
        let beneficiary: Address = env.storage().persistent().get(&BENEFICIARY).unwrap();
        
        env.storage().persistent().set(&BALANCE, &0i128);
        env.events().publish((symbol_short!("release"), beneficiary.clone()), balance);
    }

    /// Refund funds to the depositor
    pub fn refund(env: Env, from: Address) {
        from.require_auth();
        let beneficiary: Address = env.storage().persistent().get(&BENEFICIARY).unwrap();
        if from != beneficiary {
            panic!("not beneficiary");
        }
        
        let balance: i128 = env.storage().persistent().get(&BALANCE).unwrap_or(0i128);
        let depositor: Address = env.storage().persistent().get(&DEPOSITOR).unwrap();
        
        env.storage().persistent().set(&BALANCE, &0i128);
        env.events().publish((symbol_short!("refund"), depositor.clone()), balance);
    }

    /// Get the current escrow balance
    pub fn get_balance(env: Env) -> i128 {
        env.storage().persistent().get(&BALANCE).unwrap_or(0i128)
    }
}

