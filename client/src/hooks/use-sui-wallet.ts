import {
  useCurrentAccount,
  useDisconnectWallet,
  useConnectWallet,
} from "@mysten/dapp-kit";

export function useSuiWallet() {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: connect, isPending: isConnecting } = useConnectWallet();

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return {
    isConnected: !!currentAccount,
    address: currentAccount?.address || undefined,
    disconnect,
    connect,
    isConnecting,
    formatAddress,
    account: currentAccount,
  };
}
