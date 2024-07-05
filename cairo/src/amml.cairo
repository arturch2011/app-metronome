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
mod Amm {
    use super::IMintableDispatcher;
    use super::IMintableDispatcherTrait;


    use starknet::contract_address_const;
    use starknet::ContractAddress;
    use starknet::get_caller_address;
    use starknet::get_contract_address;
    use pragma_lib::abi::{IPragmaABIDispatcher, IPragmaABIDispatcherTrait};
    use pragma_lib::types::{AggregationMode, DataType, PragmaPricesResponse};

    // const KEY: felt252 =
    //     6004514686061859652; // felt252 conversion of "STRK/USD", can also write const KEY : felt252 = 'BTC/USD';

    #[storage]
    struct Storage {
        underlying: ContractAddress,
        principalTk: ContractAddress,
        reserve0: u256,
        reserve1: u256,
        totalSupply: u256,
        balanceOf: LegacyMap<ContractAddress, u256>,
    }

    #[constructor]
    fn constructor(ref self: ContractState, underTk: ContractAddress, ptTk: ContractAddress) {
        self.underlying.write(underTk);
        self.principalTk.write(ptTk);
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
    // fn _get_asset_price_median(
    //     self: @ContractState, oracle_address: ContractAddress, asset: DataType
    // ) -> u128 {
    //     let oracle_dispatcher = IPragmaABIDispatcher { contract_address: oracle_address };
    //     let output: PragmaPricesResponse = oracle_dispatcher
    //         .get_data(asset, AggregationMode::Median(()));
    //     return output.price;
    // }

    // fn getPrice(ref self: ContractState) -> u128 {
    //     let oracle_address: ContractAddress = contract_address_const::<
    //         0x36031daa264c24520b11d93af622c848b2499b66b41d611bac95e13cfca131a
    //     >();
    //     let price = self._get_asset_price_median(oracle_address, DataType::SpotEntry(KEY));
    //     price
    // }
    }

    #[external(v0)]
    #[external(v0)]
    fn swap(ref self: ContractState, tokenIn: ContractAddress, amountIn: u256) -> u256 {
        assert(
            tokenIn == self.underlying.read() || tokenIn == self.principalTk.read(),
            'Invalid token address'
        );
        assert(amountIn > 0, 'Invalid amount');

        // Pull in token in
        let incTk = IMintableDispatcher { contract_address: tokenIn };
        incTk.transfer_from(get_caller_address(), get_contract_address(), amountIn);

        if tokenIn == self.underlying.read() { // Transfer principalTk to caller    
            let reserveOut = self.reserve1.read();
            let reserveIn = self.reserve0.read();

            // Calculate token out (inlcuding fees) fee 0.3%
            let amountInWithFee = (amountIn * 997) / 1000;
            let yield = incTk.current_rate();

            // let amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
            let mut amountOut = amountInWithFee * (1000 + yield * 10) / 1000;
            if reserveOut < amountOut {
                amountOut = (reserveOut * amountInWithFee) / (reserveIn + amountInWithFee);
            }

            // Transfer token out to msg.sender
            let outTk = IMintableDispatcher { contract_address: self.principalTk.read() };
            outTk.transfer(get_caller_address(), amountOut);

            // Update the reserves
            self
                ._update(
                    incTk.balance_of(get_contract_address()),
                    outTk.balance_of(get_contract_address()),
                );
            // Return amountOut
            amountOut
        } else { // Transfer toke   n2 to caller
            let reserveOut = self.reserve0.read();
            let reserveIn = self.reserve1.read();

            let outTk = IMintableDispatcher { contract_address: self.underlying.read() };
            let yield = outTk.current_rate();

            // Calculate token out (inlcuding fees) fee 0.3%
            let amountInWithFee = (amountIn * 997) / 1000;
            let mut amountOut = amountInWithFee * (1000 - yield * 10) / 1000;
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
        let principalTk = IMintableDispatcher { contract_address: self.principalTk.read() };
        let mut shares: u256 = 0;

        let yield = underlying.current_rate();

        if (self.reserve0.read() > 0 || self.reserve1.read() > 0) {
            assert(
                (self.reserve0.read()
                    * (amount1 * (1000 + yield * 10) / 1000)) == (self.reserve1.read() * amount0),
                'dy / dx != y / x'
            );
        }

        // pull in underlying and principalTk
        underlying.transfer_from(get_caller_address(), get_contract_address(), amount0);
        principalTk.transfer_from(get_caller_address(), get_contract_address(), amount1);

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
        let principalTk = IMintableDispatcher { contract_address: self.principalTk.read() };
        self
            ._update(
                underlying.balance_of(get_contract_address()),
                principalTk.balance_of(get_contract_address())
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
        let principalTk = IMintableDispatcher { contract_address: self.principalTk.read() };

        let bal0 = underlying.balance_of(get_contract_address());
        let bal1 = principalTk.balance_of(get_contract_address());

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
        principalTk.transfer(get_caller_address(), amount1);

        return (amount0, amount1);
    }
}
