# Escrow Contract Deployment Guide

## Prerequisites

1. **Node.js and npm/yarn** installed
2. **Private key** for deployment (with ETH for gas fees)
3. **Basescan API key** (optional, for contract verification)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file:**
   Create a `.env` file in the root directory with:
   ```
   PRIVATE_KEY=your_private_key_here
   BASESCAN_API_KEY=your_basescan_api_key_here
   ```

3. **Compile contracts:**
   ```bash
   npm run compile
   ```

## Deployment

### Deploy to Base Sepolia (Testnet)

1. **Get testnet ETH:**
   - Visit [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet)
   - Request testnet ETH to your wallet

2. **Deploy contract:**
   ```bash
   npm run deploy:base-sepolia
   ```

3. **Verify contract (optional):**
   ```bash
   npm run verify:base-sepolia <CONTRACT_ADDRESS>
   ```

### Deploy to Base Mainnet

1. **Ensure you have ETH for gas fees**

2. **Deploy contract:**
   ```bash
   npm run deploy:base
   ```

3. **Verify contract (optional):**
   ```bash
   npm run verify:base <CONTRACT_ADDRESS>
   ```

## Update Application

After deployment, update the contract address in:
`src/integrations/blockchain/client.ts`

Replace:
```typescript
const ESCROW_CONTRACT_ADDRESS = '0x...'; // Replace with actual deployed contract
```

With your deployed contract address.

## Contract Features

- **Escrow Management**: Create, release, and refund escrow transactions
- **Platform Fees**: 2.5% platform fee (configurable by owner)
- **Security**: Only buyer/seller can release/refund funds
- **Transparency**: All transactions are recorded on-chain

## Testing

Test the deployed contract using the frontend application or interact directly with the contract using tools like:
- [Basescan](https://basescan.org) (mainnet)
- [Base Sepolia Explorer](https://sepolia.basescan.org) (testnet)

## Security Notes

- Keep your private key secure
- Test thoroughly on testnet before mainnet deployment
- Consider using a multisig wallet for production deployments
- Regular security audits recommended for production use

