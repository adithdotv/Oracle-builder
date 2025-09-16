import { ethers } from "hardhat";

async function main() {
  const dataSource = "CoinGecko BTC/USD";  // From user input
  const Oracle = await ethers.getContractFactory("PriceOracle");
  const oracle = await Oracle.deploy(dataSource);
  await oracle.waitForDeployment();
  console.log("Oracle deployed to:", await oracle.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});