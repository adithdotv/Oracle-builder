import { ethers } from "ethers";

export function getEthereumProvider() {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error("MetaMask not found. Please install MetaMask to continue.");
  }
  return window.ethereum;
}

export async function getProvider() {
  const ethereum = getEthereumProvider();
  return new ethers.BrowserProvider(ethereum);
}

export async function getSigner() {
  const provider = await getProvider();
  return await provider.getSigner();
}

export function isMetaMaskInstalled(): boolean {
  return typeof window !== 'undefined' && !!window.ethereum;
}

export const SOMNIA_NETWORK = {
  chainId: 50312,
  name: "Somnia Testnet",
  rpcUrl: "https://dream-rpc.somnia.network/",
  currency: "ETH"
};

export async function switchToSomniaNetwork() {
  if (!window.ethereum) return false;
  
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${SOMNIA_NETWORK.chainId.toString(16)}` }],
    });
    return true;
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${SOMNIA_NETWORK.chainId.toString(16)}`,
            chainName: SOMNIA_NETWORK.name,
            rpcUrls: [SOMNIA_NETWORK.rpcUrl],
            nativeCurrency: {
              name: SOMNIA_NETWORK.currency,
              symbol: SOMNIA_NETWORK.currency,
              decimals: 18,
            },
          }],
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Somnia network:', addError);
        return false;
      }
    }
    console.error('Failed to switch to Somnia network:', switchError);
    return false;
  }
}