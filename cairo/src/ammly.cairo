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
    fn balance_of(ref self: TContractState, account: starknet::ContractAddress) -> u256;
    fn current_rate(ref self: TContractState) -> u256;
}

#[starknet::contract]
mod Ammy {
    use super::IMintableDispatcher;
    use super::IMintableDispatcherTrait;

    use starknet::contract_address_const;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use pragma_lib::abi::{IPragmaABIDispatcher, IPragmaABIDispatcherTrait};
    use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};

    #[storage]
    struct Storage {
        underlying: ContractAddress,
        yieldTk: ContractAddress,
        reserve0: u256,
        reserve1: u256,
        totalSupply: u256,
        balanceOf: LegacyMap<ContractAddress, u256>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, underTk: ContractAddress, ytTk: ContractAddress,) {
        self.underlying.write(underTk);
        self.yieldTk.write(ytTk);
    }

    #[generate_trait]
    pub impl InternalImpl of InternalTrait {
        fn _mint(ref self: ContractState, to: ContractAddress, amount: u256) {
            self.balanceOf.write(to, self.balanceOf.read(to) + amount);
            self.totalSupply.write(self.totalSupply.read() + amount);
        }

        fn _burn(ref self: ContractState, from: ContractAddress, amount: u256) {
            self.balanceOf.write(from, self.balanceOf.read(from) - amount);
            self.totalSupply.write(self.totalSupply.read() - amount);
        }

        fn _min(self: @ContractState, x: u256, y: u256) -> u256 {
            if x <= y {
                x
            } else {
                y
            }
        }

        fn _update(ref self: ContractState, reserve0: u256, reserve1: u256) -> () {
            self.reserve0.write(reserve0);
            self.reserve1.write(reserve1);
        }

        fn _sqrt(ref self: ContractState, y: u256) -> u256 {
            let mut z: u256 = y;

            if (y > 3) {
                let mut x: u256 = y / 2 + 1;
                while (x < z) {
                    z = x;
                    x = (y / x + x) / 2;
                }
            } else if (y != 0) {
                z = 1;
            }
            z
        }
    }


    #[external(v0)]
    fn swap(ref self: ContractState, tokenIn: ContractAddress, amountIn: u256) -> u256 {
        assert(
            tokenIn == self.underlying.read() || tokenIn == self.yieldTk.read(),
            'Invalid token address'
        );
        assert(amountIn > 0, 'Invalid amount');

        // Pull in token in
        let incTk = IMintableDispatcher { contract_address: tokenIn };
        incTk.transfer_from(get_caller_address(), get_contract_address(), amountIn);

        if tokenIn == self.underlying.read() { // Transfer yieldTk to caller    
            let reserveOut = self.reserve1.read();
            let reserveIn = self.reserve0.read();

            // Calculate token out (inlcuding fees) fee 0.3%
            let amountInWithFee = (amountIn * 997) / 1000;
            let yield = incTk.current_rate();

            // let amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
            // let mut amountOut = amountInWithFee * (1000 + yield * 10) / 1000;
            let mut amountOut = amountInWithFee / (yield * 10 / 1000);
            if reserveOut < amountOut {
                amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
            }

            // Transfer token out to msg.sender
            let outTk = IMintableDispatcher { contract_address: self.yieldTk.read() };
            outTk.transfer(get_caller_address(), amountOut);

            // Update the reserves
            self
                ._update(
                    incTk.balance_of(get_contract_address()),
                    outTk.balance_of(get_contract_address()),
                );
            // Return amountOut
            amountOut
        } else { // Transfer token2 to caller
            let reserveOut = self.reserve0.read();
            let reserveIn = self.reserve1.read();

            let outTk = IMintableDispatcher { contract_address: self.underlying.read() };
            let yield = outTk.current_rate();

            // Calculate token out (inlcuding fees) fee 0.3%
            let amountInWithFee = (amountIn * 997) / 1000;
            let mut amountOut = amountInWithFee * (yield * 10 / 1000);
            // let mut amountOut = amountInWithFee * (1000 - yield * 10) / 1000;
            // let amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
            if reserveOut < amountOut {
                amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
            }
            // Transfer token out to msg.sender

            outTk.transfer(get_caller_address(), amountOut);

            // Update the reserves
            self
                ._update(
                    outTk.balance_of(get_contract_address()),
                    incTk.balance_of(get_contract_address()),
                );
            // Return amountOut
            amountOut
        }
    }

    #[external(v0)]
    fn add_liquidity(ref self: ContractState, amount0: u256, amount1: u256) -> u256 {
        let underlying = IMintableDispatcher { contract_address: self.underlying.read() };
        let yieldTk = IMintableDispatcher { contract_address: self.yieldTk.read() };
        let mut shares: u256 = 0;

        // let yield = underlying.current_rate();

        // if (self.reserve0.read() > 0 || self.reserve1.read() > 0) {
        //     assert(
        //         (self.reserve0.read()
        //             * amount1) == (self.reserve1.read() * (amount0 / ((yield * 10) / 1000))),
        //         'dy / dx != y / x'
        //     );
        // }

        // pull in underlying and yieldTk
        underlying.transfer_from(get_caller_address(), get_contract_address(), amount0);
        yieldTk.transfer_from(get_caller_address(), get_contract_address(), amount1);

        // mint shares
        // f(x, y) = value of liquidity = sqrt(xy)
        // s = dx / x * T = dy / y * T
        if (self.totalSupply.read() == 0) {
            let val: u256 = amount0 * amount1;
            let shar: u256 = self._sqrt(val);
            shares = shar;
        } else {
            shares = self
                ._min(
                    (amount0 * self.totalSupply.read()) / self.reserve0.read(),
                    (amount1 * self.totalSupply.read()) / self.reserve1.read(),
                );
        }
        assert(shares > 0, 'sheres = 0');
        self._mint(get_caller_address(), shares);

        // update reserves
        let underlying = IMintableDispatcher { contract_address: self.underlying.read() };
        let yieldTk = IMintableDispatcher { contract_address: self.yieldTk.read() };
        self
            ._update(
                underlying.balance_of(get_contract_address()),
                yieldTk.balance_of(get_contract_address())
            );
        return shares;
    }
    #[external(v0)]
    fn remove_liquidity(ref self: ContractState, shares: u256) -> (u256, u256) {
        // calculate amount0 and amount1 to withdraw
        // dx = s / T * x
        // dy = s / T * y
        assert(self.balanceOf.read(get_caller_address()) >= shares, 'Insufficient balance');

        let underlying = IMintableDispatcher { contract_address: self.underlying.read() };
        let yieldTk = IMintableDispatcher { contract_address: self.yieldTk.read() };

        let bal0 = underlying.balance_of(get_contract_address());
        let bal1 = yieldTk.balance_of(get_contract_address());

        // let yield = underlying.current_rate();
        //(amount1 * (1000 + yield * 10) / 1000)
        let amount0 = (shares * bal0) / self.totalSupply.read();
        let amount1 = (shares * bal1) / self.totalSupply.read();
        assert(amount0 > 0 && amount1 > 0, 'amount0 or amount1 = 0');

        // burn shares
        self._burn(get_caller_address(), shares);

        // update reserves
        self._update(bal0 - amount0, bal1 - amount1);

        // transfer tokens to msg.sender
        underlying.transfer(get_caller_address(), amount0);
        yieldTk.transfer(get_caller_address(), amount1);

        return (amount0, amount1);
    }
}
