use starknet::{
    contract_address_const, get_block_info, ContractAddress, Felt252TryIntoContractAddress, TryInto,
    Into, OptionTrait, class_hash::Felt252TryIntoClassHash, get_caller_address,
    get_contract_address, storage_read_syscall
};


use snforge_std::{declare, start_prank, stop_prank, ContractClassTrait, CheatTarget};
use snforge_std::{
    spy_events, SpyOn, EventSpy, EventFetcher, Event, event_name_hash, EventAssertions
};

use openzeppelin::utils::serde::SerializedAppend;

use array::{ArrayTrait, SpanTrait, ArrayTCloneImpl};
use result::ResultTrait;
use serde::Serde;
use debug::PrintTrait;

use box::BoxTrait;
use integer::u256;
use integer::BoundedU256;

use cairo::simpleinteraction::Altruist;
use cairo::simpleinteraction::{IMintableDispatcher, IMintableDispatcherTrait};

use cairo::erc20::{IMockTokenDispatcher, IMockTokenDispatcherTrait};
use cairo::yieldtoken::{IYieldTokenDispatcher, IYieldTokenDispatcherTrait};
use cairo::principaltoken::{IPrincipalTokenDispatcher, IPrincipalTokenDispatcherTrait};



// DUMMY USER AND CONTRACT ADDRESSES

fn OWNER() -> ContractAddress {
    'owner'.try_into().unwrap()
}
fn MOCK_TOKEN_ADDRESS() -> ContractAddress {
    'mock_address'.try_into().unwrap()
}
fn YIELD_ADDRESS() -> ContractAddress {
    'yield_address'.try_into().unwrap()
}
fn PRINCIPAL_ADDRESS() -> ContractAddress {
    'principal_address'.try_into().unwrap()
}
fn SIMPLE_INTERACTION_ADDRESS() -> ContractAddress {
    'simple_address'.try_into().unwrap()
}

// DEPLOY CONTRACTS FUNCTIONS

fn deploy_mock() -> ContractAddress {
    let erc20_class_hash = declare("MyToken").unwrap();

    let account: ContractAddress = OWNER();

    let mut calldata = ArrayTrait::new();
    account.serialize(ref calldata);

    let (contract_address, _) = erc20_class_hash.deploy_at(@calldata, MOCK_TOKEN_ADDRESS()).unwrap();

    contract_address
}
fn deploy_principal() -> ContractAddress {
    let erc20_class_hash = declare("PrincipalToken").unwrap();

    let account: ContractAddress = OWNER();

    let mut calldata = ArrayTrait::new();
    account.serialize(ref calldata);

    let (contract_address, _) = erc20_class_hash.deploy_at(@calldata, PRINCIPAL_ADDRESS()).unwrap();

    contract_address
}
fn deploy_yield() -> ContractAddress {
    let erc20_class_hash = declare("YieldToken").unwrap();

    let account: ContractAddress = OWNER();

    let mut calldata = ArrayTrait::new();
    account.serialize(ref calldata);

    let (contract_address, _) = erc20_class_hash.deploy_at(@calldata, YIELD_ADDRESS()).unwrap();

    contract_address
}

fn setup() -> ContractAddress {
    let mock_token_address = deploy_mock();
    let principal_address = deploy_principal();
    let yield_address = deploy_yield();

    let simple_interaction_class_hash = declare("Altruist").unwrap();

    let mut calldata = ArrayTrait::new();
    mock_token_address.serialize(ref calldata);
    principal_address.serialize(ref calldata);
    yield_address.serialize(ref calldata);
    // let mut calldata = array![];
    // calldata.append_serde(mock_token_address);
    // calldata.append_serde(principal_address);
    // calldata.append_serde(yield_address);

    let (contract_address, _) = simple_interaction_class_hash.deploy(@calldata).unwrap();

    contract_address
}

// TESTS

#[test]
fn test_stake() {
    // Deploy Mock Contract  
    let mock_token_address = deploy_mock();

    // Create a dispatcher to interact with the deployed contract
    let mock_token = IMockTokenDispatcher { contract_address: mock_token_address };

    // Mint some of the mock token
    let minted_mock_token: u256 = 150;
    mock_token.mint(OWNER(), minted_mock_token);

    let balance_after = mock_token.balance_of(OWNER());
    assert(balance_after == 150, 'Invalid balance');

    // Deploy Simple Interaction Contract
    let simple_interaction_address = setup();

    // let simple_interaction = IMintableDispatcher { contract_address: simple_interaction_address };

    // Stake some tokens
    // start_prank(CheatTarget::One(SIMPLE_INTERACTION_ADDRESS()), OWNER());
    // let stake_amount: u256 = 100;
    // simple_interaction.stake(stake_amount);  
    // stop_prank(CheatTarget::One(SIMPLE_INTERACTION_ADDRESS()));

    // Check the recipient's balance after minting
    // let balance_after = mock_token.balance_of(OWNER());
    // let balance_felt: felt252 = balance_after.try_into().unwrap();
    // println!("balance_after: {}", balance_felt);
    // assert(balance_after == 0, 'Invalid balance');
}
