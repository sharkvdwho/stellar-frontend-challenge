#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol, Map};

const BALANCES: Symbol = symbol_short!("BALANCES");
const TOTAL_SUPPLY: Symbol = symbol_short!("TOTAL_SUPPLY");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[contract]
pub struct Token;

#[contractimpl]
impl Token {
    /// Initialize the token
    pub fn init(env: Env, admin: Address, total_supply: i128) {
        env.storage().persistent().set(&ADMIN, &admin);
        env.storage().persistent().set(&TOTAL_SUPPLY, &total_supply);
        let mut balances: Map<Address, i128> = Map::new(&env);
        balances.set(admin.clone(), total_supply);
        env.storage().persistent().set(&BALANCES, &balances);
    }

    /// Mint new tokens to an address
    pub fn mint(env: Env, to: Address, amount: i128) {
        let admin: Address = env.storage().persistent().get(&ADMIN).unwrap();
        admin.require_auth();
        
        let mut balances: Map<Address, i128> = env.storage().persistent().get(&BALANCES).unwrap();
        let balance = balances.get(to.clone()).unwrap_or(0i128);
        balances.set(to.clone(), balance + amount);
        env.storage().persistent().set(&BALANCES, &balances);
        
        let mut total_supply: i128 = env.storage().persistent().get(&TOTAL_SUPPLY).unwrap();
        total_supply += amount;
        env.storage().persistent().set(&TOTAL_SUPPLY, &total_supply);
        
        env.events().publish((symbol_short!("mint"), to.clone()), amount);
    }

    /// Burn tokens from an address
    pub fn burn(env: Env, from: Address, amount: i128) {
        from.require_auth();
        
        let mut balances: Map<Address, i128> = env.storage().persistent().get(&BALANCES).unwrap();
        let balance = balances.get(from.clone()).unwrap_or(0i128);
        if balance < amount {
            panic!("insufficient balance");
        }
        balances.set(from.clone(), balance - amount);
        env.storage().persistent().set(&BALANCES, &balances);
        
        let mut total_supply: i128 = env.storage().persistent().get(&TOTAL_SUPPLY).unwrap();
        total_supply -= amount;
        env.storage().persistent().set(&TOTAL_SUPPLY, &total_supply);
        
        env.events().publish((symbol_short!("burn"), from.clone()), amount);
    }

    /// Transfer tokens between addresses
    pub fn transfer(env: Env, from: Address, to: Address, amount: i128) -> bool {
        from.require_auth();
        
        let mut balances: Map<Address, i128> = env.storage().persistent().get(&BALANCES).unwrap();
        let from_balance = balances.get(from.clone()).unwrap_or(0i128);
        if from_balance < amount {
            return false;
        }
        let to_balance = balances.get(to.clone()).unwrap_or(0i128);
        
        balances.set(from.clone(), from_balance - amount);
        balances.set(to.clone(), to_balance + amount);
        env.storage().persistent().set(&BALANCES, &balances);
        
        env.events().publish((symbol_short!("transfer"), from.clone(), to.clone()), amount);
        true
    }

    /// Get token balance for an address
    pub fn balance(env: Env, address: Address) -> i128 {
        let balances: Map<Address, i128> = env.storage().persistent().get(&BALANCES).unwrap_or(Map::new(&env));
        balances.get(address).unwrap_or(0i128)
    }
}

