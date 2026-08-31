import { ethers } from 'ethers';

const rpcs = [
  { name: 'BSC Testnet (PublicNode)', url: 'https://bsc-testnet-rpc.publicnode.com' },
  { name: 'BSC Testnet (BlastAPI)', url: 'https://bsc-testnet.public.blastapi.io' },
  { name: 'BSC Mainnet (Ankr)', url: 'https://rpc.ankr.com/bsc' },
  { name: 'BSC Mainnet (Binance)', url: 'https://bsc-dataseed.binance.org' },
];

const txHash = '0x3651175601bec8b3738f723b195dd21ff847f0578a90c9acb08db5b7285a56e1';

async function main() {
  for (const r of rpcs) {
    try {
      const p = new ethers.JsonRpcProvider(r.url);
      const tx = await p.getTransaction(txHash);
      if (tx) {
        console.log(`FOUND ON ${r.name}!`);
        console.log('From:', tx.from);
        console.log('To:', tx.to);
        console.log('Value:', ethers.formatEther(tx.value));
        console.log('Block:', tx.blockNumber);
        return;
      }
    } catch (e) {
      console.log(`Error on ${r.name}:`, e.message);
    }
  }
  console.log('TX Hash not found on probed RPCs yet.');
}

main();
