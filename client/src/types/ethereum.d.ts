interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, handler: (...args: any[]) => void) => void;
    removeListener: (event: string, handler: (...args: any[]) => void) => void;
    selectedAddress?: string;
    chainId?: string;
    networkVersion?: string;
    _metamask?: {
      isUnlocked: () => Promise<boolean>;
    };
  };
}

declare global {
  interface Window {
    ethereum?: Window['ethereum'];
  }
}

export {};