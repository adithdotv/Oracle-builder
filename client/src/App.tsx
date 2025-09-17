import React, { useState } from 'react';
import WalletConnection from './components/WalletConnection';
import OracleDeployer from './components/OracleDeployer';
import OracleManager from './components/OracleManager';
import ActivityLog from './components/ActivityLog';
import NetworkInfo from './components/NetworkInfo';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const handleConnectionChange = (connected: boolean, account: string) => {
    setIsConnected(connected);
    setAccount(account);
    if (connected) {
      addLog(`🔗 Wallet connected: ${account.slice(0, 6)}...${account.slice(-4)}`);
    } else {
      addLog('🔌 Wallet disconnected');
      setContractAddress(''); // Clear contract when disconnected
    }
  };

  const handleOracleDeployed = (address: string) => {
    setContractAddress(address);
    addLog(`🎉 Oracle ready for management at: ${address.slice(0, 6)}...${address.slice(-4)}`);
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-19), message]); // Keep last 20 logs
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="App">
      <div className="container">
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 'bold', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '12px'
          }}>
            🌐 Somnia Oracle Builder
          </h1>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#4a5568',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Deploy and manage decentralized price oracles on the Somnia network with ease
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-2" style={{ marginBottom: '32px' }}>
          {/* Left Column */}
          <div>
            <WalletConnection onConnectionChange={handleConnectionChange} />
            <OracleDeployer 
              isConnected={isConnected}
              onOracleDeployed={handleOracleDeployed}
              onLog={addLog}
            />
          </div>

          {/* Right Column */}
          <div>
            <OracleManager 
              contractAddress={contractAddress}
              isConnected={isConnected}
              onLog={addLog}
            />
          </div>
        </div>

        {/* Activity Log - Full Width */}
        <div style={{ marginBottom: '32px' }}>
          <ActivityLog logs={logs} onClear={clearLogs} />
        </div>

        {/* Network Info */}
        <NetworkInfo />

        {/* Footer */}
        <footer style={{ 
          textAlign: 'center', 
          marginTop: '40px', 
          padding: '20px',
          color: '#718096',
          fontSize: '14px'
        }}>
          <p>
            Built for the Somnia Network • 
            <a 
              href="https://docs.somnia.network/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#667eea', textDecoration: 'none', marginLeft: '8px' }}
            >
              Documentation
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;