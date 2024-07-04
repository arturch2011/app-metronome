This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-starknet`](https://github.com/apibara/starknet-react/tree/main/packages/create-starknet).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



### ACCOUNT SIGNER

mkdir ~/.starkli-wallets
mkdir ~/.starkli-wallets/app_metronome

starkli signer keystore from-key ~/.starkli-wallets/app_metronome/user0_keystore.json

Created new encrypted keystore file: /home/dzns/.starkli-wallets/app_metronome/user0_keystore.json
Public key: 0x03212cb4c75b7a3945cd72e0f47777eace079be728f5148dfbb0a7d5562de030
ADDRESS: 0x061f45f2352cafAe0bD5085185724a14f5877e19D34bE431BC745eeeacce4333

starkli account fetch 0x061f45f2352cafAe0bD5085185724a14f5877e19D34bE431BC745eeeacce4333 --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7 --output ~/.starkli-wallets/app_metronome/account0_account.json

starkli account fetch 0x04c0C1eb4824693143C3a4fA10f464e1983E296D1f11C2E17C98D88EEA56359b --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7 --output ~/.starkli-wallets/app_metronome/account0_account.json


### DEPLOY CONTRACT YIELD TOKEN CONTRACT

starkli declare target/dev/cairo_YieldToken.contract_class.json --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7 --account ~/.starkli-wallets/app_metronome/account0_account.json --keystore ~/.starkli-wallets/app_metronome/user0_keystore.json

Declaring Cairo 1 class: 0x04ac169403fbe3773a2ebeece0a4d0b522df5f9b2557a34ed83b8c704c393815
Compiling Sierra class to CASM with compiler version 2.6.2...
CASM class hash: 0x01b98983a5400eec17d316cdb0663a9fd53fd1a22ad6b1f61d55b60d7a49c5ed
Contract declaration transaction: 0x063bfbff78edfb92f8add83a091d2692d68e618f8fce94187df1f7da31b3a141
Class hash declared:
0x04ac169403fbe3773a2ebeece0a4d0b522df5f9b2557a34ed83b8c704c393815

starkli deploy 0x04ac169403fbe3773a2ebeece0a4d0b522df5f9b2557a34ed83b8c704c393815 0x29927c8af6bccf3f6fda035981e765a7bdbf18a2dc0d630494f8758aa908e2b --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7 --account ~/.starkli-wallets/app_metronome/account0_account.json --keystore ~/.starkli-wallets/app_metronome/user0_keystore.json

Deploying class 0x04ac169403fbe3773a2ebeece0a4d0b522df5f9b2557a34ed83b8c704c393815 with salt 0x04ffe0e94e8fbfee8ee8dc82bea533e551173c4d75d84c40f0a7b0dd8c00c757...
The contract will be deployed at address 0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642
Contract deployment transaction: 0x03f8033c61b5c48ff7c80c205a5665ad872ebb35b8c3acb88dea89257f6b40c3
Contract deployed:
0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642

# Functions

## DECIMALS
starkli call 0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642 decimals --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7

## MINT
starkli call 0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642 mint 0x01121c686b331F5b9D19dAF25E56F023bee7F6AC129518154a05f3Dd2b1dC0Ba u256:1000000  --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7

## TRANSFER
starkli call 0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642 transfer 0x04c0C1eb4824693143C3a4fA10f464e1983E296D1f11C2E17C98D88EEA56359b u256:1000000  --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7

## TOTAL SUPPLY
starkli call 0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642 total_supply --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7

## BALANCE OF

starkli call 0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642 balance_of 0x01121c686b331F5b9D19dAF25E56F023bee7F6AC129518154a05f3Dd2b1dC0Ba --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7
# APIBARA

apibara run script.js -A  dna_<apibara_token>
