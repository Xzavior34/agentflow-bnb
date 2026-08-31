import * as sdk from '@bnbagent/sdk';
import { ethers } from 'ethers';

const wallet = new sdk.EVMWalletProvider({
  privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  password: 'TestPassword123!',
  signingPolicy: new sdk.SigningPolicy()
});

console.log('Wallet address:', wallet.address);

const client = new sdk.ERC8183Client({
  network: 'bsc-testnet',
  wallet: wallet
});

console.log('ERC8183Client created successfully!');
console.log('Client publicClient:', Boolean(client.publicClient));

async function run() {
  const provider = new ethers.JsonRpcProvider('https://bsc-testnet-rpc.publicnode.com');
  const code = await provider.getCode('0xa206c0517b6371c6638cd9e4a42cc9f02a33b0de');
  console.log(`Commerce Kernel Bytecode Length: ${code.length} bytes`);

  // Let's inspect SafeHire token 2032 on ERC8004 Registry
  const registry = new ethers.Contract(
    '0x8004A818BFB912233c491871b3d84c89A494BD9e',
    ['function ownerOf(uint256 tokenId) view returns (address)', 'function tokenURI(uint256 tokenId) view returns (string)'],
    provider
  );
  const owner2032 = await registry.ownerOf(2032);
  const uri2032 = await registry.tokenURI(2032);
  console.log(`SafeHire (2032) Owner: ${owner2032}`);
  console.log(`SafeHire (2032) URI: ${uri2032}`);
}

run().catch(console.error);
