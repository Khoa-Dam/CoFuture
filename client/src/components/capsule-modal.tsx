import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Gift,
  Download,
  Share,
  Coins,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CapsuleModalProps {
  capsule: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClaim?: () => Promise<void>; // thêm prop này
}

export function CapsuleModal({
  capsule,
  open,
  onOpenChange,
  onClaim,
}: CapsuleModalProps) {
  const { toast } = useToast();

  if (!capsule) return null;

  const handleClaim = async () => {
    if (onClaim) await onClaim();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Time Capsule: ${capsule.title}`,
        text: `Check out this time capsule on CoFuture!`,
        url: window.location.href,
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Capsule link copied to clipboard!",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyan-400">
            {capsule.status === "claimed"
              ? "Time Capsule Opened"
              : "Time Capsule Unlocked!"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Unlock Animation Area */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute inset-2 bg-slate-800 rounded-full flex items-center justify-center">
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Gift className="text-4xl text-cyan-400" />
                </motion.div>
              </div>
            </div>
            <h4 className="text-xl font-semibold mb-2 text-white">
              {capsule.title}
            </h4>
            <p className="text-gray-400">
              {capsule.status === "claimed" && capsule.claimedAt
                ? `Opened on ${format(
                    new Date(capsule.claimedAt),
                    "MMMM d, yyyy"
                  )}`
                : `Unlocked on ${format(
                    new Date(capsule.unlockDate),
                    "MMMM d, yyyy"
                  )}`}
            </p>
          </div>

          {/* Message Content */}
          <div className="bg-slate-900 rounded-lg p-6">
            <h5 className="font-semibold mb-3 text-cyan-400">Your Message:</h5>
            <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {capsule.message}
            </div>
          </div>

          {/* Assets */}
          {(capsule.tokenAmount || capsule.nftId) && (
            <div className="space-y-4">
              <h5 className="font-semibold text-cyan-400">Included Assets:</h5>

              {/* Token Asset */}
              {capsule.tokenAmount && (
                <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                      <Coins className="text-white text-xl" />
                    </div>
                    <div>
                      <h6 className="font-medium text-white">
                        {capsule.tokenAmount} SUI
                      </h6>
                      <p className="text-sm text-gray-400">SUI Tokens</p>
                    </div>
                  </div>
                  {capsule.status === "unlockable" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Claim Tokens
                    </Button>
                  )}
                </div>
              )}

              {/* NFT Asset */}
              {capsule.nftId && (
                <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <ImageIcon className="text-white text-xl" />
                    </div>
                    <div>
                      <h6 className="font-medium text-white">
                        {capsule.nftName}
                      </h6>
                      <p className="text-sm text-gray-400">
                        {capsule.nftCollection}
                      </p>
                    </div>
                  </div>
                  {capsule.status === "unlockable" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      Claim NFT
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            {capsule.status === "unlockable" && (
              <Button
                onClick={handleClaim}
                className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white font-semibold transition-all duration-300"
              >
                <Download className="mr-2 h-4 w-4" />
                Claim All Assets
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleShare}
              className="px-6 border-gray-600 hover:border-cyan-400 text-gray-300 hover:text-white transition-all"
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
