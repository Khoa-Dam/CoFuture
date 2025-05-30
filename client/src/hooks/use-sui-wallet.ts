import { useCurrentAccount, useConnectWallet, useDisconnectWallet } from '@mysten/dapp-kit';

export function useSuiWallet() {
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    isConnected: !!currentAccount,
    address: currentAccount?.address || null,
    connect: () => connect({ wallet: 'Sui Wallet' }),
    disconnect,
    formatAddress,
    account: currentAccount,
  };
}