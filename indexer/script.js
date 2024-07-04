import { hash, uint256 } from "https://esm.sh/starknet";
import { formatUnits } from 'https://esm.sh/viem@1.2.7'

const DECIMALS = 18;

export const config = {
  streamUrl: "https://sepolia.starknet.a5a.ch",
  startingBlock: 70_000, // 78_347 is the block of the last transaction
  network: "starknet",
  finality: "DATA_STATUS_ACCEPTED",
  filter: {
    header: {
      weak: true
    },

  events: [
      {
          fromAddress: "0x07363bb886c801a7c620a953e981cfc209dbd8370d8f4ff8a1df6b8eaec51642",
          keys: [hash.getSelectorFromName("Transfer")]
      },
    ],
  },
  sinkType: "postgres",
  sinkOptions: {
      tableName: "transfers",
      connectionString: "postgres://postgres:postgres@localhost:5432/transactions"
  },
};

export default function transform({ header, events }) {
  const { blockNumber, blockHash, timestamp } = header;
  return events.map(({ event, receipt }) => {
    const { transactionHash } = receipt;
    const transferId = `${transactionHash}_${event.index}`;

    const [event_name, fromAddress, toAddress] = event.keys;
    const [amountLow, amountHigh] = event.data;
    const amountRaw = uint256.uint256ToBN({ low: amountLow, high: amountHigh });
    const amount = formatUnits(amountRaw, DECIMALS);

    // Convert to snake_case because it works better with postgres.
    return {
      network: "starknet-sepolia",
      symbol: "YT",
      block_hash: blockHash,
      block_number: +blockNumber,
      block_timestamp: timestamp,
      transaction_hash: transactionHash,
      transfer_id: transferId,
      from_address: fromAddress,
      to_address: toAddress,
      amount: +amount, // From string to number
      amount_raw: amountRaw.toString(),
    };
  });
}