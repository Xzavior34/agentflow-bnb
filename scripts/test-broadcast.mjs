import { ethers } from 'ethers';

const RPC_URL = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const rawOrHash = '0x3651175601bec8b3738f723b195dd21ff847f0578a90c9acb08db5b7285a56e1';

async function main() {
  try {
    const res = await provider.broadcastTransaction(rawOrHash);
    console.log('Broadcast result:', res);
  } catch (err) {
    console.log('Broadcast error:', err.message);
  }
}

main();
