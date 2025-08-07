import { ethers } from 'ethers';

// Base Network Configuration
const BASE_RPC_URL = 'https://mainnet.base.org';
const BASE_CHAIN_ID = 8453;

// StuFind Token Contract (placeholder - would be deployed on Base)
const STUFIND_TOKEN_ADDRESS = '0x...'; // Replace with actual deployed contract
const ESCROW_CONTRACT_ADDRESS = '0x...'; // Replace with actual deployed contract

// ABI for StuFind Token
const STUFIND_TOKEN_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'event Transfer(address indexed from, address indexed to, uint256 value)'
];

// ABI for Escrow Contract
const ESCROW_ABI = [
  'function createEscrow(uint256 opportunityId, uint256 amount) payable returns (uint256 escrowId)',
  'function releaseFunds(uint256 escrowId) returns (bool)',
  'function refundBuyer(uint256 escrowId) returns (bool)',
  'function getEscrow(uint256 escrowId) view returns (address buyer, address seller, uint256 amount, bool released, bool refunded)',
  'event EscrowCreated(uint256 indexed escrowId, uint256 indexed opportunityId, address indexed buyer, uint256 amount)',
  'event FundsReleased(uint256 indexed escrowId, address indexed seller)',
  'event FundsRefunded(uint256 indexed escrowId, address indexed buyer)'
];

class BlockchainClient {
  private provider: ethers.providers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(BASE_RPC_URL);
  }

  // Connect wallet
  async connectWallet(): Promise<string | null> {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.signer = this.provider.getSigner();
        const address = await this.signer.getAddress();
        return address;
      } else {
        throw new Error('MetaMask not found');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  }

  // Get user's StuFind token balance
  async getTokenBalance(userAddress: string): Promise<number> {
    try {
      const tokenContract = new ethers.Contract(
        STUFIND_TOKEN_ADDRESS,
        STUFIND_TOKEN_ABI,
        this.provider
      );
      const balance = await tokenContract.balanceOf(userAddress);
      return parseFloat(ethers.utils.formatEther(balance));
    } catch (error) {
      console.error('Error getting token balance:', error);
      return 0;
    }
  }

  // Create escrow for opportunity purchase
  async createEscrow(opportunityId: string, amount: number, sellerAddress: string): Promise<string | null> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const escrowContract = new ethers.Contract(
        ESCROW_CONTRACT_ADDRESS,
        ESCROW_ABI,
        this.signer
      );

      const amountWei = ethers.utils.parseEther(amount.toString());
      
      const tx = await escrowContract.createEscrow(opportunityId, amountWei, {
        value: amountWei
      });

      const receipt = await tx.wait();
      
      // Find the EscrowCreated event
      const event = receipt.events?.find((e: any) => e.event === 'EscrowCreated');
      if (event) {
        return event.args.escrowId.toString();
      }
      
      return null;
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    }
  }

  // Release funds to seller (when buyer confirms receipt)
  async releaseFunds(escrowId: string): Promise<boolean> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const escrowContract = new ethers.Contract(
        ESCROW_CONTRACT_ADDRESS,
        ESCROW_ABI,
        this.signer
      );

      const tx = await escrowContract.releaseFunds(escrowId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error releasing funds:', error);
      return false;
    }
  }

  // Refund buyer (when there's a dispute or issue)
  async refundBuyer(escrowId: string): Promise<boolean> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    try {
      const escrowContract = new ethers.Contract(
        ESCROW_CONTRACT_ADDRESS,
        ESCROW_ABI,
        this.signer
      );

      const tx = await escrowContract.refundBuyer(escrowId);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Error refunding buyer:', error);
      return false;
    }
  }

  // Get escrow details
  async getEscrowDetails(escrowId: string) {
    try {
      const escrowContract = new ethers.Contract(
        ESCROW_CONTRACT_ADDRESS,
        ESCROW_ABI,
        this.provider
      );

      const escrow = await escrowContract.getEscrow(escrowId);
      return {
        buyer: escrow.buyer,
        seller: escrow.seller,
        amount: parseFloat(ethers.utils.formatEther(escrow.amount)),
        released: escrow.released,
        refunded: escrow.refunded
      };
    } catch (error) {
      console.error('Error getting escrow details:', error);
      return null;
    }
  }

  // Check if wallet is connected to Base network
  async checkNetwork(): Promise<boolean> {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return parseInt(chainId, 16) === BASE_CHAIN_ID;
      }
      return false;
    } catch (error) {
      console.error('Error checking network:', error);
      return false;
    }
  }

  // Switch to Base network
  async switchToBaseNetwork(): Promise<boolean> {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error switching network:', error);
      return false;
    }
  }
}

export const blockchainClient = new BlockchainClient();

// Add ethereum to window type
declare global {
  interface Window {
    ethereum?: any;
  }
} 