import * as sdk from '@bnbagent/sdk';
import * as erc8183 from '@bnbagent/sdk/erc8183';

const net = sdk.NETWORKS['bsc-testnet'];

const wallet = new sdk.EVMWalletProvider({
  privateKey: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  password: 'TestPassword123!',
  signingPolicy: new sdk.SigningPolicy()
});

const commerce = new erc8183.CommerceClient({
  network: 'bsc-testnet',
  commerceAddress: net.commerceContract,
  wallet: wallet
});

console.log('CommerceClient created!');
console.log('CommerceClient properties:', Object.keys(commerce));

const router = new erc8183.RouterClient({
  network: 'bsc-testnet',
  routerAddress: net.routerContract,
  wallet: wallet
});
console.log('RouterClient created!');

const policy = new erc8183.PolicyClient({
  network: 'bsc-testnet',
  policyAddress: net.policyContract,
  wallet: wallet
});
console.log('PolicyClient created!');

const client = new erc8183.ERC8183Client({
  network: 'bsc-testnet',
  commerceAddress: net.commerceContract,
  routerAddress: net.routerContract,
  policyAddress: net.policyContract,
  wallet: wallet
});
console.log('ERC8183Client created!');
console.log('ERC8183Client properties:', Object.keys(client));
