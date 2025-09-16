import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    somniaTestnet: {
      url: "https://testnet.somnia.network",
      chainId: 3141,
      accounts: ["YOUR_PRIVATE_KEY_HERE"]  // From MetaMask, use a test account!
    },
    somniaMainnet: {
      url: "https://mainnet.somnia.network",
      chainId: 3141,
      accounts: ["YOUR_PRIVATE_KEY_HERE"],
    },
  },
};

export default config;