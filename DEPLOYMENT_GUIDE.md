# 🚀 Senior Developer Deployment Guide

## 📋 **Prerequisites Setup**

### **1. Get Your Keys (Like a Senior Dev)**

#### **Ethereum Setup:**
1. **Create MetaMask Wallet** (if you don't have one)
   - Go to [MetaMask.io](https://metamask.io)
   - Install browser extension
   - Create new wallet
   - **SAVE YOUR SEED PHRASE SECURELY**

2. **Get Infura API Key:**
   - Go to [Infura.io](https://infura.io)
   - Create free account
   - Create new project
   - Copy your project ID

3. **Get Etherscan API Key:**
   - Go to [Etherscan.io](https://etherscan.io)
   - Create account
   - Go to API Keys section
   - Create new API key

#### **Solana Setup:**
1. **Install Solana CLI:**
   ```bash
   sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
   ```

2. **Install Anchor CLI:**
   ```bash
   cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
   ```

### **2. Create Environment File**

Create `.env.local` in your project root:

```env
# Ethereum Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
MAINNET_RPC_URL=https://mainnet.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_metamask_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key

# Solana Configuration
SOLANA_RPC_URL=https://api.devnet.solana.com
ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
ANCHOR_WALLET=~/.config/solana/id.json

# Development Settings
NODE_ENV=development
REPORT_GAS=true
```

## 🏗️ **Phase 2: Ethereum Contract Deployment**

### **Step 1: Install Hardhat Dependencies**

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

### **Step 2: Get Testnet ETH**

1. **Sepolia Faucet:**
   - Go to [Sepolia Faucet](https://sepoliafaucet.com/)
   - Connect your MetaMask wallet
   - Request test ETH (you'll get 0.5 ETH)

### **Step 3: Deploy to Sepolia Testnet**

```bash
# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

**Expected Output:**
```
🚀 Deploying Gynger Game Token Contract...
✅ GameToken deployed to: 0x1234567890abcdef...
📝 Contract Details:
   - Name: Gynger Game Token
   - Symbol: GYNGER
   - Token Price: 0.001 ETH
   - Max Supply: 1,000,000 tokens
```

### **Step 4: Verify Contract**

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

### **Step 5: Update Configuration**

Update `lib/web3-config.ts` with your deployed address:

```typescript
export const CONTRACT_ADDRESSES = {
  ethereum: {
    sepolia: {
      gameToken: '0x1234567890abcdef...', // Your deployed address
    },
  },
  // ... rest of config
};
```

## 🌞 **Phase 3: Solana Program Deployment**

### **Step 1: Setup Solana Wallet**

```bash
# Create new wallet
solana-keygen new

# Set to devnet
solana config set --url devnet

# Get test SOL
solana airdrop 2
```

### **Step 2: Build and Deploy**

```bash
# Navigate to contracts
cd contracts

# Build program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet
```

**Expected Output:**
```
Deploying program...
Program Id: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### **Step 3: Update Program ID**

Update `contracts/solana-game.rs`:
```rust
declare_id!("YOUR_PROGRAM_ID_HERE");
```

Update `lib/web3-config.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  solana: {
    devnet: {
      gameToken: 'YOUR_PROGRAM_ID_HERE',
    },
  },
};
```

## 🔗 **Phase 4: Real Wallet Integration**

### **Step 1: Update Ethereum Hook**

Replace the simulated functions in `hooks/use-ethereum.ts` with real implementations:

```typescript
// Real wallet connection
const connectWallet = useCallback(async () => {
  if (typeof window === 'undefined' || !window.ethereum) {
    toast({
      title: "Wallet Not Found",
      description: "Please install MetaMask.",
      variant: "destructive",
    });
    return;
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    const address = accounts[0];
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Get real balance
    const balance = await provider.getBalance(address);
    
    setState({
      provider,
      signer,
      address,
      balance: balance.toString(),
      isConnected: true,
    });
  } catch (error) {
    console.error('Connection failed:', error);
  }
}, [toast]);
```

### **Step 2: Update Solana Hook**

Replace simulated functions in `hooks/use-solana.ts`:

```typescript
// Real Solana connection
const connectWallet = useCallback(async () => {
  try {
    const { solana } = window as any;
    
    if (!solana?.isPhantom) {
      toast({
        title: "Phantom Not Found",
        description: "Please install Phantom wallet.",
        variant: "destructive",
      });
      return;
    }

    const response = await solana.connect();
    const publicKey = response.publicKey.toString();
    
    setState({
      publicKey,
      isConnected: true,
    });
  } catch (error) {
    console.error('Connection failed:', error);
  }
}, [toast]);
```

## 🧪 **Phase 5: Testing**

### **Step 1: Test Ethereum**

1. **Connect MetaMask** to Sepolia network
2. **Import your private key** to MetaMask
3. **Test token purchase** with real Sepolia ETH
4. **Test game transactions**

### **Step 2: Test Solana**

1. **Connect Phantom** to Devnet
2. **Import your Solana wallet** to Phantom
3. **Test token purchase** with real Devnet SOL
4. **Test game transactions**

## 📊 **Phase 6: Monitoring**

### **Ethereum Monitoring:**
- **Etherscan**: Monitor transactions
- **Gas Tracker**: Track gas prices
- **Contract Events**: Monitor game events

### **Solana Monitoring:**
- **Solscan**: Monitor program transactions
- **Solana Beach**: Network statistics
- **Program Logs**: Monitor game events

## 🚨 **Production Checklist**

### **Before Mainnet:**
- [ ] **Security Audit** (recommended)
- [ ] **Testnet Testing** (thorough)
- [ ] **Gas Optimization** (complete)
- [ ] **Error Handling** (robust)
- [ ] **User Documentation** (clear)

### **Mainnet Deployment:**
- [ ] **Deploy to Ethereum Mainnet**
- [ ] **Deploy to Solana Mainnet**
- [ ] **Update Production Configs**
- [ ] **Monitor Transactions**
- [ ] **User Support Ready**

## 💰 **Cost Estimation**

### **Development (Testnet):**
- **Ethereum Sepolia**: Free test ETH
- **Solana Devnet**: Free test SOL
- **Total Cost**: $0

### **Production (Mainnet):**
- **Ethereum Deployment**: ~$100-300
- **Solana Deployment**: ~$10-50
- **Ongoing Gas**: ~$0.01-0.10 per transaction

## 🎯 **Next Steps**

1. **Follow this guide step by step**
2. **Test thoroughly on testnets**
3. **Deploy to mainnet when ready**
4. **Monitor and maintain**

---

**Remember**: Always test on testnets first! Never deploy untested code to mainnet. 