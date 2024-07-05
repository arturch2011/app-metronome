use starknet::ContractAddress;

#[starknet::interface]
trait IMintable<TContractState> {
    fn mint(ref self: TContractState, receiver: starknet::ContractAddress, amount: u256);
    fn transfer(ref self: TContractState, receiver: starknet::ContractAddress, amount: u256);
    fn approve(ref self: TContractState, spender: starknet::ContractAddress, amount: u256);
    fn transfer_from(
        ref self: TContractState,
        sender: starknet::ContractAddress,
        receiver: starknet::ContractAddress,
        amount: u256,
    );
    fn burn_all(ref self: TContractState, accounts_list: Array<BurnList>);
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn stake(ref self: TContractState, amount: u256);
}

#[derive(Drop, Serde, Copy)]
struct BurnList {
    recipient: ContractAddress,
    amount: u256,
}

#[starknet::contract]
mod Altruist {
    // importing IMintableDispacher and the trait into the module scope
    use core::result::ResultTrait;
    use super::IMintableDispatcher;
    use super::IMintableDispatcherTrait;
    use starknet::contract_address_const;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use alexandria_storage::list::{List, ListTrait};
    use super::BurnList;


    #[storage]
    struct Storage {
        ytAddr: ContractAddress,
        ptAddr: ContractAddress,
        incTkAddr: ContractAddress,
        users: List<ContractAddress>,
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        inctkaddr: ContractAddress,
        ptaddr: ContractAddress,
        ytaddr: ContractAddress
    ) {
        self.ytAddr.write(ytaddr);
        self.ptAddr.write(ptaddr);
        self.incTkAddr.write(inctkaddr);
    }


    #[external(v0)]
    fn stake(ref self: ContractState, amount: u256) {
        // create dispatchers for the contracts
        let incTk = IMintableDispatcher { contract_address: self.incTkAddr.read() };
        let ptTk = IMintableDispatcher { contract_address: self.ptAddr.read() };
        let ytTk = IMintableDispatcher { contract_address: self.ytAddr.read() };

        // get the address of the caller
        let addr: ContractAddress = get_caller_address();

        // transfer the tokens from the caller to the contract
        incTk.transfer_from(addr, get_contract_address(), amount);
        ptTk.mint(addr, amount);
        ytTk.mint(addr, amount);

        // add the user to the list
        let mut usrList = self.users.read();
        usrList.append(addr).expect('failed to append');
    }

    #[external(v0)]
    fn burnAll(ref self: ContractState) {
        // create dispatchers for the contracts
        let ytTk = IMintableDispatcher { contract_address: self.ytAddr.read() };

        // burn all the tokens
        let mut usrlist = self.users.read();
        let l = usrlist.len();
        let mut burn_list = ArrayTrait::<BurnList>::new();

        let mut index = 0;
        loop {
            if index == l {
                break ();
            }
            let account_1 = usrlist[index];
            let amountT = ytTk.balance_of(account_1);
            let request1 = BurnList { recipient: account_1, amount: amountT };
            burn_list.append(request1);
            index += 1;
        };
        ytTk.burn_all(burn_list);
    }
}
