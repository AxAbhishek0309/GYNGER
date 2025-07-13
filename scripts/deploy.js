const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying Gynger Game Token Contract...");

  // Get the contract factory
  const GameToken = await ethers.getContractFactory("GameToken");
  
  // Deploy the contract
  const gameToken = await GameToken.deploy();
  
  // Wait for deployment to finish
  await gameToken.waitForDeployment();
  
  const address = await gameToken.getAddress();
  
  console.log("✅ GameToken deployed to:", address);
  console.log("📝 Contract Details:");
  console.log("   - Name: Gynger Game Token");
  console.log("   - Symbol: GYNGER");
  console.log("   - Token Price: 0.001 ETH");
  console.log("   - Max Supply: 1,000,000 tokens");
  
  // Verify the deployment
  console.log("\n🔍 Verifying deployment...");
  const tokenPrice = await gameToken.tokenPrice();
  const maxSupply = await gameToken.maxSupply();
  const totalSupply = await gameToken.totalSupply();
  
  console.log("   - Token Price:", ethers.formatEther(tokenPrice), "ETH");
  console.log("   - Max Supply:", ethers.formatEther(maxSupply), "tokens");
  console.log("   - Total Supply:", ethers.formatEther(totalSupply), "tokens");
  
  console.log("\n🎉 Deployment successful!");
  console.log("📋 Next steps:");
  console.log("   1. Update CONTRACT_ADDRESSES in lib/web3-config.ts");
  console.log("   2. Test the contract functions");
  console.log("   3. Deploy to testnet/mainnet");
  
  return address;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 