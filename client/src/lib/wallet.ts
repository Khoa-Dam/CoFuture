import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

// Initialize Sui client
export const suiClient = new SuiClient({
  url: getFullnodeUrl('devnet'), // Use devnet for development
});

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  isConnecting: boolean;
}

export class WalletService {
  private listeners: ((state: WalletState) => void)[] = [];
  private state: WalletState = {
    isConnected: false,
    address: null,
    isConnecting: false,
  };

  subscribe(listener: (state: WalletState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState() {
    return this.state;
  }

  private setState(newState: Partial<WalletState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  async connect(): Promise<boolean> {
    this.setState({ isConnecting: true });
    
    try {
      // Check if Sui Wallet is available
      if (typeof window !== 'undefined' && (window as any).suiWallet) {
        const wallet = (window as any).suiWallet;
        
        // Request connection to Sui Wallet
        const response = await wallet.requestPermissions({
          permissions: ['viewAccount'],
        });
        
        if (response.permissions.includes('viewAccount')) {
          const accounts = await wallet.getAccounts();
          if (accounts.length > 0) {
            this.setState({ 
              isConnected: true, 
              address: accounts[0], 
              isConnecting: false 
            });
            return true;
          }
        }
      }
      
      // Fallback: Use development address if no wallet available
      const devAddress = "0x1234567890abcdef1234567890abcdef12345678";
      this.setState({ 
        isConnected: true, 
        address: devAddress, 
        isConnecting: false 
      });
      
      return true;
    } catch (error) {
      console.error('Wallet connection error:', error);
      this.setState({ isConnecting: false });
      return false;
    }
  }

  disconnect() {
    this.setState({ 
      isConnected: false, 
      address: null, 
      isConnecting: false 
    });
  }

  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Fetch NFTs from the connected wallet
  async getNFTs(address: string) {
    try {
      const objects = await suiClient.getOwnedObjects({
        owner: address,
        filter: {
          MatchAny: [
            {
              StructType: '0x2::devnet_nft::DevNetNFT'
            }
          ]
        },
        options: {
          showContent: true,
          showDisplay: true,
        }
      });

      return objects.data.map((obj: any) => ({
        id: obj.data?.objectId || '',
        name: obj.data?.display?.data?.name || 'Unknown NFT',
        collection: obj.data?.display?.data?.collection || 'Unknown Collection',
        image: obj.data?.display?.data?.image_url || obj.data?.display?.data?.image || '',
        description: obj.data?.display?.data?.description || '',
      }));
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      return [];
    }
  }
}

export const walletService = new WalletService();
