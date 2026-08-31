import { ethers } from 'ethers';

const RPC_URL = 'https://data-seed-prebsc-2-s2.binance.org:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const COMMERCE_KERNEL = '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de';

async function main() {
  const iface = new ethers.Interface([
    'event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, address evaluator, string description, uint256 budget, uint256 expiredAt, address hook)',
    'event JobFunded(uint256 indexed jobId, address indexed funder, uint256 amount)',
    'event JobSubmitted(uint256 indexed jobId, address indexed provider, bytes32 deliverable)',
    'event JobCompleted(uint256 indexed jobId, address indexed settler)'
  ]);

  console.log('--- Finding Events for Job #810 ---');
  const currentBlock = await provider.getBlockNumber();
  const filter = {
    address: COMMERCE_KERNEL,
    fromBlock: Math.max(0, currentBlock - 50000),
    toBlock: currentBlock
  };

  const logs = await provider.getLogs(filter);
  console.log(`Found ${logs.length} logs in last 50,000 blocks.`);

  for (const log of logs) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed && parsed.args && parsed.args.jobId && Number(parsed.args.jobId) === 810) {
        console.log(`\nEvent: ${parsed.name}`);
        console.log(`TxHash: ${log.transactionHash}`);
        console.log(`Block: ${log.blockNumber}`);
        console.log('Args:', parsed.args);
      }
    } catch (e) {
      // not in our abi
    }
  }
}

main().catch(console.error);
