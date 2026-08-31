import { ethers } from 'ethers';

async function check() {
  const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
  const addrs = [
    '0x07764D9031b8747e28d3E1601Ff1417569de22DA',
    '0xA3bb7739aDEC947D6d935ab6E8c60F5E9bDf6B8B'
  ];

  for (const a of addrs) {
    try {
      const b = await provider.getBalance(a);
      console.log(`RPC Balance for ${a}: ${ethers.formatEther(b)} tBNB`);
    } catch (e) {
      console.log(`RPC Error for ${a}: ${e.message}`);
    }
  }
}

check();
