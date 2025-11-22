#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, Address, Env, Symbol, Map, String, Vec};

const PROPOSALS: Symbol = symbol_short!("PROPOSALS");
const VOTES: Symbol = symbol_short!("VOTES");
const NEXT_PROPOSAL_ID: Symbol = symbol_short!("NEXT_ID");

#[derive(Clone)]
#[contracttype]
pub struct Proposal {
    pub description: String,
    pub yes_votes: i128,
    pub no_votes: i128,
}

#[contract]
pub struct Voting;

#[contractimpl]
impl Voting {
    /// Initialize the voting contract
    pub fn init(env: Env) {
        env.storage().persistent().set(&NEXT_PROPOSAL_ID, &0u32);
    }

    /// Create a new voting proposal
    pub fn create_proposal(env: Env, description: String) -> u32 {
        let mut next_id: u32 = env.storage().persistent().get(&NEXT_PROPOSAL_ID).unwrap_or(0u32);
        let proposal_id = next_id;
        next_id += 1;
        env.storage().persistent().set(&NEXT_PROPOSAL_ID, &next_id);
        
        let proposal = Proposal {
            description: description.clone(),
            yes_votes: 0i128,
            no_votes: 0i128,
        };
        
        let mut proposals: Map<u32, Proposal> = env.storage().persistent().get(&PROPOSALS).unwrap_or(Map::new(&env));
        proposals.set(proposal_id, proposal);
        env.storage().persistent().set(&PROPOSALS, &proposals);
        
        env.events().publish((symbol_short!("proposal_created"), proposal_id), description);
        proposal_id
    }

    /// Cast a vote on a proposal
    pub fn vote(env: Env, voter: Address, proposal_id: u32, support: bool) {
        voter.require_auth();
        
        let mut votes: Map<(u32, Address), bool> = env.storage().persistent().get(&VOTES).unwrap_or(Map::new(&env));
        if votes.get((proposal_id, voter.clone())).is_some() {
            panic!("already voted");
        }
        votes.set((proposal_id, voter.clone()), support);
        env.storage().persistent().set(&VOTES, &votes);
        
        let mut proposals: Map<u32, Proposal> = env.storage().persistent().get(&PROPOSALS).unwrap();
        let mut proposal = proposals.get(proposal_id).unwrap();
        if support {
            proposal.yes_votes += 1;
        } else {
            proposal.no_votes += 1;
        }
        proposals.set(proposal_id, proposal);
        env.storage().persistent().set(&PROPOSALS, &proposals);
        
        env.events().publish((symbol_short!("vote_cast"), proposal_id, voter.clone()), support);
    }

    /// Get vote count for a proposal
    pub fn get_votes(env: Env, proposal_id: u32) -> i128 {
        let proposals: Map<u32, Proposal> = env.storage().persistent().get(&PROPOSALS).unwrap_or(Map::new(&env));
        let proposal = proposals.get(proposal_id).unwrap();
        proposal.yes_votes + proposal.no_votes
    }

    /// Get the result of a proposal
    pub fn get_result(env: Env, proposal_id: u32) -> bool {
        let proposals: Map<u32, Proposal> = env.storage().persistent().get(&PROPOSALS).unwrap_or(Map::new(&env));
        let proposal = proposals.get(proposal_id).unwrap();
        proposal.yes_votes > proposal.no_votes
    }
}

