import { ethers } from 'ethers';

const RPC_URL = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const COMMERCE_KERNEL = '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de';

const iface = new ethers.Interface([
  'function submit(uint256 jobId, bytes32 deliverable)',
  'function createJob(address provider, address evaluator, string description, uint256 budget, uint256 expiredAt, address hook)',
  'function fund(uint256 jobId)',
  'function complete(uint256 jobId)',
  'function jobs(uint256 jobId) view returns (uint256 id, address client, address provider, address evaluator, string description, uint256 budget, uint256 expiredAt, uint8 status, address hook, uint256 submittedAt, bytes32 deliverable)',
  'event JobCreated(uint256 indexed jobId, address indexed client, address indexed provider, address evaluator, string description, uint256 budget, uint256 expiredAt, address hook)',
  'event JobFunded(uint256 indexed jobId, address indexed funder, uint256 amount)',
  'event JobSubmitted(uint256 indexed jobId, address indexed provider, bytes32 deliverable)',
  'event JobCompleted(uint256 indexed jobId, address indexed settler)'
]);

async function auditTx(hash, label) {
  console.log(`\n========================================`);
  console.log(`AUDITING TRANSACTION: ${label}`);
  console.log(`Hash: ${hash}`);
  console.log(`========================================`);

  const tx = await provider.getTransaction(hash);
  const receipt = await provider.getTransactionReceipt(hash);
  const block = await provider.getBlock(receipt.blockNumber);

  console.log(`Block: ${receipt.blockNumber} (${new Date(block.timestamp * 1000).toISOString()})`);
  console.log(`From (Sender): ${tx.from}`);
  console.log(`To (Target): ${tx.to}`);
  console.log(`Status: ${receipt.status === 1 ? '1 (SUCCESS)' : '0 (REVERTED)'}`);

  // Decode tx data
  try {
    const parsedTx = iface.parseTransaction({ data: tx.data, value: tx.value });
    console.log(`Method Called: ${parsedTx.name}`);
    console.log(`Decoded Args:`, parsedTx.args);
  } catch (e) {
    console.log(`Method decode error:`, e.message);
  }

  // Decode receipt logs
  console.log(`Logs Count: ${receipt.logs.length}`);
  for (let i = 0; i < receipt.logs.length; i++) {
    const log = receipt.logs[i];
    try {
      const parsedLog = iface.parseLog(log);
      console.log(`  Log #${i}: Event ${parsedLog.name}`, parsedLog.args);
    } catch (e) {
      console.log(`  Log #${i} (raw topic0): ${log.topics[0]}`);
    }
  }
}

async function auditJob(jobId) {
  console.log(`\n========================================`);
  console.log(`AUDITING ONCHAIN JOB RECORD #${jobId}`);
  console.log(`========================================`);

  const data = iface.encodeFunctionData('jobs', [jobId]);
  const res = await provider.call({ to: COMMERCE_KERNEL, data });
  const decoded = iface.decodeFunctionResult('jobs', res);

  console.log(`Job ID: ${decoded.id.toString()}`);
  console.log(`Client: ${decoded.client}`);
  console.log(`Provider: ${decoded.provider}`);
  console.log(`Evaluator: ${decoded.evaluator}`);
  console.log(`Budget: ${ethers.formatEther(decoded.budget)} U`);
  console.log(`ExpiredAt: ${new Date(Number(decoded.expiredAt) * 1000).toISOString()} (raw: ${decoded.expiredAt})`);
  console.log(`Status: ${decoded.status} (${['OPEN', 'FUNDED', 'SUBMITTED', 'COMPLETED', 'REJECTED', 'EXPIRED'][decoded.status]})`);
  console.log(`Hook: ${decoded.hook}`);
  console.log(`SubmittedAt: ${decoded.submittedAt.toString()}`);
  console.log(`Deliverable Hash: ${decoded.deliverable}`);
  console.log(`Description: ${decoded.description}`);
}

async function main() {
  await auditTx('0x865ccab93887a4342eb7083e0524797f99391178c1db2f64c66db4edddbaa716', 'Report Item 1: 0x865cca...');
  await auditTx('0x624160c0e7c5a2bf33799e70b257b2d69bb0de6f950308cfd87f16f528eea073', 'Report Item 2: 0x624160...');
  await auditJob(810);
  await auditJob(809);
  await auditJob(786);
}

main().catch(console.error);
