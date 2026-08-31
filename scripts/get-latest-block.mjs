import { ethers } from 'ethers';

const RPC_URL = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

async function main() {
  const block = await provider.getBlock('latest');
  console.log('Latest block number:', block.number);
  console.log('Latest block timestamp:', new Date(block.timestamp * 1000).toISOString());
}

main().catch(console.error);
