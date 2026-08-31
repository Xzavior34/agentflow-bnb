import { ethers } from 'ethers';

const RPC_URL = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const COMMERCE_KERNEL = '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de';

async function main() {
  const iface = new ethers.Interface([
    'event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, address evaluator, string description, uint256 budget, uint256 expiredAt, address hook)',
    'event JobFunded(uint256 indexed jobId, address indexed funder, uint256 amount)',
    'event JobSubmitted(uint256 indexed jobId, address indexed provider, bytes32 deliverable)',
    'event JobCompleted(uint256 indexed jobId, address indexed settler)'
  ]);

  // Query in blocks of 2000
  const startBlock = 128170000;
  const endBlock = 128178000;
  console.log(`Querying logs from ${startBlock} to ${endBlock}...`);

  for (let b = startBlock; b < endBlock; b += 2000) {
    const to = Math.min(b + 1999, endBlock);
    const logs = await provider.getLogs({
      address: COMMERCE_KERNEL,
      fromBlock: b,
      toBlock: to
    });
    for (const log of logs) {
      try {
        const parsed = iface.parseLog(log);
        if (parsed) {
          const jId = parsed.args.jobId ? Number(parsed.args.jobId) : null;
          if (jId === 810 || jId === 811) {
            console.log(`\nFound Event: ${parsed.name} for Job #${jId}`);
            console.log(`  TxHash: ${log.transactionHash}`);
            console.log(`  Block: ${log.blockNumber}`);
            console.log(`  Args:`, parsed.args);
          }
        }
      } catch (e) {}
    }
  }
}

main().catch(console.error);
