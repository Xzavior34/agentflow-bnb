import { ethers } from 'ethers';

const RPC_URL = 'https://data-seed-prebsc-2-s2.binance.org:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const COMMERCE_KERNEL = '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de';

async function main() {
  // Let's decode the raw response from jobs(uint256)
  const iface = new ethers.Interface([
    'function jobs(uint256 jobId) view returns (uint256 id, address client, address provider, address evaluator, string description, uint256 budget, uint256 expiredAt, uint8 status, address hook, uint256 submittedAt, bytes32 deliverable)'
  ]);

  for (let id = 810; id <= 814; id++) {
    try {
      const data = iface.encodeFunctionData('jobs', [id]);
      const res = await provider.call({ to: COMMERCE_KERNEL, data });
      const decoded = iface.decodeFunctionResult('jobs', res);
      console.log(`\nJob #${id}:`);
      console.log(`  Client: ${decoded.client}`);
      console.log(`  Provider: ${decoded.provider}`);
      console.log(`  Evaluator: ${decoded.evaluator}`);
      console.log(`  Budget: ${ethers.formatEther(decoded.budget)} U`);
      console.log(`  Status: ${decoded.status} (${['OPEN','FUNDED','SUBMITTED','COMPLETED','REJECTED','EXPIRED'][decoded.status]})`);
      console.log(`  ExpiredAt: ${new Date(Number(decoded.expiredAt)*1000).toISOString()}`);
      console.log(`  SubmittedAt: ${decoded.submittedAt}`);
      console.log(`  Deliverable: ${decoded.deliverable}`);
    } catch (e) {
      console.log(`Job #${id} error:`, e.message);
    }
  }
}

main().catch(console.error);
