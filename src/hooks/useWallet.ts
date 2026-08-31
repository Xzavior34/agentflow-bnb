import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from 'sonner';
import { ACTIVE_NETWORK } from '@/config/networks';

// Active chain configuration (BSC Testnet by default — see src/config/networks.ts)
const ACTIVE_CHAIN = {
  chainId: ACTIVE_NETWORK.chainIdHex,
  chainName: ACTIVE_NETWORK.chainName,
  nativeCurrency: ACTIVE_NETWORK.nativeCurrency,
  rpcUrls: ACTIVE_NETWORK.rpcUrls,
  blockExplorerUrls: [ACTIVE_NETWORK.explorerUrl],
};

// Minimal shape of the EIP-1193 provider injected by MetaMask/compatible wallets.
// Avoids `any` while not overcommitting to a full spec we don't need here.
interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

interface EthereumRequestError {
  code?: number | string;
  message?: string;
}

interface WalletState {
  address: string | null;
  balance: string;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: string | null;
  isCorrectNetwork: boolean;
}

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    balance: '0',
    isConnected: false,
    isConnecting: false,
    chainId: null,
    isCorrectNetwork: false,
  });

  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';

  // Update balance
  const updateBalance = useCallback(async (address: string, provider: ethers.BrowserProvider) => {
    try {
      const balance = await provider.getBalance(address);
      setWallet(prev => ({
        ...prev,
        balance: ethers.formatEther(balance),
      }));
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, []);

  // Switch to the active chain (BSC Testnet by default, see src/config/networks.ts)
  const switchToActiveChain = useCallback(async () => {
    if (!window.ethereum) return false;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: ACTIVE_CHAIN.chainId }],
      });
      return true;
    } catch (switchError: unknown) {
      const err = switchError as EthereumRequestError;
      // Chain not added, try to add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [ACTIVE_CHAIN],
          });
          return true;
        } catch (addError) {
          console.error(`Error adding ${ACTIVE_CHAIN.chainName}:`, addError);
          toast.error(`Failed to add ${ACTIVE_CHAIN.chainName}`);
          return false;
        }
      }
      console.error(`Error switching to ${ACTIVE_CHAIN.chainName}:`, switchError);
      return false;
    }
  }, []);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled) {
      toast.error('MetaMask is not installed. Please install MetaMask to continue.');
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setWallet(prev => ({ ...prev, isConnecting: true }));

    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      
      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const walletSigner = await browserProvider.getSigner();
      const address = accounts[0];
      const network = await browserProvider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);
      const isCorrectNetwork = chainId.toLowerCase() === ACTIVE_CHAIN.chainId.toLowerCase();

      setProvider(browserProvider);
      setSigner(walletSigner);
      setWallet({
        address,
        balance: '0',
        isConnected: true,
        isConnecting: false,
        chainId,
        isCorrectNetwork,
      });

      await updateBalance(address, browserProvider);

      if (!isCorrectNetwork) {
        toast.warning(`Please switch to ${ACTIVE_CHAIN.chainName} for the demo`);
        await switchToActiveChain();
      } else {
        toast.success('Wallet connected!');
      }
    } catch (error: unknown) {
      console.error('Connection error:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
      const message = error instanceof Error ? error.message : 'Failed to connect wallet';
      toast.error(message);
    }
  }, [isMetaMaskInstalled, switchToActiveChain, updateBalance]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setWallet({
      address: null,
      balance: '0',
      isConnected: false,
      isConnecting: false,
      chainId: null,
      isCorrectNetwork: false,
    });
    setProvider(null);
    setSigner(null);
    toast.info('Wallet disconnected');
  }, []);

  // Send transaction
  const sendTransaction = useCallback(async (toAddress: string, amountNative: string): Promise<string | null> => {
    if (!signer || !wallet.isConnected) {
      toast.error('Wallet not connected');
      return null;
    }

    if (!wallet.isCorrectNetwork) {
      const switched = await switchToActiveChain();
      if (!switched) {
        toast.error(`Please switch to ${ACTIVE_CHAIN.chainName}`);
        return null;
      }
    }

    try {
      const tx = await signer.sendTransaction({
        to: toAddress,
        value: ethers.parseEther(amountNative),
      });
      
      toast.loading('Transaction pending...', { id: 'tx-pending' });
      const receipt = await tx.wait();
      toast.dismiss('tx-pending');
      
      if (receipt && wallet.address && provider) {
        await updateBalance(wallet.address, provider);
      }
      
      return receipt?.hash || tx.hash;
    } catch (error: unknown) {
      toast.dismiss('tx-pending');
      console.error('Transaction error:', error);

      const err = error as EthereumRequestError;
      if (err.code === 'ACTION_REJECTED') {
        toast.error('Transaction rejected by user');
      } else if (err.code === 'INSUFFICIENT_FUNDS') {
        toast.error(`Insufficient funds. Get ${ACTIVE_CHAIN.nativeCurrency.symbol} from the BNB Testnet faucet.`);
      } else {
        toast.error(err.message || 'Transaction failed');
      }
      return null;
    }
  }, [signer, wallet.isConnected, wallet.isCorrectNetwork, wallet.address, provider, switchToActiveChain, updateBalance]);

  // Listen for account/chain changes
  useEffect(() => {
    if (!isMetaMaskInstalled) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else if (accounts[0] !== wallet.address) {
        setWallet(prev => ({ ...prev, address: accounts[0] }));
        if (provider) {
          updateBalance(accounts[0], provider);
        }
      }
    };

    const handleChainChanged = (chainId: string) => {
      const isCorrect = chainId.toLowerCase() === ACTIVE_CHAIN.chainId.toLowerCase();
      setWallet(prev => ({ ...prev, chainId, isCorrectNetwork: isCorrect }));
      
      if (!isCorrect) {
        toast.warning(`Please switch to ${ACTIVE_CHAIN.chainName}`);
      }
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [isMetaMaskInstalled, wallet.address, provider, disconnect, updateBalance]);

  return {
    ...wallet,
    connect,
    disconnect,
    sendTransaction,
    switchToActiveChain,
    isMetaMaskInstalled,
    explorerUrl: ACTIVE_CHAIN.blockExplorerUrls[0],
  };
}

// Extend window type for ethereum
declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}
