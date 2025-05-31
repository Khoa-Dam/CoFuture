import {
  useCurrentAccount,
  useSuiClientContext,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useState } from "react";

export interface TransactionResult {
  loading: boolean;
  error: string | null;
  success: boolean;
  txId?: string;
  rawResponse?: any;
}

export interface SendCapsuleParams {
  vaultId: string;
  encryptedContent: Uint8Array;
  unlockDurationMs: number;
  audience: string[];
  rewardPerUser: number;
  coinId: string;
  clockId: string;
}

export interface ClaimCapsuleParams {
  vaultId: string;
  capsuleId: string;
  clockId: string;
}

export function useWalletAdapter() {
  const currentAccount = useCurrentAccount();
  const clientContext = useSuiClientContext();
  const currentNetwork = clientContext.network || "testnet";
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

  const [txResult, setTxResult] = useState<TransactionResult>({
    loading: false,
    error: null,
    success: false,
  });

  // Get packageId from env or use empty as default
  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "";

  // Transaction handler logic (can be used for all functions)
  const handleTransaction = async (tx: TransactionBlock) => {
    setTxResult({ loading: true, error: null, success: false });
    try {
      const result = await signAndExecute({ transaction: tx.serialize() });
      setTxResult({
        loading: false,
        error: null,
        success: true,
        txId: result.digest,
        rawResponse: result,
      });
      return { digest: result.digest, success: true, rawResponse: result };
    } catch (err: any) {
      setTxResult({
        loading: false,
        error: err.message || "Transaction failed",
        success: false,
      });
      throw err;
    }
  };

  // Deposit more funds into the vault
  const depositToVault = async (
    vaultId: string,
    coinId: string,
    amount: number
  ) => {
    if (!currentAccount) throw new Error("Please connect your Sui wallet");
    const tx = new TransactionBlock();
    const amountInMist = BigInt(Math.floor(amount * 1_000_000_000));
    const [coin] = tx.splitCoins(tx.object(coinId), [amountInMist]);
    tx.moveCall({
      target: `${PACKAGE_ID}::cofuture::deposit`,
      arguments: [tx.object(vaultId), coin, tx.pure(amountInMist)],
    });
    return handleTransaction(tx);
  };

  // Send a capsule
  const sendCapsule = async (params: SendCapsuleParams) => {
    if (!currentAccount) throw new Error("Please connect your Sui wallet");
    const tx = new TransactionBlock();
    const totalReward = BigInt(params.rewardPerUser * params.audience.length);
    const [coin] = tx.splitCoins(tx.object(params.coinId), [totalReward]);
    tx.moveCall({
      target: `${PACKAGE_ID}::cofuture::send_capsule`,
      arguments: [
        tx.object(params.vaultId),
        coin,
        tx.pure(params.encryptedContent),
        tx.pure(params.unlockDurationMs),
        tx.pure(params.audience),
        tx.pure(params.rewardPerUser),
        tx.object(params.clockId),
      ],
    });
    return handleTransaction(tx);
  };

  // Claim a capsule
  const claimCapsule = async (params: ClaimCapsuleParams) => {
    if (!currentAccount) throw new Error("Please connect your Sui wallet");
    const tx = new TransactionBlock();
    tx.moveCall({
      target: `${PACKAGE_ID}::cofuture::claim_capsule`,
      arguments: [
        tx.object(params.vaultId),
        tx.object(params.capsuleId),
        tx.object(params.clockId),
      ],
    });
    return handleTransaction(tx);
  };

  return {
    isConnected: !!currentAccount,
    walletAddress: currentAccount?.address,
    network: currentNetwork,
    txResult,
    depositToVault,
    sendCapsule,
    claimCapsule,
  };
}
