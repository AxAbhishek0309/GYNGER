import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from './use-toast';
import { 
  ETHEREUM_NETWORKS, 
  CONTRACT_ADDRESSES, 
  GAME_TOKEN_CONFIG,
  formatTokenAmount,
  parseTokenAmount 
} from '@/lib/web3-config';

// GameToken ABI - simplified for the game functions
const GAME_TOKEN_ABI = [
  "function purchaseTokens() external payable",
  "function playGame(uint256 betAmount, bool playerChoice) external",
  "function balanceOf(address owner) external view returns (uint256)",
  "function getUserStats(address user) external view returns (uint256 balance, uint256 wins, uint256 games, uint256 winRate)",
  "function tokenPrice() external view returns (uint256)",
  "event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost)",
  "event GamePlayed(address indexed player, bool won, uint256 betAmount, uint256 winAmount)"
];

interface EthereumState {
  provider: ethers.Provider | null;
  signer: ethers.Signer | null;
  contract: ethers.Contract | null;
  address: string | null;
  balance: string;
  network: keyof typeof ETHEREUM_NETWORKS | null;
  isConnected: boolean;
  isLoading: boolean;
}

interface UserStats {
  balance: string;
  wins: number;
  games: number;
  winRate: number;
}

export function useEthereum() {
  const [state, setState] = useState<EthereumState>({
    provider: null,
    signer: null,
    contract: null,
    address: null,
    balance: '0',
    network: null,
    isConnected: false,
    isLoading: false,
  });

  const { toast } = useToast();

  // Connect to wallet
  const connectWallet = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast({
        title: "Wallet Not Found",
        description: "Please install MetaMask or another Ethereum wallet.",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const address = accounts[0];
      
      // Create provider and signer
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Detect network
      const network = await provider.getNetwork();
      const networkName = Object.entries(ETHEREUM_NETWORKS).find(
        ([_, config]) => config.chainId === Number(network.chainId)
      )?.[0] as keyof typeof ETHEREUM_NETWORKS || 'localhost';
      
      // Get contract instance
      const contractAddress = CONTRACT_ADDRESSES.ethereum[networkName]?.gameToken;
      const contract = contractAddress 
        ? new ethers.Contract(contractAddress, GAME_TOKEN_ABI, signer)
        : null;
      
      // Get balance
      const balance = await provider.getBalance(address);
      
      setState({
        provider,
        signer,
        contract,
        address,
        balance: balance.toString(),
        network: networkName,
        isConnected: true,
        isLoading: false,
      });

      toast({
        title: "Wallet Connected! 🎉",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });

    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [toast]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    setState({
      provider: null,
      signer: null,
      contract: null,
      address: null,
      balance: '0',
      network: null,
      isConnected: false,
      isLoading: false,
    });
    
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from your wallet.",
    });
  }, [toast]);

  // Purchase tokens
  const purchaseTokens = useCallback(async (ethAmount: string) => {
    if (!state.contract || !state.signer) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const amount = parseTokenAmount(ethAmount, 18);
      const tx = await state.contract.purchaseTokens({ value: amount });
      
      toast({
        title: "Transaction Sent! 🚀",
        description: "Your token purchase is being processed...",
      });
      
      const receipt = await tx.wait();
      
      toast({
        title: "Tokens Purchased! 🎉",
        description: `Successfully purchased tokens! Transaction: ${receipt.hash}`,
      });
      
      // Refresh balance
      const newBalance = await state.provider!.getBalance(state.address!);
      setState(prev => ({ 
        ...prev, 
        balance: newBalance.toString(),
        isLoading: false 
      }));
      
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.contract, state.signer, state.provider, state.address, toast]);

  // Play game
  const playGame = useCallback(async (betAmount: string, playerChoice: boolean) => {
    if (!state.contract || !state.signer) {
      toast({
        title: "Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const amount = parseTokenAmount(betAmount, 18);
      const tx = await state.contract.playGame(amount, playerChoice);
      
      toast({
        title: "Game Transaction Sent! 🎮",
        description: "Your game transaction is being processed...",
      });
      
      const receipt = await tx.wait();
      
      // Check if won by looking at events
      const gamePlayedEvent = receipt.logs.find((log: any) => 
        log.eventName === 'GamePlayed'
      );
      
      if (gamePlayedEvent) {
        const { won, betAmount: bet, winAmount } = gamePlayedEvent.args;
        
        if (won) {
          toast({
            title: "YOU WON! 🎉",
            description: `Won ${formatTokenAmount(winAmount.toString())} tokens!`,
          });
        } else {
          toast({
            title: "You Lost 😔",
            description: `Lost ${formatTokenAmount(bet.toString())} tokens. Try again!`,
            variant: "destructive",
          });
        }
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      
    } catch (error) {
      console.error('Error playing game:', error);
      toast({
        title: "Game Failed",
        description: "Failed to play game. Please try again.",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.contract, state.signer, toast]);

  // Get user stats
  const getUserStats = useCallback(async (): Promise<UserStats | null> => {
    if (!state.contract || !state.address) return null;

    try {
      const [balance, wins, games, winRate] = await state.contract.getUserStats(state.address);
      
      return {
        balance: formatTokenAmount(balance.toString()),
        wins: Number(wins),
        games: Number(games),
        winRate: Number(winRate),
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }, [state.contract, state.address]);

  // Get token balance
  const getTokenBalance = useCallback(async (): Promise<string> => {
    if (!state.contract || !state.address) return '0';

    try {
      const balance = await state.contract.balanceOf(state.address);
      return formatTokenAmount(balance.toString());
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }, [state.contract, state.address]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setState(prev => ({ ...prev, address: accounts[0] }));
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnectWallet]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    purchaseTokens,
    playGame,
    getUserStats,
    getTokenBalance,
  };
} 