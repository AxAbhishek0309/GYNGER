# 🚀 Smart Contract Deployment Guide

This guide will walk you through deploying the GYNGER smart contracts to both Ethereum and Solana networks.

## 📋 Prerequisites

### For Ethereum
- Node.js 18+
- MetaMask wallet
- Infura account (for RPC endpoints)
- Etherscan API key (for contract verification)
- Test ETH for gas fees

### For Solana
- Rust and Cargo installed
- Solana CLI tools
- Anchor CLI
- Phantom wallet
- Test SOL for transaction fees

## 🔧 Environment Setup

### 1. Install Dependencies

```bash
# Install project dependencies
npm install --legacy-peer-deps

# Install Hardhat globally (optional)
npm install -g hardhat

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Ethereum Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
ANCHOR_WALLET=~/.config/solana/id.json
```

## 🏗️ Ethereum Contract Deployment

### Step 1: Local Development

1. **Start local Hardhat node**
   ```bash
   npx hardhat node
   ```

2. **Deploy to local network**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Verify deployment**
   - Check the console output for contract address
   - Update `lib/web3-config.ts` with the new address

### Step 2: Testnet Deployment (Sepolia)

1. **Get testnet ETH**
   - Visit [Sepolia Faucet](https://sepoliafaucet.com/)
   - Request test ETH for your wallet

2. **Deploy to Sepolia**
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

3. **Verify contract on Etherscan**
   ```bash
   npx hardhat verify --network sepolia CONTRACT_ADDRESS
   ```

4. **Update configuration**
   - Update `lib/web3-config.ts` with the Sepolia contract address

### Step 3: Mainnet Deployment

⚠️ **WARNING**: Only deploy to mainnet after thorough testing!

1. **Ensure sufficient ETH**
   - Have at least 0.1 ETH for deployment gas fees

2. **Deploy to mainnet**
   ```bash
   npx hardhat run scripts/deploy.js --network mainnet
   ```

3. **Verify contract**
   ```bash
   npx hardhat verify --network mainnet CONTRACT_ADDRESS
   ```

4. **Update production config**
   - Update `lib/web3-config.ts` with mainnet address

## 🌞 Solana Program Deployment

### Step 1: Setup Solana CLI

1. **Install Solana CLI**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   ```

2. **Configure for devnet**
   ```bash
   solana config set --url devnet
   ```

3. **Create wallet**
   ```bash
   solana-keygen new
   ```

4. **Get test SOL**
   ```bash
   solana airdrop 2
   ```

### Step 2: Build and Deploy

1. **Navigate to contracts directory**
   ```bash
   cd contracts
   ```

2. **Build the program**
   ```bash
   anchor build
   ```

3. **Deploy to devnet**
   ```bash
   anchor deploy --provider.cluster devnet
   ```

4. **Update program ID**
   - Copy the program ID from deployment output
   - Update `contracts/solana-game.rs` with new program ID
   - Update `lib/web3-config.ts` with new program ID

### Step 3: Mainnet Deployment

1. **Switch to mainnet**
   ```bash
   solana config set --url mainnet-beta
   ```

2. **Deploy to mainnet**
   ```bash
   anchor deploy --provider.cluster mainnet
   ```

## 🔍 Contract Verification

### Ethereum (Etherscan)

1. **Automatic verification** (during deployment)
   ```bash
   npx hardhat verify --network sepolia CONTRACT_ADDRESS
   ```

2. **Manual verification**
   - Go to [Etherscan](https://etherscan.io/)
   - Search for your contract address
   - Click "Contract" tab
   - Click "Verify and Publish"

### Solana (Solscan)

1. **View program**
   - Go to [Solscan](https://solscan.io/)
   - Search for your program ID
   - Verify the program details

## 🧪 Testing Contracts

### Ethereum Tests

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/GameToken.test.js

# Run with gas reporting
REPORT_GAS=true npx hardhat test
```

### Solana Tests

```bash
# Run Anchor tests
anchor test

# Run specific test
anchor test --skip-local-validator
```

## 📊 Gas Optimization

### Ethereum Gas Costs

| Function | Estimated Gas |
|----------|---------------|
| Contract Deployment | ~2,000,000 |
| Token Purchase | ~150,000 |
| Game Play | ~200,000 |
| Get User Stats | ~50,000 |

### Solana Transaction Costs

| Function | Estimated Lamports |
|----------|-------------------|
| Program Deployment | ~1,000,000 |
| Token Purchase | ~5,000 |
| Game Play | ~10,000 |
| Get User Stats | ~2,000 |

## 🔒 Security Checklist

### Before Deployment

- [ ] **Code Review**: All smart contracts reviewed
- [ ] **Testing**: Comprehensive test coverage
- [ ] **Audit**: Security audit completed (recommended)
- [ ] **Gas Optimization**: Contracts optimized for gas usage
- [ ] **Access Control**: Proper access controls implemented
- [ ] **Input Validation**: All inputs validated
- [ ] **Reentrancy Protection**: Reentrancy guards in place

### After Deployment

- [ ] **Contract Verification**: Contracts verified on block explorers
- [ ] **Address Updates**: All configuration files updated
- [ ] **Testing**: End-to-end testing completed
- [ ] **Documentation**: Deployment addresses documented
- [ ] **Monitoring**: Set up contract monitoring

## 🚨 Emergency Procedures

### Contract Pause (Ethereum)

If the contract needs to be paused:

1. **Call pause function** (owner only)
   ```javascript
   await gameToken.pause();
   ```

2. **Update frontend**
   - Disable game functions
   - Show maintenance message

### Program Upgrade (Solana)

If the program needs to be upgraded:

1. **Deploy new program**
   ```bash
   anchor deploy --provider.cluster mainnet
   ```

2. **Update program ID**
   - Update all references to new program ID
   - Migrate user data if necessary

## 📈 Monitoring

### Ethereum Monitoring

- **Etherscan**: Monitor transactions and events
- **The Graph**: Index and query contract events
- **Alchemy**: Monitor gas usage and performance

### Solana Monitoring

- **Solscan**: Monitor program transactions
- **Helius**: Real-time program monitoring
- **Solana Beach**: Network statistics

## 🔄 Upgrades and Maintenance

### Contract Upgrades

1. **Deploy new contract**
2. **Migrate user data**
3. **Update frontend configuration**
4. **Notify users of changes**

### Program Upgrades

1. **Deploy new program**
2. **Update program ID references**
3. **Migrate account data**
4. **Update client applications**

## 📞 Support

For deployment issues:

- **Ethereum**: Check Hardhat documentation
- **Solana**: Check Anchor documentation
- **General**: Open an issue on GitHub

---

**Remember**: Always test thoroughly on testnets before mainnet deployment! 