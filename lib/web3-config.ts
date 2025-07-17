import { ethers } from 'ethers';
import { Connection, clusterApiUrl } from '@solana/web3.js';

// Ethereum Configuration
export const ETHEREUM_NETWORKS = {
  mainnet: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://etherscan.io',
    currency: 'ETH',
    decimals: 18,
  },
  sepolia: {
    chainId: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
    explorer: 'https://sepolia.etherscan.io',
    currency: 'ETH',
    decimals: 18,
  },
  localhost: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://localhost:8545',
    explorer: 'http://localhost:8545',
    currency: 'ETH',
    decimals: 18,
  },
};

// Solana Configuration
export const SOLANA_NETWORKS = {
  mainnet: {
    name: 'Solana Mainnet',
    endpoint: clusterApiUrl('mainnet-beta'),
    explorer: 'https://explorer.solana.com',
    currency: 'SOL',
    decimals: 9,
  },
  devnet: {
    name: 'Solana Devnet',
    endpoint: clusterApiUrl('devnet'),
    explorer: 'https://explorer.solana.com/?cluster=devnet',
    currency: 'SOL',
    decimals: 9,
  },
  testnet: {
    name: 'Solana Testnet',
    endpoint: clusterApiUrl('testnet'),
    explorer: 'https://explorer.solana.com/?cluster=testnet',
    currency: 'SOL',
    decimals: 9,
  },
};

// Contract Addresses
export const CONTRACT_ADDRESSES = {
  ethereum: {
    mainnet: {
      gameToken: '0x...', // Deploy and add your contract address
    },
    sepolia: {
      gameToken: '0xa8513A0b3160c3C8B463CCBb3C85Db31Aa2DE2ac', // Deploy and add your contract address
    },
    localhost: {
      gameToken: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Default Hardhat address
    },
  },
  solana: {
    mainnet: {
      gameToken: '...', // Deploy and add your program ID
    },
    devnet: {
      gameToken: '...', // Deploy and add your program ID
    },
    testnet: {
      gameToken: '...', // Deploy and add your program ID
    },
  },
};

// Game Token Configuration
export const GAME_TOKEN_CONFIG = {
  name: 'Gynger Game Token',
  symbol: 'GYNGER',
  decimals: 18,
  totalSupply: '1000000000000000000000000', // 1 million tokens
  price: {
    ethereum: '0.001', // 0.001 ETH per token
    solana: '0.001', // 0.001 SOL per token
  },
};

// Provider Functions
export const getEthereumProvider = (network: keyof typeof ETHEREUM_NETWORKS) => {
  const networkConfig = ETHEREUM_NETWORKS[network];
  return new ethers.JsonRpcProvider(networkConfig.rpcUrl);
};

export const getSolanaConnection = (network: keyof typeof SOLANA_NETWORKS) => {
  const networkConfig = SOLANA_NETWORKS[network];
  return new Connection(networkConfig.endpoint, 'confirmed');
};

// Network Detection
export const detectEthereumNetwork = async (provider: ethers.Provider) => {
  const network = await provider.getNetwork();
  return Object.entries(ETHEREUM_NETWORKS).find(
    ([_, config]) => config.chainId === Number(network.chainId)
  )?.[0] || 'unknown';
};

export const detectSolanaNetwork = async (connection: Connection) => {
  try {
    const slot = await connection.getSlot();
    // This is a simplified detection - in production you'd want more robust detection
    return 'mainnet'; // Default to mainnet for now
  } catch {
    return 'devnet';
  }
};

// Utility Functions
export const formatTokenAmount = (amount: string, decimals: number = 18) => {
  return ethers.formatUnits(amount, decimals);
};

export const parseTokenAmount = (amount: string, decimals: number = 18) => {
  return ethers.parseUnits(amount, decimals);
};

export const formatCurrency = (amount: string, currency: string, decimals: number) => {
  const formatted = formatTokenAmount(amount, decimals);
  return `${formatted} ${currency}`;
}; 