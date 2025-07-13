# 🚀 GYNGER - Getting Started with Real Crypto

## 💰 How to Get Test ETH (FREE!)

### **Option 1: Sepolia Testnet (Recommended)**
1. **Install MetaMask** from [metamask.io](https://metamask.io)
2. **Create/Import Wallet** in MetaMask
3. **Add Sepolia Network**:
   - Network Name: `Sepolia Testnet`
   - RPC URL: `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`
   - Chain ID: `11155111`
   - Currency: `ETH`
4. **Get Free Test ETH**:
   - [Sepolia Faucet](https://sepoliafaucet.com/) - Get 0.5 ETH
   - [Alchemy Faucet](https://sepoliafaucet.com/) - Get 0.5 ETH
   - [Infura Faucet](https://www.infura.io/faucet/sepolia) - Get 0.5 ETH

### **Option 2: Local Hardhat Network (Current Setup)**
- **Already running** on `http://localhost:8545`
- **Test accounts** with 10,000 ETH each
- **Private keys** shown in terminal (for testing only)

## 🔧 Setup Your Environment

### **1. Create .env.local file:**
```bash
# Ethereum Configuration
PRIVATE_KEY=your_metamask_private_key_here
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
ETHERSCAN_API_KEY=your_etherscan_api_key

# Solana Configuration (optional)
SOLANA_PRIVATE_KEY=your_phantom_private_key_here
```

### **2. Get Free API Keys:**
- **Infura**: [infura.io](https://infura.io) - Free tier available
- **Etherscan**: [etherscan.io](https://etherscan.io) - Free API key
- **Alchemy**: [alchemy.com](https://alchemy.com) - Free tier available

## 🎮 How to Play with Real Crypto

### **Step 1: Connect Your Real Wallet**
1. Open `http://localhost:3001`
2. Click "Connect Wallet" 
3. Choose MetaMask or Phantom
4. **Switch to Sepolia Network** (for testnet)

### **Step 2: Get Test ETH**
1. Copy your wallet address
2. Visit [Sepolia Faucet](https://sepoliafaucet.com/)
3. Paste your address and get 0.5 ETH
4. Wait 1-2 minutes for confirmation

### **Step 3: Buy GYNGER Tokens**
1. In the game, click "Buy Tokens"
2. Enter amount (e.g., 0.001 ETH = 1 token)
3. Confirm transaction in MetaMask
4. Tokens will appear in your balance

### **Step 4: Play the Game**
1. Place your bet (heads/tails)
2. Confirm transaction
3. Win/lose tokens on the blockchain!

## 🔄 Deploy to Testnet

### **Deploy to Sepolia:**
```bash
# Make sure you have test ETH in your wallet
npx hardhat run scripts/deploy.js --network sepolia
```

### **Update Contract Address:**
After deployment, update `lib/web3-config.ts`:
```typescript
sepolia: {
  gameToken: '0x...', // Your deployed contract address
},
```

## 💡 Pro Tips

### **For Development:**
- Use **Hardhat Network** (localhost) - instant transactions, free ETH
- Use **Sepolia Testnet** - real blockchain, free test ETH
- Use **Mainnet** - real money, real consequences!

### **Wallet Security:**
- **Never share private keys**
- **Use test wallets** for development
- **Keep mainnet wallets** separate
- **Backup seed phrases** securely

### **Gas Fees:**
- **Testnet**: Usually free or very low
- **Mainnet**: Real gas fees (can be expensive)
- **Local**: No gas fees

## 🚨 Important Notes

### **Testnet vs Mainnet:**
- **Testnet**: Free ETH, no real value
- **Mainnet**: Real ETH, real value
- **Always test on testnet first!**

### **Current Setup:**
- ✅ **Local Hardhat Network** - Ready for testing
- ⏳ **Sepolia Testnet** - Need to deploy
- ⏳ **Mainnet** - For production only

## 🎯 Quick Start Commands

```bash
# Start local blockchain
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to Sepolia (after getting test ETH)
npx hardhat run scripts/deploy.js --network sepolia

# Start your game
npm run dev
```

## 🆘 Need Help?

1. **No ETH**: Use faucets to get free test ETH
2. **Transaction Failed**: Check gas fees and network
3. **Wallet Not Connecting**: Make sure MetaMask is installed
4. **Contract Not Found**: Deploy to the correct network

**Happy Gaming! 🎮⚡** 