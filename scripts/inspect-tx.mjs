import { ethers } from 'ethers';

const RPC_URL = 'https://bsc-testnet-rpc.publicnode.com';
const provider = new ethers.JsonRpcProvider(RPC_URL);

const txHash = '0x3651175601bec8b3738f723b195dd21ff847f0578a90c9acb08db5b7285a56e1';

async function main() {
  console.log('Inspecting transaction:', txHash);
  try {
    const tx = await provider.getTransaction(txHash);
    console.log('TX Object:', tx);
    if (tx) {
      console.log('From:', tx.from);
      console.log('To:', tx.to);
      console.log('Value:', ethers.formatEther(tx.value), 'tBNB');
      console.log('Block Number:', tx.blockNumber);
    }

    const receipt = await provider.getTransactionReceipt(txHash);
    console.log('TX Receipt:', receipt);

    const b1 = await provider.getBalance('0x07764D9031b8747e28d3E1601Ff1417569de22DA');
    const b2 = await provider.getBalance('0xA3bb7739aDEC947D6d935ab6E8c60F5E9bDf6B8B');
    console.log('Updated 0x0776... Balance:', ethers.formatEther(b1), 'tBNB');
    console.log('Updated 0xA3bb... Balance:', ethers.formatEther(b2), 'tBNB');
  } catch (err) {
    console.error('Error inspecting TX:', err);
  }
}

main();
