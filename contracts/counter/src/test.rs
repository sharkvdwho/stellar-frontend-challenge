#![cfg(test)]

use super::*;
use soroban_sdk::{symbol_short, Env};

#[test]
fn test_init() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Counter);
    let client = CounterClient::new(&env, &contract_id);

    client.init();
    assert_eq!(client.get_count(), 0);
}

#[test]
fn test_increment() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Counter);
    let client = CounterClient::new(&env, &contract_id);

    client.init();
    assert_eq!(client.get_count(), 0);

    let result = client.increment();
    assert_eq!(result, 1);
    assert_eq!(client.get_count(), 1);

    let result = client.increment();
    assert_eq!(result, 2);
    assert_eq!(client.get_count(), 2);
}

#[test]
fn test_decrement() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Counter);
    let client = CounterClient::new(&env, &contract_id);

    client.init();
    assert_eq!(client.get_count(), 0);

    let result = client.increment();
    assert_eq!(result, 1);

    let result = client.decrement();
    assert_eq!(result, 0);
    assert_eq!(client.get_count(), 0);

    let result = client.decrement();
    assert_eq!(result, -1);
    assert_eq!(client.get_count(), -1);
}

#[test]
fn test_increment_decrement_sequence() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Counter);
    let client = CounterClient::new(&env, &contract_id);

    client.init();
    assert_eq!(client.get_count(), 0);

    client.increment();
    client.increment();
    client.increment();
    assert_eq!(client.get_count(), 3);

    client.decrement();
    assert_eq!(client.get_count(), 2);

    client.decrement();
    client.decrement();
    assert_eq!(client.get_count(), 0);
}

#[test]
fn test_events() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Counter);
    let client = CounterClient::new(&env, &contract_id);

    client.init();
    client.increment();
    client.decrement();

    // Check that events were emitted
    let events = env.events().all();
    assert_eq!(events.len(), 2);

    // Verify increment event
    let increment_event = &events[0];
    assert_eq!(increment_event.0, (symbol_short!("increment"),));
    assert_eq!(increment_event.1, 1i32);

    // Verify decrement event
    let decrement_event = &events[1];
    assert_eq!(decrement_event.0, (symbol_short!("decrement"),));
    assert_eq!(decrement_event.1, 0i32);
}

