import React, { useState } from 'react';
import { ethers } from 'ethers';
import { getSigner, getProvider } from '../utils/ethereum';
import { ORACLE_ABI, ORACLE_BYTECODE } from '../contracts/OracleABI';
import { SIMPLE_ORACLE_ABI, SIMPLE_ORACLE_BYTECODE } from '../contracts/SimpleOracle';

interface OracleDeployerProps {
  isConnected: boolean;
  onOracleDeployed: (address: string) => void;
  onLog: (message: string) => void;
}

const OracleDeployer: React.FC<OracleDeployerProps> = ({ 
  isConnected, 
  onOracleDeployed, 
  onLog 
}) => {
  const [dataSource, setDataSource] = useState('CoinGecko BTC/USD');
  const [isDeploying, setIsDeploying] = useState(false);
  const [useSimpleOracle, setUseSimpleOracle] = useState(false);

  const deployOracle = async () => {
    if (!isConnected) {
      onLog('❌ Please connect your wallet first');
      return;
    }

    if (!dataSource.trim()) {
      onLog('❌ Please enter a data source name');
      return;
    }

    setIsDeploying(true);
    onLog('🚀 Starting oracle deployment...');

    try {
      // Check network and balance
      const provider = await getProvider();
      const network = await provider.getNetwork();
      onLog(`📡 Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

      if (Number(network.chainId) !== 50312) {
        onLog('⚠️ Warning: Not connected to Somnia testnet (Chain ID: 50312)');
        onLog('💡 You can still try to deploy, but it may fail on other networks');
      }

      const signer = await getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      onLog(`💰 Account balance: ${ethers.formatEther(balance)} ETH`);

      if (balance === BigInt(0)) {
        throw new Error('Insufficient balance. Please add some test ETH to your wallet.');
      }

      // Check if we can get gas price
      let gasPrice;
      try {
        const feeData = await provider.getFeeData();
        gasPrice = feeData.gasPrice;
        onLog(`⛽ Current gas price: ${ethers.formatUnits(gasPrice || 0, 'gwei')} gwei`);
      } catch (error) {
        onLog('⚠️ Could not get gas price, using default');
      }

      // Choose contract type
      const abi = useSimpleOracle ? SIMPLE_ORACLE_ABI : ORACLE_ABI;
      const bytecode = useSimpleOracle ? SIMPLE_ORACLE_BYTECODE : ORACLE_BYTECODE;
      
      onLog(`🏭 Creating ${useSimpleOracle ? 'simple' : 'full'} oracle factory...`);
      const factory = new ethers.ContractFactory(abi, bytecode, signer);

      // Deploy contract
      onLog('📦 Deploying contract...');
      let contract;
      
      if (useSimpleOracle) {
        // Simple oracle doesn't need constructor parameters
        contract = await factory.deploy({
          gasLimit: 500000
        });
      } else {
        // Full oracle needs data source parameter
        contract = await factory.deploy(dataSource, {
          gasLimit: 2000000
        });
      }

      onLog('⏳ Waiting for deployment confirmation...');
      await contract.waitForDeployment();
      const contractAddress = await contract.getAddress();

      onLog(`✅ Oracle deployed successfully!`);
      onLog(`📍 Contract address: ${contractAddress}`);
      onLog(`📊 Data source: ${dataSource}`);
      
      onOracleDeployed(contractAddress);
    } catch (error: any) {
      console.error('Deploy failed:', error);
      
      if (error.code === 'CALL_EXCEPTION') {
        onLog('❌ Deployment failed: Contract execution reverted');
        onLog('💡 This might be due to insufficient gas or network issues');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        onLog('❌ Deployment failed: Insufficient funds for gas');
      } else {
        onLog(`❌ Deployment failed: ${error.message || error.reason || 'Unknown error'}`);
      }
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <span>🚀</span>
        <h3 className="card-title">Deploy Oracle</h3>
      </div>

      <div className="form-group">
        <label className="form-label">
          <input
            type="checkbox"
            checked={useSimpleOracle}
            onChange={(e) => setUseSimpleOracle(e.target.checked)}
            disabled={isDeploying}
            style={{ marginRight: '8px' }}
          />
          Use Simple Oracle (for testing)
        </label>
        <small style={{ color: '#718096', fontSize: '12px', display: 'block', marginTop: '4px' }}>
          Simple oracle has basic functionality and lower gas costs
        </small>
      </div>

      {!useSimpleOracle && (
        <div className="form-group">
          <label className="form-label">Data Source Name</label>
          <input
            type="text"
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            className="form-input"
            placeholder="e.g., CoinGecko BTC/USD"
            disabled={isDeploying}
          />
          <small style={{ color: '#718096', fontSize: '12px' }}>
            This will be stored on-chain to identify your oracle's data source
          </small>
        </div>
      )}

      <button
        onClick={deployOracle}
        disabled={!isConnected || isDeploying || (!useSimpleOracle && !dataSource.trim())}
        className="btn btn-success"
        style={{ width: '100%' }}
      >
        {isDeploying ? (
          <>
            <span className="spinner"></span>
            Deploying Oracle...
          </>
        ) : (
          <>
            🚀 Deploy Oracle Contract
          </>
        )}
      </button>

      {!isConnected && (
        <p style={{ 
          marginTop: '12px', 
          fontSize: '14px', 
          color: '#718096', 
          textAlign: 'center' 
        }}>
          Connect your wallet to deploy an oracle
        </p>
      )}
    </div>
  );
};

export default OracleDeployer;