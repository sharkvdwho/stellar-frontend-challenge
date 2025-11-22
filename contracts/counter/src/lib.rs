#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Symbol};

const COUNTER: Symbol = symbol_short!("COUNTER");

#[contract]
pub struct Counter;

#[contractimpl]
impl Counter {
    /// Initialize the counter to 0
    pub fn init(env: Env) {
        env.storage().persistent().set(&COUNTER, &0i32);
    }

    /// Increment the counter by 1 and emit an event
    pub fn increment(env: Env) -> i32 {
        let mut count: i32 = env
            .storage()
            .persistent()
            .get(&COUNTER)
            .unwrap_or(0i32);
        count += 1;
        env.storage().persistent().set(&COUNTER, &count);
        env.events().publish((symbol_short!("increment"),), count);
        count
    }

    /// Decrement the counter by 1 and emit an event
    pub fn decrement(env: Env) -> i32 {
        let mut count: i32 = env
            .storage()
            .persistent()
            .get(&COUNTER)
            .unwrap_or(0i32);
        count -= 1;
        env.storage().persistent().set(&COUNTER, &count);
        env.events().publish((symbol_short!("decrement"),), count);
        count
    }

    /// Get the current counter value
    pub fn get_count(env: Env) -> i32 {
        env.storage()
            .persistent()
            .get(&COUNTER)
            .unwrap_or(0i32)
    }
}

#[cfg(test)]
mod test;

