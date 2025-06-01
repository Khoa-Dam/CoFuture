// CapsuleList.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CapsuleCard } from "@/components/capsule-card";
import { CapsuleModal } from "@/components/capsule-modal";
import { useWalletAdapter } from "@/hooks/useWalletAdapter";
import { useCapsulesFromRegistry } from "@/hooks/useCapsulesFromRegistry"; // <-- Sử dụng hook mới
import { formatISO } from "date-fns";

const REGISTRY_ID =
  import.meta.env.VITE_SUI_CAPSULE_REGISTRY_OBJECT_ID || "0x1"; // Thay bằng real id

type FilterType = "all" | "locked" | "unlockable" | "claimed";

function hexToBytes(hex: string): Uint8Array {
  if (!hex) return new Uint8Array();
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  if (cleanHex.length % 2 !== 0) return new Uint8Array();
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++)
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  return bytes;
}

function transformToCapsule(raw: any) {
  console.log("rawdfasdfasfas", raw);
  const now = Date.now();
  const unlockTimestampMs = Number(raw.unlock_timestamp_ms);
  const claimedCount = Number(raw.claimed_count);
  const maxClaim = Number(raw.max_claim);

  let status: "locked" | "unlockable" | "claimed" = "locked";
  if (now >= unlockTimestampMs) {
    if (claimedCount < maxClaim) status = "unlockable";
    else status = "claimed";
  }

  let message = "";
  if (typeof raw.encrypted_content === "string") {
    // hex string
    const hex = raw.encrypted_content;
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    const bytes = new Uint8Array(
      cleanHex.match(/.{1,2}/g).map((b: any) => parseInt(b, 16))
    );
    message = new TextDecoder().decode(bytes);
  } else if (Array.isArray(raw.encrypted_content)) {
    // array số
    message = new TextDecoder().decode(new Uint8Array(raw.encrypted_content));
  } else {
    message = "< undecodable >";
  }
  const isPrivate =
    raw.audience.length === 1 && raw.audience[0] === raw.creator;

  return {
    id: raw.id,
    creatorAddress: raw.creator,
    unlockDate: formatISO(new Date(unlockTimestampMs)),
    status,
    title: "",
    message,
    isPrivate: raw.audience.length === 1 && raw.audience[0] === raw.creator,
    tokenAmount: raw.total_reward !== "0" ? raw.total_reward : undefined,
    nftId: null,
    nftName: null,
    nftCollection: null,
    createdAt: formatISO(new Date()),
    claimedAt: status === "claimed" ? formatISO(new Date()) : null,
  };
}

export default function CapsuleList() {
  const {
    capsules: rawCapsules,
    loading,
    error,
    refetch,
  } = useCapsulesFromRegistry(REGISTRY_ID);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedCapsule, setSelectedCapsule] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { claimCapsule } = useWalletAdapter();

  const transformedCapsules = useMemo(
    () => rawCapsules.map(transformToCapsule),
    [rawCapsules]
  );
  const filteredCapsules = useMemo(() => {
    if (filter === "all") return transformedCapsules;
    return transformedCapsules.filter((c) => c.status === filter);
  }, [transformedCapsules, filter]);

  const getFilterButtonClass = (f: FilterType) =>
    `px-6 py-2 rounded-md transition-all ${
      filter === f
        ? "bg-cyan-400 text-slate-900 font-medium"
        : "text-gray-400 hover:text-white"
    }`;

  if (loading)
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading Capsules...</h2>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-500">
            Error Loading Capsules
          </h2>
          <p className="text-gray-400">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          {/* ... filter + refresh button giữ nguyên ... */}
        </div>
        {filteredCapsules.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {filteredCapsules.map((capsule, index) => (
              <motion.div
                key={capsule.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <CapsuleCard
                  capsule={capsule}
                  onOpen={() => {
                    setSelectedCapsule(capsule);
                    setModalOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          // ... empty state giữ nguyên ...
          <></>
        )}

        <CapsuleModal
          capsule={selectedCapsule}
          open={modalOpen}
          onOpenChange={setModalOpen}
          onClaim={async () => {
            if (!selectedCapsule) return;
            // Gọi tx claim từ useWalletAdapter
            await claimCapsule({
              vaultId: import.meta.env.VITE_SUI_VAULT_OBJECT_ID,
              capsuleId: selectedCapsule.id,
              clockId: "0x6",
            });
            setModalOpen(false);
            refetch();
          }}
        />
      </div>
    </div>
  );
}
