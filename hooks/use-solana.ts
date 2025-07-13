import { useState, useEffect, useCallback } from 'react';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram,
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useToast } from './use-toast';
import { 
  SOLANA_NETWORKS, 
  CONTRACT_ADDRESSES, 
  GAME_TOKEN_CONFIG,
  formatTokenAmount,
  parseTokenAmount 
} from '@/lib/web3-config';

interface SolanaState {
  connection: Connection | null;
  publicKey: PublicKey | null;
  balance: string;
  network: keyof typeof SOLANA_NETWORKS | null;
  isConnected: boolean;
  isLoading: boolean;
}

interface UserStats {
  balance: string;
  wins: number;
  games: number;
  winRate: number;
}

export function useSolana() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected, disconnect } = useWallet();
  
  const [state, setState] = useState<SolanaState>({
    connection: null,
    publicKey: null,
    balance: '0',
    network: null,
    isConnected: false,
    isLoading: false,
  });

  const { toast } = useToast();

  // Update state when wallet connection changes
  useEffect(() => {
    if (connected && publicKey && connection) {
      setState(prev => ({
        ...prev,
        connection,
        publicKey,
        isConnected: true,
        network: 'devnet', // Default to devnet for now
      }));
      
      // Get balance
      getBalance();
    } else {
      setState({
        connection: null,
        publicKey: null,
        balance: '0',
        network: null,
        isConnected: false,
        isLoading: false,
      });
    }
  }, [connected, publicKey, connection]);

  // Get SOL balance
  const getBalance = useCallback(async () => {
    if (!publicKey || !connection) return;

    try {
      const balance = await connection.getBalance(publicKey);
      setState(prev => ({
        ...prev,
        balance: (balance / LAMPORTS_PER_SOL).toString(),
      }));
    } catch (error) {
      console.error('Error getting balance:', error);
    }
  }, [publicKey, connection]);

  // Purchase tokens with SOL
  const purchaseTokens = useCallback(async (solAmount: string) => {
    if (!publicKey || !connection) {
      toast({
        title: "Not Connected",
        description: "Please connect your Solana wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Convert SOL amount to lamports
      const lamports = parseFloat(solAmount) * LAMPORTS_PER_SOL;
      
      // Create transaction to send SOL to the program
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(CONTRACT_ADDRESSES.solana.devnet?.gameToken || ''),
          lamports: lamports,
        })
      );
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      toast({
        title: "Transaction Sent! 🚀",
        description: "Your token purchase is being processed...",
      });
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }
      
      toast({
        title: "Tokens Purchased! 🎉",
        description: `Successfully purchased tokens! Transaction: ${signature}`,
      });
      
      // Refresh balance
      await getBalance();
      setState(prev => ({ ...prev, isLoading: false }));
      
    } catch (error) {
      console.error('Error purchasing tokens:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to purchase tokens. Please try again.",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [publicKey, connection, sendTransaction, getBalance, toast]);

  // Play game
  const playGame = useCallback(async (betAmount: string, playerChoice: boolean) => {
    if (!publicKey || !connection) {
      toast({
        title: "Not Connected",
        description: "Please connect your Solana wallet first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Convert token amount to lamports (assuming 9 decimals for SPL tokens)
      const lamports = parseFloat(betAmount) * Math.pow(10, 9);
      
      // Create transaction for game interaction
      const transaction = new Transaction().add(
        // This would be a custom instruction to the game program
        // For now, we'll simulate the game logic
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(CONTRACT_ADDRESSES.solana.devnet?.gameToken || ''),
          lamports: lamports,
        })
      );
      
      // Send transaction
      const signature = await sendTransaction(transaction, connection);
      
      toast({
        title: "Game Transaction Sent! 🎮",
        description: "Your game transaction is being processed...",
      });
      
      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed');
      }
      
      // Simulate game result (in production, this would come from the program)
      const won = Math.random() > 0.5;
      
      if (won) {
        toast({
          title: "YOU WON! 🎉",
          description: `Won ${(parseFloat(betAmount) * 2).toFixed(4)} tokens!`,
        });
      } else {
        toast({
          title: "You Lost 😔",
          description: `Lost ${betAmount} tokens. Try again!`,
          variant: "destructive",
        });
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
  }, [publicKey, connection, sendTransaction, toast]);

  // Get user stats (simulated for now)
  const getUserStats = useCallback(async (): Promise<UserStats | null> => {
    if (!publicKey) return null;

    try {
      // In production, this would query the program for user stats
      // For now, return simulated data
      return {
        balance: state.balance,
        wins: Math.floor(Math.random() * 10),
        games: Math.floor(Math.random() * 20) + 10,
        winRate: Math.floor(Math.random() * 100),
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      return null;
    }
  }, [publicKey, state.balance]);

  // Get token balance (simulated for now)
  const getTokenBalance = useCallback(async (): Promise<string> => {
    if (!publicKey) return '0';

    try {
      // In production, this would query the SPL token account
      // For now, return simulated balance
      return (Math.random() * 1000).toFixed(4);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  }, [publicKey]);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    disconnect();
    toast({
      title: "Wallet Disconnected",
      description: "You have been disconnected from your wallet.",
    });
  }, [disconnect, toast]);

  return {
    ...state,
    disconnectWallet,
    purchaseTokens,
    playGame,
    getUserStats,
    getTokenBalance,
    getBalance,
  };
} 