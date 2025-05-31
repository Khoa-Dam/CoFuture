import {
  useCurrentAccount,
  useConnectWallet,
  useDisconnectWallet,
} from "@mysten/dapp-kit";

export function useSuiWallet() {
  const currentAccount = useCurrentAccount();
  const { mutate: connect, isPending: isConnecting } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();

  return {
    isConnected: !!currentAccount,
    address: currentAccount?.address || null,
    isConnecting: isConnecting,
    connect,
    disconnect,
    // formatAddress can be a utility function if needed
    formatAddress: (address: string | null) =>
      address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
    // You might add functions here to interact with suiClient based on connected account
    // For example, fetching balance or NFTs using suiClient and currentAccount
  };
}
