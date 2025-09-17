import React, { useState, useEffect } from 'react';
import { isMetaMaskInstalled, getProvider, getSigner, switchToSomniaNetwork, SOMNIA_NETWORK } from '../utils/ethereum';
import { ethers } from 'ethers';

interface WalletConnectionProps {
  onConnectionChange: (connected: boolean, account: string) => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnectionChange }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState<any>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
      updateBalance(accounts[0]);
      onConnectionChange(true, accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const checkConnection = async () => {
    if (!isMetaMaskInstalled()) return;

    try {
      const provider = await getProvider();
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const account = accounts[0].address;
        setAccount(account);
        setIsConnected(true);
        onConnectionChange(true, account);
        
        await updateBalance(account);
        await updateNetwork();
      }
    } catch (error) {
      console.error('Connection check failed:', error);
    }
  };

  const updateBalance = async (address: string) => {
    try {
      const provider = await getProvider();
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance));
    } catch (error) {
      console.error('Failed to get balance:', error);
    }
  };

  const updateNetwork = async () => {
    try {
      const provider = await getProvider();
      const network = await provider.getNetwork();
      setNetwork(network);
    } catch (error) {
      console.error('Failed to get network:', error);
    }
  };

  const connectWallet = async () => {
    if (!isMetaMaskInstalled()) {
      alert('Please install MetaMask to continue!');
      return;
    }

    setIsConnecting(true);
    try {
      const provider = await getProvider();
      await provider.send('eth_requestAccounts', []);
      
      const signer = await getSigner();
      const address = await signer.getAddress();
      
      setAccount(address);
      setIsConnected(true);
      onConnectionChange(true, address);
      
      await updateBalance(address);
      await updateNetwork();
      
      // Check if we're on Somnia network
      const currentNetwork = await provider.getNetwork();
      if (Number(currentNetwork.chainId) !== SOMNIA_NETWORK.chainId) {
        const switched = await switchToSomniaNetwork();
        if (switched) {
          await updateNetwork();
        }
      }
    } catch (error) {
      console.error('Connection failed:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount('');
    setBalance('0');
    setNetwork(null);
    onConnectionChange(false, '');
  };

  const switchNetwork = async () => {
    const success = await switchToSomniaNetwork();
    if (success) {
      await updateNetwork();
    }
  };

  const isOnSomniaNetwork = network && Number(network.chainId) === SOMNIA_NETWORK.chainId;

  if (!isMetaMaskInstalled()) {
    return (
      <div className="card">
        <div className="card-header">
          <span>🦊</span>
          <h3 className="card-title">MetaMask Required</h3>
        </div>
        <p style={{ marginBottom: '16px' }}>
          Please install MetaMask to use the Oracle Builder.
        </p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="card">
        <div className="card-header">
          <span>🔗</span>
          <h3 className="card-title">Connect Wallet</h3>
        </div>
        <p style={{ marginBottom: '16px' }}>
          Connect your MetaMask wallet to start building oracles on Somnia network.
        </p>
        <button 
          onClick={connectWallet} 
          disabled={isConnecting}
          className="btn btn-primary"
        >
          {isConnecting ? (
            <>
              <span className="spinner"></span>
              Connecting...
            </>
          ) : (
            <>
              🦊 Connect MetaMask
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span>✅</span>
        <h3 className="card-title">Wallet Connected</h3>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div className="status status-connected">
          <span>🟢</span>
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '16px' }}>
        <div>
          <div className="network-label">Balance</div>
          <div className="network-value">{parseFloat(balance).toFixed(4)} ETH</div>
        </div>
        <div>
          <div className="network-label">Network</div>
          <div className="network-value">
            {network ? `${network.name} (${network.chainId})` : 'Unknown'}
          </div>
        </div>
      </div>

      {!isOnSomniaNetwork && (
        <div style={{ marginBottom: '16px' }}>
          <div className="status status-warning">
            <span>⚠️</span>
            Not connected to Somnia Testnet
          </div>
          <button 
            onClick={switchNetwork}
            className="btn btn-warning"
            style={{ marginTop: '8px', width: '100%' }}
          >
            Switch to Somnia Network
          </button>
        </div>
      )}

      <button 
        onClick={disconnect}
        className="btn btn-secondary"
        style={{ width: '100%' }}
      >
        Disconnect
      </button>
    </div>
  );
};

export default WalletConnection;