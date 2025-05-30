import { useState, useEffect } from "react";
import { walletService, type WalletState } from "@/lib/wallet";

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>(walletService.getState());

  useEffect(() => {
    const unsubscribe = walletService.subscribe(setWalletState);
    return unsubscribe;
  }, []);

  const connect = async () => {
    return await walletService.connect();
  };

  const disconnect = () => {
    walletService.disconnect();
  };

  return {
    ...walletState,
    connect,
    disconnect,
    formatAddress: walletService.formatAddress,
  };
}
