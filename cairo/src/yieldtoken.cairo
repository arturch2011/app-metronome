use starknet::ContractAddress;

#[derive(Drop, Serde, Copy)]
struct BurnList {
    recipient: ContractAddress,
    amount: u256,
}

#[starknet::interface]
pub trait IYieldToken<TContractState> {
    fn name(self: @TContractState) -> felt252;
    fn symbol(self: @TContractState) -> felt252;
    fn decimals(self: @TContractState) -> u8;
    fn total_supply(self: @TContractState) -> u256;
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn allowance(self: @TContractState, owner: ContractAddress, spender: ContractAddress) -> u256;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
    fn approve(ref self: TContractState, spender: ContractAddress, amount: u256) -> bool;
    fn mint(ref self: TContractState, receiver: starknet::ContractAddress, amount: u256);
    fn burn(ref self: TContractState, recipient: ContractAddress, amount: u256);
    fn set_expiry(ref self: TContractState, expiry: u32);
    fn get_expiry(ref self: TContractState) -> u32;
    fn is_expired(ref self: TContractState) -> bool;
    fn burn_all(ref self: TContractState, accounts_list: Array<BurnList>);
}

#[starknet::contract]
pub mod YieldToken {
    use openzeppelin::access::ownable::ownable::OwnableComponent::InternalTrait;
    use openzeppelin::token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use openzeppelin::access::ownable::OwnableComponent;

    use starknet::ContractAddress;
    use starknet::{get_block_timestamp};

    use super::BurnList;


    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // ERC20 Mixin
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    // It's intentional to make expiry an uint32 to guard against fat fingers. uint32.max is year 2106
    #[storage]
    struct Storage {
        expiry: u64,
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    pub enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name = "YieldToken";
        let symbol = "YT";
        // let expiry: u64 = 1751545695;
        // Set the initial owner of the contract
        self.ownable.initializer(owner);
        self.erc20.initializer(name, symbol);
    // self.expiry.write(expiry);
    }

    #[external(v0)]
    fn mint(ref self: ContractState, recipient: ContractAddress, amount: u256) {
        // Set permissions with Ownable
        // self.ownable.assert_only_owner();
        // ANYONE can mint tokens
        self.erc20._mint(recipient, amount);
    }

    #[external(v0)]
    fn burn(ref self: ContractState, recipient: ContractAddress, amount: u256) {
        // Set permissions with Ownable
        // self.ownable.assert_only_owner();
        // ANYONE can burn tokens

        self.erc20._burn(recipient, amount);
    }

    #[external(v0)]
    fn get_expiry(ref self: ContractState) -> u64 {
        self.expiry.read()
    }

    #[external(v0)]
    fn set_expiry(ref self: ContractState, expiry: u64) {
        // Set permissions with Ownable
        // self.ownable.assert_only_owner();
        // ANYONE can burn tokens
        self.expiry.write(expiry);
    }

    #[external(v0)]
    fn is_expired(ref self: ContractState) -> bool {
        let block_timestamp = get_block_timestamp();

        let expiration_date = self.expiry.read();

        if expiration_date > block_timestamp {
            false
        } else {
            true
        }
    }

    #[external(v0)]
    fn burn_all(ref self: ContractState, accounts_list: Array<BurnList>) {
        let mut total_amount: u256 = 0;

        let accounts_list = @accounts_list;
        let mut index = 0;
        loop {
            if index == accounts_list.len() {
                break ();
            }
            total_amount += *accounts_list.at(index).amount;
            index += 1;
        };

        let mut index = 0;
        loop {
            if index == accounts_list.len() {
                break ();
            }
            self.erc20._burn(*accounts_list.at(index).recipient, *accounts_list.at(index).amount);
            index += 1;
        };
    }
}
