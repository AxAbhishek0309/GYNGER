# 🚀 GYNGER - Blockchain Gaming Platform

A revolutionary DeFi gaming platform that combines cryptocurrency trading, blockchain-based gaming, and multi-chain wallet integration. Players can purchase tokens with ETH or SOL, play games on-chain, and earn real cryptocurrency rewards.

## ✨ Features

### 🎮 Blockchain Gaming
- **Multi-Chain Support**: Ethereum and Solana integration
- **Token Purchase**: Buy GYNGER tokens with ETH or SOL
- **On-Chain Gameplay**: All games are executed on the blockchain
- **Real Rewards**: Win genuine cryptocurrency tokens
- **Provably Fair**: Verifiable randomness using blockchain technology

### 💰 Token System
- **GYNGER Token**: ERC-20 token for Ethereum
- **SPL Token**: Solana program for token management
- **Token Economics**: 1 ETH/SOL = 1000 GYNGER tokens
- **Maximum Supply**: 1,000,000 tokens

### 🔗 Smart Contracts
- **Ethereum**: Solidity smart contract for token management and gaming
- **Solana**: Rust program for token operations and game logic
- **Cross-Chain**: Seamless integration between networks

## 🛠️ Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Radix UI**: Accessible component library

### Blockchain
- **Ethereum**: Ethers.js for Web3 integration
- **Solana**: @solana/web3.js for Solana integration
- **Hardhat**: Ethereum development environment
- **Anchor**: Solana development framework

### Smart Contracts
- **Solidity**: Ethereum smart contracts
- **Rust**: Solana programs
- **OpenZeppelin**: Secure contract libraries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or Phantom wallet
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/gynger.git
   cd gynger
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Ethereum
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
   PRIVATE_KEY=your_private_key_here
   ETHERSCAN_API_KEY=your_etherscan_api_key
   
   # Solana
   SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Smart Contract Deployment

### Ethereum Contract

1. **Deploy to local network**
   ```bash
   npx hardhat node
   npx hardhat run scripts/deploy.js --network localhost
   ```

2. **Deploy to testnet (Sepolia)**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Deploy to mainnet**
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

### Solana Program

1. **Build the program**
   ```bash
   cd contracts
   anchor build
   ```

2. **Deploy to devnet**
   ```bash
   anchor deploy --provider.cluster devnet
   ```

3. **Update program ID**
   Update the program ID in `contracts/solana-game.rs` and `lib/web3-config.ts`

## 🎮 How to Play

### 1. Connect Wallet
- Click "Connect Wallet" button
- Choose between Ethereum or Solana
- Approve wallet connection

### 2. Purchase Tokens
- Enter amount of ETH/SOL to spend
- Click "Buy Tokens"
- Confirm transaction in wallet
- Receive GYNGER tokens

### 3. Play Games
- Choose Heads or Tails
- Set bet amount in GYNGER tokens
- Click "Flip Coin"
- Win or lose tokens based on result

### 4. Earn Rewards
- Win games to earn more tokens
- Track your statistics
- View transaction history

## 📁 Project Structure

```
gynger/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── crypto-game.tsx   # Original game component
│   └── crypto-game-blockchain.tsx  # Blockchain game
├── contracts/            # Smart contracts
│   ├── GameToken.sol     # Ethereum contract
│   └── solana-game.rs   # Solana program
├── hooks/               # Custom React hooks
│   ├── use-ethereum.ts  # Ethereum integration
│   └── use-solana.ts   # Solana integration
├── lib/                 # Utility libraries
│   └── web3-config.ts  # Web3 configuration
├── scripts/             # Deployment scripts
└── public/             # Static assets
```

## 🔒 Security Features

### Smart Contract Security
- **Reentrancy Protection**: Prevents reentrancy attacks
- **Access Control**: Owner-only functions
- **Input Validation**: Comprehensive parameter checks
- **Gas Optimization**: Efficient contract design

### Frontend Security
- **Wallet Validation**: Secure wallet connections
- **Transaction Confirmation**: User approval for all transactions
- **Error Handling**: Graceful error management
- **Input Sanitization**: Safe user inputs

## 🧪 Testing

### Smart Contract Tests
```bash
# Ethereum tests
npx hardhat test

# Solana tests
anchor test
```

### Frontend Tests
```bash
npm run test
npm run test:e2e
```

## 📊 Gas Optimization

### Ethereum
- **Deployment**: ~2,000,000 gas
- **Token Purchase**: ~150,000 gas
- **Game Play**: ~200,000 gas

### Solana
- **Token Purchase**: ~5,000 lamports
- **Game Play**: ~10,000 lamports

## 🌐 Networks Supported

### Ethereum
- **Mainnet**: Production deployment
- **Sepolia**: Testnet for development
- **Localhost**: Local development

### Solana
- **Mainnet**: Production deployment
- **Devnet**: Development and testing
- **Testnet**: Pre-production testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.gynger.com](https://docs.gynger.com)
- **Discord**: [discord.gg/gynger](https://discord.gg/gynger)
- **Twitter**: [@gynger_io](https://twitter.com/gynger_io)
- **Email**: support@gynger.com

## 🚨 Disclaimer

This software is provided "as is" without warranty. Cryptocurrency trading and gaming involves risk. Only invest what you can afford to lose.

---

**Built with ❤️ by the GYNGER team** 