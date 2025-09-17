import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Advanced Oracle to Somnia network...");

  // Deploy the AdvancedOracle contract
  const AdvancedOracle = await ethers.getContractFactory("AdvancedOracle");
  const oracle = await AdvancedOracle.deploy();
  
  await oracle.waitForDeployment();
  const oracleAddress = await oracle.getAddress();

  console.log("✅ AdvancedOracle deployed to:", oracleAddress);

  // Add some initial price feeds
  const feeds = [
    "BTC/USD",
    "ETH/USD", 
    "SOL/USD",
    "MATIC/USD"
  ];

  console.log("📊 Adding initial price feeds...");
  
  for (const feed of feeds) {
    const tx = await oracle.addPriceFeed(feed);
    await tx.wait();
    console.log(`✅ Added feed: ${feed}`);
  }

  console.log("\n🎉 Deployment completed!");
  console.log("📋 Contract Details:");
  console.log(`   Address: ${oracleAddress}`);
  console.log(`   Network: Somnia Testnet (Chain ID: 50312)`);
  console.log(`   Feeds: ${feeds.join(", ")}`);
  
  console.log("\n🔧 Next steps:");
  console.log("1. Update your frontend with the new contract address");
  console.log("2. Start feeding price data to the oracle");
  console.log("3. Monitor the oracle performance");

  // Verify contract on explorer (if supported)
  console.log("\n📝 Contract verification command:");
  console.log(`npx hardhat verify --network somniaTestnet ${oracleAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });