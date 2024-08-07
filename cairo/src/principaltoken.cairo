#[starknet::contract]
mod PrincipalToken {
    use openzeppelin::access::ownable::ownable::OwnableComponent::InternalTrait;
    use openzeppelin::token::erc20::{ERC20Component, ERC20HooksEmptyImpl};
    use openzeppelin::access::ownable::OwnableComponent;

    use starknet::ContractAddress;
    use starknet::{get_block_timestamp};

    component!(path: ERC20Component, storage: erc20, event: ERC20Event);
    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    // ERC20 Mixin
    #[abi(embed_v0)]
    impl ERC20MixinImpl = ERC20Component::ERC20MixinImpl<ContractState>;
    impl ERC20InternalImpl = ERC20Component::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        expiry: u64,
        #[substorage(v0)]
        erc20: ERC20Component::Storage,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        ERC20Event: ERC20Component::Event,
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        let name = "PrincipalToken";
        let symbol = "PT";
        // Set the initial owner of the contract
        self.ownable.initializer(owner);
        self.erc20.initializer(name, symbol);
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
}
