# Somnia Oracle Builder

A comprehensive decentralized oracle platform built for the Somnia network. This project allows you to deploy, manage, and monitor price oracles with a user-friendly web interface.

## 🌟 Features

### Smart Contracts
- **Basic Oracle**: Simple price oracle with owner-controlled updates
- **Advanced Oracle**: Multi-feed oracle with confidence levels, batch updates, and fee management
- **Somnia Network Integration**: Optimized for Somnia testnet deployment

### Frontend Application
- **Wallet Integration**: Connect with MetaMask to Somnia network
- **Oracle Deployment**: Deploy contracts directly from the web interface
- **Price Feed Management**: Add, update, and monitor multiple price feeds
- **Real-time Updates**: Automatic price updates with configurable intervals
- **Activity Logging**: Track all oracle operations and updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask wallet with Somnia testnet configured
- Some test tokens for deployment and transactions

### Somnia Network Configuration
Add Somnia testnet to your MetaMask:
- **Network Name**: Somnia Testnet
- **RPC URL**: https://dream-rpc.somnia.network/
- **Chain ID**: 50312
- **Currency Symbol**: ETH

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd somnia-oracle-builder
   ```

2. **Install contract dependencies**
   ```bash
   cd contracts
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment**
   ```bash
   cd ../contracts
   cp .env.example .env
   # Edit .env and add your private key
   ```

### Development

1. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Deploy contracts (optional)**
   ```bash
   cd contracts
   npx hardhat run scripts/deployAdvanced.ts --network somniaTestnet
   ```

3. **Open the application**
   Navigate to `http://localhost:3000`

## 📋 Usage Guide

### Basic Workflow

1. **Connect Wallet**: Click "Connect to Somnia Network" and approve the connection
2. **Deploy Oracle**: Configure your data source and deploy a new oracle contract
3. **Configure API**: Set up your price data API endpoint (CoinGecko presets available)
4. **Update Prices**: Manually update prices or enable automatic updates
5. **Monitor Activity**: Track all operations in the activity log

### Advanced Features

#### Multiple Price Feeds
The Advanced Oracle contract supports multiple price feeds with individual confidence levels:
- Add new feeds (BTC/USD, ETH/USD, etc.)
- Set confidence levels (0-100%)
- Batch update multiple feeds
- Monitor stale data warnings

#### API Integration
Supported price data sources:
- CoinGecko API (Bitcoin, Ethereum presets)
- Custom REST APIs
- Configurable update intervals

#### Fee Management
- Set update fees for price submissions
- Withdraw accumulated fees (owner only)
- Gas optimization for batch operations

## 🏗️ Architecture

### Smart Contracts (`/contracts`)
```
contracts/
├── contracts/
│   ├── Oracle.sol          # Basic price oracle
│   └── AdvancedOracle.sol  # Multi-feed oracle with advanced features
├── scripts/
│   ├── deploy.ts           # Basic oracle deployment
│   └── deployAdvanced.ts   # Advanced oracle deployment
└── hardhat.config.ts       # Hardhat configuration for Somnia
```

### Frontend (`/frontend`)
```
frontend/src/app/
├── components/
│   └── PriceFeedManager.tsx # Advanced feed management component
├── globals.css              # Tailwind CSS styles
├── layout.tsx              # App layout with metadata
└── page.tsx                # Main oracle builder interface
```

## 🔧 Configuration

### Contract Configuration
Edit `contracts/hardhat.config.ts` to modify:
- Network settings
- Compiler versions
- Gas optimization

### Frontend Configuration
Edit `frontend/next.config.ts` for:
- Build optimization
- Environment variables
- API configurations

## 📊 Monitoring & Analytics

The application provides comprehensive monitoring:
- **Real-time Price Data**: Current prices with timestamps
- **Confidence Levels**: Data quality indicators
- **Stale Data Warnings**: Alerts for outdated information
- **Transaction History**: Complete audit trail
- **Gas Usage Tracking**: Cost optimization insights

## 🛠️ Development

### Adding New Price Sources
1. Create API integration in the frontend
2. Add preset configurations
3. Test data parsing and validation

### Extending Oracle Functionality
1. Modify smart contracts in `/contracts/contracts/`
2. Update ABI in frontend components
3. Add new UI components as needed

### Testing
```bash
# Contract tests
cd contracts
npx hardhat test

# Frontend type checking
cd frontend
npm run type-check
```

## 🔐 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **API Keys**: Use environment variables for sensitive data
- **Access Control**: Oracle updates are owner-restricted by default
- **Input Validation**: All price data is validated before storage
- **Reentrancy Protection**: Advanced oracle includes reentrancy guards

## 🌐 Deployment

### Testnet Deployment
The project is configured for Somnia testnet deployment:
```bash
cd contracts
npx hardhat run scripts/deployAdvanced.ts --network somniaTestnet
```

### Production Considerations
- Use hardware wallets for mainnet deployments
- Implement multi-signature controls for critical operations
- Set up monitoring and alerting systems
- Consider oracle aggregation for improved reliability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For questions and support:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🔗 Links

- [Somnia Network Documentation](https://docs.somnia.network/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [ethers.js Documentation](https://docs.ethers.org/)