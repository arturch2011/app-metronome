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
use openzeppelin::token::erc20::{ERC20ABIDispatcher, ERC20ABIDispatcherTrait};

use array::{ArrayTrait, SpanTrait, ArrayTCloneImpl};
use result::ResultTrait;
use serde::Serde;
use debug::PrintTrait;

use box::BoxTrait;
use integer::u256;
use integer::BoundedU256;

use cairo::yieldtoken::YieldToken;

use cairo::yieldtoken::YieldToken::{Event::ERC20Event, Event::OwnableEvent};
use openzeppelin::token::erc20::ERC20Component;

use cairo::yieldtoken::{IYieldTokenDispatcher, IYieldTokenDispatcherTrait};
use cairo::yieldtoken::BurnList;

// fn INITIAL_SUPPLY() -> u256 {
//     0
// }
// fn MINTED_SUPPLY() -> u256 {
//     1000000000000000000000000000000
// }

const MINTED_SUPPLY: u256 = 1000000000;

fn setup() -> ContractAddress {
    let erc20_class_hash = declare("YieldToken").unwrap();

    let account: ContractAddress = contract_address_const::<1>();

    let mut calldata = ArrayTrait::new();
    account.serialize(ref calldata);

    let (contract_address, _) = erc20_class_hash.deploy(@calldata).unwrap();

    contract_address
}

#[test]
fn test_mint_increase_balance() {
    // Deploy the contract
    let contract_address = setup();

    // Create a dispatcher to interact with the deployed contract
    let erc20 = IYieldTokenDispatcher { contract_address };

    // Set any address to mint tokens to
    let account: ContractAddress = contract_address_const::<
        0x12325ba8fb37c73cab1853c5808b9ee69193147413d21594a61581da64ff29d
    >();

    // Mint some tokens (replace 42 with the desired amount)
    erc20.mint(account, 42);

    // // Check the recipient's balance after minting
    let balance_after = erc20.balance_of(account);
    assert(balance_after == 42, 'Invalid balance');
}


#[test]
fn test_burn_token() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let account: ContractAddress = contract_address_const::<1>();

    erc20.mint(account, MINTED_SUPPLY);

    let balance_before = erc20.balance_of(account);
    assert(balance_before == MINTED_SUPPLY, 'Invalid balance');

    let burn_value: u256 = 100;
    erc20.burn(account, burn_value);

    let balance_after = erc20.balance_of(account);
    assert(balance_after == MINTED_SUPPLY - burn_value, 'Invalid balance');
}

#[test]
fn test_set_expiry() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let expiry: u32 = 1751545700;
    erc20.set_expiry(expiry);

    let expiration_date = erc20.get_expiry();
    assert(expiration_date == expiry, 'Expiration date not updated.')
}

#[test]
fn test_get_expiry() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let initial_expiry: u32 = 1751545695;
    erc20.set_expiry(initial_expiry);

    let expiration_date = erc20.get_expiry();

    assert(expiration_date == initial_expiry, 'Not initial expiration date')
}

// #[test]
fn test_is_expired() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let expiry: u32 = 1000000000;
    erc20.set_expiry(expiry);
    let is_expired = erc20.is_expired();
    

    assert(is_expired == false, 'Should be expired.') // BlockTimestamp is 0
}

#[test]
fn test_get_balance() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let account: ContractAddress = contract_address_const::<1>();
    erc20.mint(account, MINTED_SUPPLY);

    assert(erc20.balance_of(account) == MINTED_SUPPLY, 'Balance is not minted supply');
}

#[test]
fn test_transfer() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let origin_account: ContractAddress = contract_address_const::<1>();
    let target_account: ContractAddress = contract_address_const::<2>();

    let balance_before = erc20.balance_of(target_account);
    assert(balance_before == 0, 'Invalid balance');

    start_prank(CheatTarget::One(contract_address), 1.try_into().unwrap());
    erc20.mint(origin_account, MINTED_SUPPLY);

    let transfer_value: u256 = 100;
    erc20.transfer(target_account, transfer_value);

    let balance_after = erc20.balance_of(target_account);
    assert(balance_after == transfer_value, 'No value transfered');
}

#[test]
fn test_transfer_event() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let target_account: ContractAddress = contract_address_const::<2>();
    let token_sender: ContractAddress = contract_address_const::<1>();
    erc20.mint(token_sender, MINTED_SUPPLY);

    start_prank(CheatTarget::All, token_sender);

    let mut spy = spy_events(SpyOn::One(contract_address));

    let transfer_value: u256 = 100;
    erc20.transfer(target_account, transfer_value);

    spy
        .assert_emitted(
            @array![
                (
                    contract_address,
                    ERC20Component::Event::Transfer(
                        ERC20Component::Transfer {
                            from: token_sender, to: target_account, value: transfer_value
                        }
                    )
                )
            ]
        );
}

#[test]
#[should_panic(expected: ('ERC20: insufficient balance',))]
fn should_panic_transfer() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let target_account: ContractAddress = contract_address_const::<2>();
    let token_sender: ContractAddress = contract_address_const::<1>();

    let balance_before = erc20.balance_of(target_account);
    assert(balance_before == 0, 'Invalid balance');

    erc20.mint(token_sender, MINTED_SUPPLY);

    start_prank(CheatTarget::One(contract_address), 1.try_into().unwrap());

    let transfer_value: u256 = 1000000001;

    erc20.transfer(target_account, transfer_value);
}

#[test]
fn test_burn_all() {
    let contract_address = setup();
    let erc20 = IYieldTokenDispatcher { contract_address };

    let minted_1: u256 = 42;
    let minted_2: u256 = 50;
    let minted_3: u256 = 60;
    let minted_4: u256 = 70;

    let account_1: ContractAddress = contract_address_const::<1>();
    let account_2: ContractAddress = contract_address_const::<2>();
    let account_3: ContractAddress = contract_address_const::<3>();
    let account_4: ContractAddress = contract_address_const::<4>();
    erc20.mint(account_1, minted_1);
    erc20.mint(account_2, minted_2);
    erc20.mint(account_3, minted_3);
    erc20.mint(account_4, minted_4);

    let request1 = BurnList { recipient: account_1, amount: minted_1 };
    let request2 = BurnList { recipient: account_2, amount: minted_2 };
    let request3 = BurnList { recipient: account_3, amount: minted_3 };
    let request4 = BurnList { recipient: account_4, amount: minted_4 };

    let mut burn_list = ArrayTrait::<BurnList>::new();
    burn_list.append(request1);
    burn_list.append(request2);
    burn_list.append(request3);
    burn_list.append(request4);

    erc20.burn_all(burn_list);

    let balance_after = erc20.balance_of(account_1);
    assert(balance_after == 0, 'Balance should be 0');
    let balance_after = erc20.balance_of(account_2);
    assert(balance_after == 0, 'Balance should be 0');
    let balance_after = erc20.balance_of(account_3);
    assert(balance_after == 0, 'Balance should be 0');
    let balance_after = erc20.balance_of(account_4);
    assert(balance_after == 0, 'Balance should be 0');
}

