import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CapsuleCard } from "@/components/capsule-card";
import { CapsuleModal } from "@/components/capsule-modal";
import { useSuiWallet } from "@/hooks/use-wallet";

type FilterType = "all" | "locked" | "unlockable" | "claimed";

export default function CapsuleList() {
  const { address, isConnected } = useSuiWallet();
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedCapsule, setSelectedCapsule] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredCapsules: any[] = [];

  const handleOpenCapsule = (capsule: any) => {
    console.log("Simulating opening capsule:", capsule);
    setModalOpen(true);
  };

  const getFilterButtonClass = (filterType: FilterType) => {
    const baseClass = "px-6 py-2 rounded-md transition-all";
    if (filter === filterType) {
      return `${baseClass} bg-cyan-400 text-slate-900 font-medium`;
    }
    return `${baseClass} text-gray-400 hover:text-white`;
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-400">
            Please connect your wallet to view your time capsules.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">My Time Capsules</h2>
            <p className="text-gray-400 text-lg">
              Track your messages through time
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            className="flex bg-slate-800 rounded-lg p-1 mt-4 md:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              variant="ghost"
              onClick={() => setFilter("all")}
              className={getFilterButtonClass("all")}
            >
              All
            </Button>
            <Button
              variant="ghost"
              onClick={() => setFilter("locked")}
              className={getFilterButtonClass("locked")}
            >
              Locked
            </Button>
            <Button
              variant="ghost"
              onClick={() => setFilter("unlockable")}
              className={getFilterButtonClass("unlockable")}
            >
              Ready
            </Button>
            <Button
              variant="ghost"
              onClick={() => setFilter("claimed")}
              className={getFilterButtonClass("claimed")}
            >
              Claimed
            </Button>
          </motion.div>
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
                <CapsuleCard capsule={capsule} onOpen={handleOpenCapsule} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-xl font-semibold mb-4">No Capsules Found</h3>
            <p className="text-gray-400 mb-8">
              {filter === "all"
                ? "You haven't created any time capsules yet."
                : `No ${filter} capsules found.`}
            </p>
            <Button
              onClick={() => (window.location.href = "/send")}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white"
            >
              Create Your First Capsule
            </Button>
          </motion.div>
        )}

        <CapsuleModal
          capsule={selectedCapsule}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      </div>
    </div>
  );
}
