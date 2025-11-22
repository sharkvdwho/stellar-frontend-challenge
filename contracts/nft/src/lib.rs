#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol, Map, String};

const OWNERS: Symbol = symbol_short!("OWNERS");
const TOKEN_URIS: Symbol = symbol_short!("URIS");
const NEXT_TOKEN_ID: Symbol = symbol_short!("NEXT_ID");

#[contract]
pub struct NFT;

#[contractimpl]
impl NFT {
    /// Initialize the NFT contract
    pub fn init(env: Env) {
        env.storage().persistent().set(&NEXT_TOKEN_ID, &0u32);
    }

    /// Mint a new NFT to an address
    pub fn mint(env: Env, to: Address, token_uri: String) -> u32 {
        let mut next_id: u32 = env.storage().persistent().get(&NEXT_TOKEN_ID).unwrap_or(0u32);
        let token_id = next_id;
        next_id += 1;
        env.storage().persistent().set(&NEXT_TOKEN_ID, &next_id);
        
        let mut owners: Map<u32, Address> = env.storage().persistent().get(&OWNERS).unwrap_or(Map::new(&env));
        owners.set(token_id, to.clone());
        env.storage().persistent().set(&OWNERS, &owners);
        
        let mut uris: Map<u32, String> = env.storage().persistent().get(&TOKEN_URIS).unwrap_or(Map::new(&env));
        uris.set(token_id, token_uri);
        env.storage().persistent().set(&TOKEN_URIS, &uris);
        
        env.events().publish((symbol_short!("mint"), to.clone()), token_id);
        token_id
    }

    /// Transfer NFT ownership
    pub fn transfer(env: Env, from: Address, to: Address, token_id: u32) {
        from.require_auth();
        
        let mut owners: Map<u32, Address> = env.storage().persistent().get(&OWNERS).unwrap();
        let owner = owners.get(token_id).unwrap();
        if owner != from {
            panic!("not owner");
        }
        owners.set(token_id, to.clone());
        env.storage().persistent().set(&OWNERS, &owners);
        
        env.events().publish((symbol_short!("transfer"), from.clone(), to.clone()), token_id);
    }

    /// Get the owner of a specific token ID
    pub fn owner_of(env: Env, token_id: u32) -> Address {
        let owners: Map<u32, Address> = env.storage().persistent().get(&OWNERS).unwrap();
        owners.get(token_id).unwrap()
    }

    /// Get the metadata URI for a token
    pub fn token_uri(env: Env, token_id: u32) -> String {
        let uris: Map<u32, String> = env.storage().persistent().get(&TOKEN_URIS).unwrap_or(Map::new(&env));
        uris.get(token_id).unwrap_or(String::new(&env))
    }
}

