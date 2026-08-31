import * as sdk from '@bnbagent/sdk';
import { ethers } from 'ethers';

console.log('--- JobStatus enum ---');
console.log(sdk.JobStatus);

console.log('--- Verdict enum ---');
console.log(sdk.Verdict);

// Inspect ABI bundled in @bnbagent/sdk
const client = new sdk.ERC8183Client({
  network: 'bsc-testnet',
  wallet: new sdk.EVMWalletProvider({
    privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    signingPolicy: new sdk.SigningPolicy()
  })
});

console.log('\n--- ERC8183Client instance properties ---');
console.log(Object.keys(client));

async function inspectCommerceContract() {
  const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-2-s2.binance.org:8545');
  const code = await provider.getCode('0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de');
  console.log(`\nCommerce Contract Code length: ${code.length}`);

  // Test getJob(1) or read state
  try {
    const jobStatus = await client.getJobStatus('0x0000000000000000000000000000000000000000000000000000000000000001');
    console.log('getJobStatus(1):', jobStatus);
  } catch (e) {
    console.log('getJobStatus error:', e.message);
  }
}

inspectCommerceContract().catch(console.error);
