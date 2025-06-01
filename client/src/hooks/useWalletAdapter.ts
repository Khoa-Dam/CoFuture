import {
  useCurrentAccount,
  useSuiClientContext,
  useSuiClient,
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
interface SendCapsuleResult {
  digest: string;
  success: boolean;
  capsuleId?: string; // Add capsuleId to the return type
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
  const suiClient = useSuiClient();
  const currentNetwork = "testnet";
  const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });

  const [txResult, setTxResult] = useState<TransactionResult>({
    loading: false,
    error: null,
    success: false,
  });

  // Get packageId from env or use empty as default
  const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "";
  console.log("PACKAGE_ID", PACKAGE_ID);

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
      return result;
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
    const [coin] = tx.splitCoins(tx.gas, [amountInMist]);
    tx.moveCall({
      target: `${PACKAGE_ID}::cofuture::deposit`,
      arguments: [tx.object(vaultId), coin, tx.pure(amountInMist)],
    });
    return handleTransaction(tx);
  };

  // Send a capsule
  const sendCapsule = async (
    params: SendCapsuleParams & { registryId: string }
  ): Promise<SendCapsuleResult> => {
    if (!currentAccount) throw new Error("Please connect your Sui wallet");
    const tx = new TransactionBlock();
    const totalReward = BigInt(params.rewardPerUser * params.audience.length);

    // 1. Split coin
    const splitCoinResult = tx.splitCoins(tx.gas, [totalReward]);

    // 2. Call send_capsule với đủ tham số
    tx.moveCall({
      target: `${PACKAGE_ID}::cofuture::send_capsule`,
      arguments: [
        tx.object(params.vaultId),
        splitCoinResult[0],
        tx.pure(Array.from(params.encryptedContent)),
        tx.pure(params.unlockDurationMs),
        tx.pure(params.audience),
        tx.pure(params.rewardPerUser),
        tx.object(params.clockId),
        tx.object(params.registryId), // THÊM THAM SỐ registry vào đây!
      ],
    });

    // 3. Transfer coin trả lại nếu cần
    tx.transferObjects([splitCoinResult[0]], tx.pure(currentAccount.address));

    const result = await handleTransaction(tx);

    let capsuleId: string | undefined;
    if (result?.objectChanges) {
      for (const change of result.objectChanges) {
        // Assuming the Capsule is a created object with a specific type name
        if (
          change.type === "created" &&
          change.objectType.includes("::cofuture::Capsule")
        ) {
          capsuleId = change.objectId;
          break;
        }
      }
    }

    return {
      digest: result.digest,
      success: true,
      capsuleId: capsuleId,
    };
  };

  // Claim a capsule
  const claimCapsule = async (params: ClaimCapsuleParams) => {
    console.log("claimCapsule", params);
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
