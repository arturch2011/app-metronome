#[starknet::interface]
trait IMintable<TContractState> {
    fn mint(ref self: TContractState, receiver: starknet::ContractAddress, amount: u256);
}

#[starknet::contract]
mod Altruist {
    // importing IMintableDispacher and the trait into the module scope
    use super::IMintableDispatcher;
    use super::IMintableDispatcherTrait;
    use starknet::contract_address_const;
    use starknet::ContractAddress;
    use starknet::get_caller_address;

    #[storage]
    struct Storage {
        contract: ContractAddress,
    }

    #[constructor]
    fn constructor(ref self: ContractState, contract: ContractAddress) {
        self.contract.write(contract);
    }

    #[external(v0)]
    fn mint(self: @ContractState, amount: u256) {
        // address of the contract we want to call
        let token_addr: ContractAddress = contract_address_const::<
            0x12325ba8fb37c73cab1853c5808b9ee69193147413d21594a61581da64ff29d
        >();

        // create a dispatcher using the token address
        let token = IMintableDispatcher { contract_address: token_addr };
        let addr: ContractAddress = get_caller_address();

        // call a function from the IMintable interface
        token.mint(addr, amount);
    }
}
