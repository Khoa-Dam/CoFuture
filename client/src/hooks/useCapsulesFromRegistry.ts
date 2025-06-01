// src/hooks/useCapsulesFromRegistry.ts
import { useEffect, useState, useCallback } from "react";
import { SuiClient } from "@mysten/sui.js/client";
import { SuiObjectResponse } from "@mysten/sui.js/client";

// ---- Dùng env hoặc hardcode registry id ----
const REGISTRY_ID =
  import.meta.env.VITE_SUI_CAPSULE_REGISTRY_OBJECT_ID || "0x..."; // Thay bằng id thật
const suiClient = new SuiClient({ url: "https://fullnode.testnet.sui.io" });
const PACKAGE_ID = import.meta.env.VITE_SUI_PACKAGE_ID || "";
const CAPSULE_TYPE = `${PACKAGE_ID}::cofuture::Capsule`;

export interface CapsuleObject {
  id: string;
  creator: string;
  encrypted_content: string;
  unlock_timestamp_ms: string;
  audience: string[];
  total_reward: string;
  reward_per_user: string;
  max_claim: string;
  claimed_count: string;
  claimed_bitmap: string[];
}

function parseCapsule(obj: SuiObjectResponse): CapsuleObject | null {
  if (
    !obj.data ||
    !obj.data.content ||
    obj.data.content.dataType !== "moveObject"
  )
    return null;
  const fields = obj.data.content.fields as any;
  return {
    id: obj.data.objectId,
    creator: fields.creator,
    encrypted_content: fields.encrypted_content,
    unlock_timestamp_ms: fields.unlock_timestamp_ms,
    audience: fields.audience,
    total_reward: fields.total_reward,
    reward_per_user: fields.reward_per_user,
    max_claim: fields.max_claim,
    claimed_count: fields.claimed_count,
    claimed_bitmap: fields.claimed_bitmap,
  };
}

export function useCapsulesFromRegistry(registryId: string) {
  const [capsules, setCapsules] = useState<CapsuleObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCapsules = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Get registry object
      const registryObj = await suiClient.getObject({
        id: registryId,
        options: { showContent: true },
      });

      if (
        !registryObj.data ||
        !registryObj.data.content ||
        registryObj.data.content.dataType !== "moveObject"
      ) {
        setCapsules([]);
        setLoading(false);
        setError("Invalid registry object");
        return;
      }

      // 2. Extract capsule ids array
      const fields = registryObj.data.content.fields as any;
      const ids = (fields.capsules as string[]) ?? [];
      if (!ids.length) {
        setCapsules([]);
        setLoading(false);
        return;
      }

      // 3. Query capsules
      const details = await suiClient.multiGetObjects({
        ids,
        options: { showContent: true },
      });
      const parsed = details
        .map(parseCapsule)
        .filter(Boolean) as CapsuleObject[];
      setCapsules(parsed);
    } catch (err: any) {
      setError(err.message || "Failed to fetch capsules");
      setCapsules([]);
    } finally {
      setLoading(false);
    }
  }, [registryId]);

  useEffect(() => {
    fetchCapsules();
  }, [fetchCapsules]);

  return { capsules, loading, error, refetch: fetchCapsules };
}
