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

Created new encrypted keystore file: /home/dzns/.starkli-wallets/app_metronome/user0_keystore.json
Public key: 0x03335514cb82008d5aff5517e4d3b37e54873ba9f93c239ea73624bea76a5cca

starkli signer keystore from-key ~/.starkli-wallets/app_metronome/user0_keystore.json

starkli account fetch 0x01121c686b331F5b9D19dAF25E56F023bee7F6AC129518154a05f3Dd2b1dC0Ba --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7 --output ~/.starkli-wallets/app_metronome/account0_account.json

cairo_YieldToken.contract_class.json

starkli declare target/dev/cairo_YieldToken.contract_class.json --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7 --account ~/.starkli-wallets/app_metronome/account0_account.json --keystore ~/.starkli-wallets/app_metronome/user0_keystore.json

Sierra compiler version not specified. Attempting to automatically decide version to use...
Network detected: sepolia. Using the default compiler version for this network: 2.6.2. Use the --compiler-version flag to choose a different version.
Declaring Cairo 1 class: 0x05468cdc26aa1bd0cddd43a38a6e8d78f36aa896b5f35f35eabe97282438b4bf
Compiling Sierra class to CASM with compiler version 2.6.2...
CASM class hash: 0x04143b6d629a5d81622dc35fa050552c78fb654f7db39f6b3169d8b273576c99
Contract declaration transaction: 0x07957ea73b69b7d6e38e04890cc5f8a6e7399a809936404bf6cef35443f437dc
Class hash declared:
0x05468cdc26aa1bd0cddd43a38a6e8d78f36aa896b5f35f35eabe97282438b4bf

starkli deploy 0x05468cdc26aa1bd0cddd43a38a6e8d78f36aa896b5f35f35eabe97282438b4bf 0x29927c8af6bccf3f6fda035981e765a7bdbf18a2dc0d630494f8758aa908e2b --rpc https://starknet-sepolia.public.blastapi.io/rpc/v0_7 --account ~/.starkli-wallets/app_metronome/account0_account.json --keystore ~/.starkli-wallets/app_metronome/user0_keystore.json