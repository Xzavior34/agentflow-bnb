import { ethers } from 'ethers';

const RPC_URL = 'https://data-seed-prebsc-2-s2.binance.org:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const tokenAddress = '0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565';

async function main() {
  const code = await provider.getCode(tokenAddress);
  console.log(`Token code length: ${code.length}`);

  // Let's test calling mint/faucet signatures
  const iface = new ethers.Interface([
    'function mint(address to, uint256 amount)',
    'function faucet(uint256 amount)',
    'function drip()',
    'function buy() payable',
    'function owner() view returns (address)'
  ]);

  const contract = new ethers.Contract(tokenAddress, iface, provider);
  try {
    const owner = await contract.owner();
    console.log(`Token owner: ${owner}`);
  } catch (e) {
    console.log('Owner call error:', e.message);
  }
}

main().catch(console.error);
