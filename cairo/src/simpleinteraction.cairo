#[starknet::interface]
trait IMintable<TContractState> {
    fn mint(ref self: TContractState, receiver: starknet::ContractAddress, amount: u128);
}

#[starknet::contract]
mod Altruist {
    // importing IMintableDispacher and the trait into the module scope
    use super::IMintableDispatcher;
    use super::IMintableDispatcherTrait;
    use starknet::contract_address_const;
    use starknet::ContractAddress;

    #[storage]
    struct Storage {
        contract_: ContractAddress,
    }

    #[external(v0)]
    fn mint(self: @ContractState, receiver: ContractAddress, amount: u128) {
        // address of the contract we want to call
        let token_addr: ContractAddress = contract_address_const::<
            0x2cfda23646b05f433e63c6a8c9665926a60378883f7857b1ef588538a724178
        >();

        // create a dispatcher using the token address
        let token = IMintableDispatcher { contract_address: token_addr };

        // call a function from the IMintable interface
        token.mint(receiver, amount);
    }
}
