import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { getProvider, getSigner, isMetaMaskInstalled } from '../utils/ethereum';
import { ORACLE_ABI } from '../contracts/OracleABI';

interface OracleManagerProps {
  contractAddress: string;
  isConnected: boolean;
  onLog: (message: string) => void;
}

interface APIPreset {
  name: string;
  url: string;
  source: string;
}

const API_PRESETS: APIPreset[] = [
  {
    name: "Bitcoin (CoinGecko)",
    url: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
    source: "CoinGecko BTC/USD"
  },
  {
    name: "Ethereum (CoinGecko)",
    url: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    source: "CoinGecko ETH/USD"
  },
  {
    name: "Solana (CoinGecko)",
    url: "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
    source: "CoinGecko SOL/USD"
  }
];

const OracleManager: React.FC<OracleManagerProps> = ({ 
  contractAddress, 
  isConnected, 
  onLog 
}) => {
  const [apiUrl, setApiUrl] = useState(API_PRESETS[0].url);
  const [updateFreq, setUpdateFreq] = useState(30);
  const [latestPrice, setLatestPrice] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(0);
  const [dataSource, setDataSource] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAutoUpdating, setIsAutoUpdating] = useState(false);
  const [oracleOwner, setOracleOwner] = useState('');
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (contractAddress && isConnected) {
      loadOracleData();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [contractAddress, isConnected]);

  const loadOracleData = async () => {
    if (!contractAddress || !isMetaMaskInstalled()) return;

    try {
      const provider = await getProvider();
      const contract = new ethers.Contract(contractAddress, ORACLE_ABI, provider);

      const [price, lastUpdate, source, owner] = await Promise.all([
        contract.latestPrice(),
        contract.lastUpdated(),
        contract.dataSource(),
        contract.owner()
      ]);

      setLatestPrice(Number(price));
      setLastUpdated(Number(lastUpdate));
      setDataSource(source);
      setOracleOwner(owner);
      
      onLog(`📊 Oracle data loaded: $${(Number(price) / 100).toFixed(2)}`);
    } catch (error: any) {
      console.error('Failed to load oracle data:', error);
      onLog(`❌ Failed to load oracle data: ${error.message}`);
    }
  };

  const updatePrice = async () => {
    if (!contractAddress || !isConnected || !isMetaMaskInstalled()) return;

    setIsUpdating(true);
    try {
      onLog('🔄 Fetching price data...');
      const response = await axios.get(apiUrl);
      
      let price = 0;
      if (apiUrl.includes('coingecko')) {
        const coinId = apiUrl.includes('bitcoin') ? 'bitcoin' : 
                     apiUrl.includes('ethereum') ? 'ethereum' : 'solana';
        price = Math.round(response.data[coinId].usd * 100);
      } else {
        price = Math.round(parseFloat(response.data.price || response.data.value || 0) * 100);
      }

      onLog(`💰 Fetched price: $${(price / 100).toFixed(2)}`);

      const signer = await getSigner();
      const contract = new ethers.Contract(contractAddress, ORACLE_ABI, signer);

      onLog('📝 Updating oracle...');
      const tx = await contract.updatePrice(price);
      await tx.wait();

      setLatestPrice(price);
      setLastUpdated(Math.floor(Date.now() / 1000));
      onLog(`✅ Price updated successfully: $${(price / 100).toFixed(2)}`);
    } catch (error: any) {
      console.error('Update failed:', error);
      onLog(`❌ Update failed: ${error.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleAutoUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsAutoUpdating(false);
      onLog('⏹️ Auto-update stopped');
    } else {
      intervalRef.current = setInterval(updatePrice, updateFreq * 1000);
      setIsAutoUpdating(true);
      onLog(`▶️ Auto-update started (every ${updateFreq}s)`);
    }
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const preset = API_PRESETS.find(p => p.url === e.target.value);
    if (preset) {
      setApiUrl(preset.url);
      onLog(`📡 API preset changed to: ${preset.name}`);
    }
  };

  const formatTimestamp = (timestamp: number) => {
    if (timestamp === 0) return 'Never';
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!contractAddress) {
    return (
      <div className="card">
        <div className="card-header">
          <span>📊</span>
          <h3 className="card-title">Oracle Management</h3>
        </div>
        <p style={{ textAlign: 'center', color: '#718096' }}>
          Deploy an oracle contract to start managing price feeds
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <span>📊</span>
        <h3 className="card-title">Oracle Management</h3>
      </div>

      {/* Contract Info */}
      <div style={{ 
        background: '#edf2f7', 
        padding: '12px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div><strong>Contract:</strong> {contractAddress}</div>
        <div><strong>Data Source:</strong> {dataSource}</div>
        <div><strong>Owner:</strong> {oracleOwner.slice(0, 6)}...{oracleOwner.slice(-4)}</div>
      </div>

      {/* Current Price Display */}
      <div className="price-display">
        <div className="price-value">
          ${(latestPrice / 100).toFixed(2)}
        </div>
        <div className="price-label">
          Last updated: {formatTimestamp(lastUpdated)}
        </div>
      </div>

      {/* API Configuration */}
      <div className="form-group">
        <label className="form-label">API Endpoint</label>
        <select
          onChange={handlePresetChange}
          className="form-select"
          style={{ marginBottom: '8px' }}
        >
          <option value="">Select preset...</option>
          {API_PRESETS.map((preset, idx) => (
            <option key={idx} value={preset.url}>
              {preset.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          className="form-input"
          placeholder="Custom API URL"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Update Frequency (seconds)</label>
        <input
          type="number"
          value={updateFreq}
          onChange={(e) => setUpdateFreq(Number(e.target.value))}
          min="5"
          className="form-input"
        />
      </div>

      {/* Control Buttons */}
      <div className="grid grid-3" style={{ marginBottom: '20px' }}>
        <button
          onClick={updatePrice}
          disabled={!isConnected || isUpdating}
          className="btn btn-warning"
        >
          {isUpdating ? (
            <>
              <span className="spinner"></span>
              Updating...
            </>
          ) : (
            <>
              🔄 Update Now
            </>
          )}
        </button>

        <button
          onClick={toggleAutoUpdate}
          disabled={!isConnected}
          className={`btn ${isAutoUpdating ? 'btn-danger' : 'btn-success'}`}
        >
          {isAutoUpdating ? '⏹️ Stop Auto' : '▶️ Start Auto'}
        </button>

        <button
          onClick={loadOracleData}
          disabled={!isConnected}
          className="btn btn-secondary"
        >
          📈 Refresh Data
        </button>
      </div>

      {!isConnected && (
        <p style={{ 
          textAlign: 'center', 
          color: '#718096', 
          fontSize: '14px' 
        }}>
          Connect your wallet to manage the oracle
        </p>
      )}
    </div>
  );
};

export default OracleManager;