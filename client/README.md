# Oracle Builder Client (React)

An alternative React.js frontend for the Somnia Oracle Builder, providing a different UI approach compared to the Next.js version.

## 🌟 Features

### Modern React Architecture
- **Component-based Design**: Modular, reusable components
- **TypeScript Support**: Full type safety and better developer experience
- **Custom CSS**: Beautiful glassmorphism design with animations
- **Responsive Layout**: Works perfectly on desktop and mobile

### Oracle Management
- **Wallet Integration**: Seamless MetaMask connection with network switching
- **Contract Deployment**: Deploy oracles directly from the interface
- **Price Updates**: Manual and automatic price feed management
- **Real-time Monitoring**: Live activity logs and status updates

### Enhanced UX
- **Visual Feedback**: Loading states, success animations, and error handling
- **Activity Logging**: Comprehensive operation tracking
- **Network Detection**: Automatic Somnia network validation
- **API Presets**: Built-in configurations for popular price feeds

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MetaMask browser extension
- Some test ETH on Somnia testnet

### Installation

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open application**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
client/
├── public/
│   ├── index.html          # Main HTML template
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # React components
│   │   ├── WalletConnection.tsx    # Wallet management
│   │   ├── OracleDeployer.tsx      # Contract deployment
│   │   ├── OracleManager.tsx       # Price feed management
│   │   ├── ActivityLog.tsx         # Operation logging
│   │   └── NetworkInfo.tsx         # Network information
│   ├── contracts/
│   │   └── OracleABI.ts           # Contract ABI and bytecode
│   ├── types/
│   │   └── ethereum.d.ts          # TypeScript declarations
│   ├── utils/
│   │   └── ethereum.ts            # Ethereum utilities
│   ├── App.tsx                    # Main application component
│   ├── App.css                    # Application styles
│   ├── index.tsx                  # React entry point
│   └── index.css                  # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

## 🎨 Design Philosophy

### Glassmorphism UI
- Semi-transparent cards with backdrop blur
- Gradient backgrounds and smooth animations
- Modern, clean aesthetic with excellent readability

### Component Architecture
- **WalletConnection**: Handles MetaMask integration and network switching
- **OracleDeployer**: Manages contract deployment with detailed feedback
- **OracleManager**: Controls price updates and monitoring
- **ActivityLog**: Provides real-time operation tracking
- **NetworkInfo**: Displays Somnia network details

### User Experience
- **Progressive Disclosure**: Information revealed as needed
- **Visual Hierarchy**: Clear information organization
- **Responsive Design**: Adapts to all screen sizes
- **Accessibility**: Keyboard navigation and screen reader support

## 🔧 Configuration

### API Endpoints
The application includes presets for:
- Bitcoin (CoinGecko)
- Ethereum (CoinGecko)
- Solana (CoinGecko)

Custom API endpoints can be configured through the interface.

### Network Settings
Configured for Somnia testnet:
- **Chain ID**: 50312
- **RPC URL**: https://dream-rpc.somnia.network/
- **Currency**: ETH

## 🛠️ Development

### Available Scripts
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run test suite
- `npm eject` - Eject from Create React App

### Adding New Features
1. Create component in `src/components/`
2. Add necessary types in `src/types/`
3. Update main App.tsx if needed
4. Add styles to component or global CSS

### Customization
- **Styling**: Modify `src/index.css` and `src/App.css`
- **Components**: Update individual component files
- **API Integration**: Extend `src/utils/ethereum.ts`

## 🔐 Security

### Best Practices
- Private keys never stored or transmitted
- All transactions require user confirmation
- Input validation on all forms
- Secure API endpoint handling

### Network Safety
- Automatic network validation
- Clear warnings for wrong networks
- Balance checking before operations
- Gas estimation with safety buffers

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers with MetaMask mobile app
- Tablet devices with touch optimization

## 🤝 Comparison with Next.js Version

### React Client Advantages
- **Simpler Architecture**: Traditional React app structure
- **Custom Styling**: Full control over CSS and animations
- **Component Focus**: Modular, reusable component design
- **Development Speed**: Faster hot reload and development

### Next.js Frontend Advantages
- **SSR/SSG**: Server-side rendering capabilities
- **Built-in Optimization**: Automatic code splitting and optimization
- **Routing**: File-based routing system
- **Production Ready**: Better SEO and performance out of the box

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Drag and drop the `build` folder
- **Netlify**: Connect GitHub repository for auto-deployment
- **GitHub Pages**: Use `gh-pages` package for deployment
- **Traditional Hosting**: Upload `build` folder contents

## 🐛 Troubleshooting

### Common Issues
1. **MetaMask not detected**: Ensure MetaMask is installed and enabled
2. **Network errors**: Check Somnia testnet configuration
3. **Transaction failures**: Verify sufficient balance and gas limits
4. **API errors**: Check internet connection and API endpoint validity

### Debug Mode
Enable detailed logging by opening browser developer tools and checking the console for detailed error messages.

## 📄 License

This project is licensed under the MIT License - see the main project LICENSE file for details.

## 🔗 Links

- [Somnia Network Documentation](https://docs.somnia.network/)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [ethers.js Documentation](https://docs.ethers.org/)