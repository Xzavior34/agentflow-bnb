import { ethers } from 'ethers';

const RPC_URL = 'https://data-seed-prebsc-2-s2.binance.org:8545';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const tokenAddress = '0xc70B8741B8B07A6d61E54fd4B20f22Fa648E5565';
const erc20Abi = [
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)'
];

async function main() {
  const token = new ethers.Contract(tokenAddress, erc20Abi, provider);
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const supply = await token.totalSupply();

  console.log('--- ERC-8183 Payment Token on BSC Testnet ---');
  console.log(`Address: ${tokenAddress}`);
  console.log(`Name: ${name}`);
  console.log(`Symbol: ${symbol}`);
  console.log(`Decimals: ${decimals}`);
  console.log(`Total Supply: ${ethers.formatUnits(supply, decimals)} ${symbol}`);
}

main().catch(console.error);
