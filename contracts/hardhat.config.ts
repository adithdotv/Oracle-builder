import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
dotenv.config();


const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    somniaTestnet: {
      url: "https://dream-rpc.somnia.network/",
      chainId: 50312,
      accounts: [process.env.PRIVATE_KEY || " "]  // From MetaMask, use a test account!
    },
  },
};

export default config;