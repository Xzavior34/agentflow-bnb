import { ethers } from 'ethers';

const rpcs = [
  'https://bsc-testnet-rpc.publicnode.com',
  'https://data-seed-prebsc-1-s1.binance.org:8545/',
  'https://data-seed-prebsc-2-s1.binance.org:8545/'
];

const addr = '0xA3bb7739aDEC947D6d935ab6E8c60F5E9bDf6B8B';

async function check() {
  for (const rpc of rpcs) {
    try {
      const provider = new ethers.JsonRpcProvider(rpc);
      const bal = await provider.getBalance(addr);
      console.log(`RPC: ${rpc} -> Balance: ${ethers.formatEther(bal)} tBNB`);
    } catch (e) {
      console.log(`RPC: ${rpc} -> Error: ${e.message}`);
    }
  }
}

check();
