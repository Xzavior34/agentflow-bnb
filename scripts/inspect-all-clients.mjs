import * as sdk from '@bnbagent/sdk';
import * as erc8183 from '@bnbagent/sdk/erc8183';

console.log('--- Inspecting CommerceClient Methods & Properties ---');
const wallet = new sdk.EVMWalletProvider({
  privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  password: 'TestPassword123!',
  signingPolicy: new sdk.SigningPolicy()
});

const commerce = new erc8183.CommerceClient({
  network: 'bsc-testnet',
  wallet: wallet
});

console.log('CommerceClient instance keys:', Object.keys(commerce));
for (const p of Object.getOwnPropertyNames(erc8183.CommerceClient.prototype)) {
  console.log(`  method: ${p}`);
}

const router = new erc8183.RouterClient({
  network: 'bsc-testnet',
  wallet: wallet
});
console.log('\nRouterClient instance keys:', Object.keys(router));
for (const p of Object.getOwnPropertyNames(erc8183.RouterClient.prototype)) {
  console.log(`  method: ${p}`);
}

const policy = new erc8183.PolicyClient({
  network: 'bsc-testnet',
  wallet: wallet
});
console.log('\nPolicyClient instance keys:', Object.keys(policy));
for (const p of Object.getOwnPropertyNames(erc8183.PolicyClient.prototype)) {
  console.log(`  method: ${p}`);
}
