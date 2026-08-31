import fs from 'fs';
import { ethers } from 'ethers';

const ENV_PATH = 'c:/Users/Administrator/CrossDevice/Pixel 8 Pro/SOLANA_REPRO_SUPERTEAM_FIRST_TRANCHE/.env.local';
const RPC_URL = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

async function setupWallet() {
  let privateKey = null;

  if (fs.existsSync(ENV_PATH)) {
    const content = fs.readFileSync(ENV_PATH, 'utf8');
    const match = content.match(/AGENTFLOW_TESTNET_SIGNER_KEY=(0x[a-fA-F0-9]{64})/);
    if (match) {
      privateKey = match[1];
    }
  }

  if (!privateKey) {
    const randomWallet = ethers.Wallet.createRandom();
    privateKey = randomWallet.privateKey;
    fs.writeFileSync(ENV_PATH, `AGENTFLOW_TESTNET_SIGNER_KEY=${privateKey}\n`, { mode: 0o600 });
  }

  const wallet = new ethers.Wallet(privateKey, provider);
  const network = await provider.getNetwork();
  const balanceWei = await provider.getBalance(wallet.address);
  const balanceEth = ethers.formatEther(balanceWei);

  // Return public details ONLY
  return {
    publicAddress: wallet.address,
    networkName: 'BSC Testnet',
    chainId: Number(network.chainId),
    balance: balanceEth,
    balanceWei: balanceWei.toString()
  };
}

setupWallet().then(info => {
  console.log('PUBLIC_WALLET_INFO:' + JSON.stringify(info));
}).catch(console.error);
