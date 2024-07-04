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
  sinkType: "console",
  sinkOptions: {}
};

export default function transform({ header, events }) {
  const { blockNumber, blockHash, timestamp } = header;

  if(!events) {
    return [];
  }
  
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

// DZNES TRANSFORMATION
// export default function transform(block) {
//   const blockTimestamp = block.header.timestamp;
//   const events = block.events;
 
//   const hashedEventName = events[0].event.keys[0]
//   const senderAddress = events[0].event.keys[1]
//   const receiverAddress = events[0].event.keys[2]
//   const amount = formatUnits(
//     +uint256.uint256ToBN({ low: events[0].event.data[0], high: events[0].event.data[1] }).toString(),
//     18
//   );

//   const executionStatus = events[0].receipt.executionStatus 
//   return { executionStatus };
// }