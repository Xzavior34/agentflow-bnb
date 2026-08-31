import { ethers } from 'ethers';

const RPC_URL = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const EXECUTION_WALLET = '0xA3bb7739aDEC947D6d935ab6E8c60F5E9bDf6B8B';

const IDENTITY_REGISTRY = '0x8004A818BFB912233c491871b3d84c89A494BD9e';
const COMMERCE_KERNEL = '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de';
const EVALUATOR_ROUTER = '0xd7d36d66d2f1b608a0f943f722d27e3744f66f25';
const OPTIMISTIC_POLICY = '0xd6a4217588f6b1f5657a92a3e94e6422ad771cea';
const UNITED_STABLES_U = '0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565';

async function preflight() {
  console.log('==================================================');
  console.log('A. PRE-TRANSACTION SAFETY GATE & LIVE PREFLIGHT');
  console.log('==================================================');

  // 1. Network & Chain ID
  const network = await provider.getNetwork();
  const blockNumber = await provider.getBlockNumber();
  console.log(`Network: BSC Testnet`);
  console.log(`Chain ID: ${network.chainId} (Expected: 97)`);
  console.log(`Current Block Number: ${blockNumber}`);

  // 2. Execution Wallet Balance
  const balanceWei = await provider.getBalance(EXECUTION_WALLET);
  const balanceEth = ethers.formatEther(balanceWei);
  console.log(`Execution Wallet Address: ${EXECUTION_WALLET}`);
  console.log(`Execution Wallet tBNB Balance: ${balanceEth} tBNB`);

  // 3. Verify Contracts
  const contracts = [
    { name: 'ERC-8004 Identity Registry', address: IDENTITY_REGISTRY },
    { name: 'ERC-8183 Commerce Kernel', address: COMMERCE_KERNEL },
    { name: 'Evaluator Router', address: EVALUATOR_ROUTER },
    { name: 'Optimistic Policy', address: OPTIMISTIC_POLICY },
    { name: 'United Stables U', address: UNITED_STABLES_U },
  ];

  for (const c of contracts) {
    const code = await provider.getCode(c.address);
    console.log(`Contract ${c.name} (${c.address}): ${code && code !== '0x' ? 'DEPLOYED (' + code.length + ' bytes)' : 'NOT DEPLOYED'}`);
  }

  // 4. Verify SafeHire ProofOps #2032
  const identityAbi = ['function ownerOf(uint256 tokenId) view returns (address)'];
  const identityContract = new ethers.Contract(IDENTITY_REGISTRY, identityAbi, provider);
  try {
    const owner = await identityContract.ownerOf(2032);
    console.log(`SafeHire ProofOps Token #2032 Owner: ${owner}`);
  } catch (err) {
    console.error('Error fetching Token #2032:', err.message);
  }

  // 5. Query ERC-8183 Commerce Kernel Job Counter
  const commerceAbi = [
    'function jobCount() view returns (uint256)',
    'function getJobCount() view returns (uint256)',
    'function totalJobs() view returns (uint256)',
    'function nextJobId() view returns (uint256)',
    'function getJob(uint256 jobId) view returns (tuple(address client, address provider, address evaluator, uint256 budget, uint8 status, string deliverableHash))'
  ];

  const commerceContract = new ethers.Contract(COMMERCE_KERNEL, commerceAbi, provider);
  let jobCounter = null;
  for (const fn of ['jobCount', 'getJobCount', 'totalJobs', 'nextJobId']) {
    try {
      const res = await commerceContract[fn]();
      console.log(`Commerce Kernel ${fn}(): ${res.toString()}`);
      jobCounter = res.toString();
      break;
    } catch (_) {}
  }

  // If counter function is not a direct view getter, let's probe job IDs from 810 upwards to find highest existing job ID
  if (!jobCounter) {
    console.log('Probing Commerce Kernel job slots starting from #810...');
    let highestId = 810;
    for (let id = 810; id <= 850; id++) {
      try {
        const job = await commerceContract.getJob(id);
        if (job && job.client && job.client !== '0x0000000000000000000000000000000000000000') {
          highestId = id;
        }
      } catch (err) {
        break;
      }
    }
    console.log(`Highest existing Job ID detected onchain: #${highestId}`);
  }

  console.log('==================================================');
}

preflight().catch(console.error);
