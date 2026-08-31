import { ethers } from 'ethers';

const RPC_URL = 'https://data-seed-prebsc-2-s2.binance.org:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const COMMERCE_KERNEL = '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de';
const ROUTER = '0xd7d36d66d2f1b608a0f943f722d27e3744f66f25';
const POLICY = '0xd6a4217588f6b1f5657a92a3e94e6422ad771cea';

const commerceAbi = [
  'function paymentToken() view returns (address)',
  'function platformFeeBp() view returns (uint256)',
  'function platformTreasury() view returns (address)',
  'function jobCounter() view returns (uint256)',
  'function getJob(uint256 jobId) view returns (tuple(address client, address provider, address evaluator, uint256 budget, uint8 status, string description, string deliverableUrl, uint256 createdAt, uint256 fundedAt, uint256 submittedAt, uint256 settledAt))'
];

async function main() {
  console.log('--- Inspecting Commerce Kernel on BSC Testnet ---');
  const commerce = new ethers.Contract(COMMERCE_KERNEL, commerceAbi, provider);

  const token = await commerce.paymentToken();
  const feeBp = await commerce.platformFeeBp();
  const treasury = await commerce.platformTreasury();
  const counter = await commerce.jobCounter();

  console.log(`Payment Token: ${token} ${token === '0x0000000000000000000000000000000000000000' ? '(Native tBNB)' : ''}`);
  console.log(`Platform Fee: ${feeBp} bps (${Number(feeBp)/100}%)`);
  console.log(`Platform Treasury: ${treasury}`);
  console.log(`Job Counter (Total Jobs Created): ${counter}`);

  if (counter > 0n) {
    console.log('\n--- Reading Most Recent Job ---');
    const latestJobId = counter;
    try {
      const job = await commerce.getJob(latestJobId);
      console.log(`Job #${latestJobId}:`, {
        client: job.client,
        provider: job.provider,
        evaluator: job.evaluator,
        budget: ethers.formatEther(job.budget),
        status: job.status,
        description: job.description.slice(0, 100) + '...',
        deliverableUrl: job.deliverableUrl,
        createdAt: new Date(Number(job.createdAt) * 1000).toISOString()
      });
    } catch (e) {
      console.log(`Error reading job #${latestJobId}:`, e.message);
    }
  }
}

main().catch(console.error);
