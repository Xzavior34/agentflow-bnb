import * as sdk from '@bnbagent/sdk';
import { ethers } from 'ethers';

async function testPaymaster() {
  const paymaster = new sdk.Paymaster('https://bsc-megafuel-testnet.nodereal.io');
  console.log('--- Testing MegaFuel Paymaster ---');
  
  // Let's test if paymaster can sponsor a createJob transaction
  const wallet = ethers.Wallet.createRandom();
  console.log(`Generated Testnet Address: ${wallet.address}`);

  const balance = await paymaster.makeRpcRequest('eth_getBalance', [wallet.address, 'latest']);
  console.log(`Initial Balance: ${balance}`);

  const sponsorable = await paymaster.isSponsorable(wallet.address);
  console.log(`Is Address Sponsorable by MegaFuel:`, sponsorable);
}

testPaymaster().catch(console.error);
