import { ethers } from 'ethers';

const RPC_URL = 'https://data-seed-prebsc-2-s2.binance.org:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const tokenAddress = '0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565';

async function main() {
  const iface = new ethers.Interface([
    'function mint(address to, uint256 amount)',
    'function faucet(address to, uint256 amount)',
    'function freeMint(uint256 amount)'
  ]);

  console.log('--- Testing mint possibilities on Testnet Token ---');
  // We can simulate calls using callStatic / estimateGas
  try {
    const data = iface.encodeFunctionData('mint', ['0x0000000000000000000000000000000000000001', ethers.parseEther('100')]);
    const res = await provider.call({ to: tokenAddress, data });
    console.log('mint() call succeeded:', res);
  } catch (e) {
    console.log('mint() call reverted:', e.message);
  }
}

main().catch(console.error);
