import React from 'react';
import { SOMNIA_NETWORK } from '../utils/ethereum';

const NetworkInfo: React.FC = () => {
  return (
    <div className="card">
      <div className="card-header">
        <span>🌐</span>
        <h3 className="card-title">Somnia Network Info</h3>
      </div>

      <div className="network-info">
        <div className="network-item">
          <div className="network-label">Network Name</div>
          <div className="network-value">{SOMNIA_NETWORK.name}</div>
        </div>
        
        <div className="network-item">
          <div className="network-label">Chain ID</div>
          <div className="network-value">{SOMNIA_NETWORK.chainId}</div>
        </div>
        
        <div className="network-item">
          <div className="network-label">RPC URL</div>
          <div className="network-value" style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {SOMNIA_NETWORK.rpcUrl}
          </div>
        </div>
        
        <div className="network-item">
          <div className="network-label">Currency</div>
          <div className="network-value">{SOMNIA_NETWORK.currency}</div>
        </div>
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: '#e6fffa', borderRadius: '8px' }}>
        <p style={{ fontSize: '14px', color: '#234e52', margin: 0 }}>
          💡 <strong>Need test ETH?</strong> Visit the Somnia testnet faucet to get free tokens for testing.
        </p>
      </div>
    </div>
  );
};

export default NetworkInfo;