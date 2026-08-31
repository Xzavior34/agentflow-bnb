import * as sdk from '@bnbagent/sdk';
import { ethers } from 'ethers';

async function testPaymaster() {
  const paymaster = new sdk.Paymaster('https://bsc-megafuel-testnet.nodereal.io');
  console.log('--- Testing MegaFuel Paymaster isSponsorable ---');
  
  const wallet = ethers.Wallet.createRandom();
  console.log(`Generated Testnet Address: ${wallet.address}`);

  const iface = new ethers.Interface([
    'function createJob(address provider, address evaluator, string description, uint256 budget, uint256 expiredAt, address hook)'
  ]);

  const data = iface.encodeFunctionData('createJob', [
    '0x7ca564102be3C107EdA9075F490a9bB1bb74daED',
    '0xd7d36d66d2f1b608a0f943f722d27e3744f66f25',
    'AgentFlow Verification Job',
    0,
    Math.floor(Date.now() / 1000) + 86400,
    '0xd7d36d66d2f1b608a0f943f722d27e3744f66f25'
  ]);

  try {
    const sponsorable = await paymaster.isSponsorable({
      from: wallet.address,
      to: '0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de',
      data: data
    });
    console.log(`Is createJob sponsorable by MegaFuel:`, sponsorable);
  } catch (e) {
    console.log('isSponsorable error:', e.message);
  }
}

testPaymaster().catch(console.error);
