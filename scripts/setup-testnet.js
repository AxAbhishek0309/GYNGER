const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Setting up GYNGER for Testnet...");

  // Check if we have a private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.log("❌ No PRIVATE_KEY found in .env.local");
    console.log("📝 Please add your MetaMask private key to .env.local:");
    console.log("   PRIVATE_KEY=your_private_key_here");
    console.log("\n🔐 To get your private key:");
    console.log("   1. Open MetaMask");
    console.log("   2. Click Account Details");
    console.log("   3. Click 'Export Private Key'");
    console.log("   4. Enter your password");
    console.log("   5. Copy the private key");
    return;
  }

  // Get the signer
  const [signer] = await ethers.getSigners();
  const address = await signer.getAddress();
  
  console.log("✅ Wallet connected:", address);
  
  // Check balance
  const balance = await signer.provider.getBalance(address);
  const balanceEth = ethers.formatEther(balance);
  
  console.log("💰 Current balance:", balanceEth, "ETH");
  
  if (parseFloat(balanceEth) < 0.01) {
    console.log("\n⚠️  Low balance detected!");
    console.log("🆘 Get free test ETH from these faucets:");
    console.log("   • https://sepoliafaucet.com/");
    console.log("   • https://www.infura.io/faucet/sepolia");
    console.log("   • https://faucet.sepolia.dev/");
    console.log("\n📋 Steps:");
    console.log("   1. Copy your address:", address);
    console.log("   2. Visit a faucet above");
    console.log("   3. Paste your address");
    console.log("   4. Request 0.5 ETH");
    console.log("   5. Wait 1-2 minutes");
    console.log("   6. Run this script again");
  } else {
    console.log("✅ Sufficient balance for deployment!");
    console.log("\n🚀 Ready to deploy to Sepolia testnet!");
    console.log("   Run: npx hardhat run scripts/deploy.js --network sepolia");
  }
  
  console.log("\n📋 Next Steps:");
  console.log("   1. Get test ETH from faucets (if needed)");
  console.log("   2. Deploy to Sepolia: npx hardhat run scripts/deploy.js --network sepolia");
  console.log("   3. Update contract address in lib/web3-config.ts");
  console.log("   4. Test your game with real transactions!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Setup failed:", error);
    process.exit(1);
  }); 