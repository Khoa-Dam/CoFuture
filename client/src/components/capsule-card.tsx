import { motion } from "framer-motion";
import {
  Lock,
  Unlock,
  CheckCircle,
  Clock,
  Coins,
  Image as ImageIcon,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Capsule } from "@shared/schema";
import { format, formatDistanceToNow } from "date-fns";

interface CapsuleCardProps {
  capsule: Capsule;
  onOpen?: (capsule: Capsule) => void;
}

export function CapsuleCard({ capsule, onOpen }: CapsuleCardProps) {
  const unlockDate = new Date(capsule.unlockDate);
  const now = new Date();
  const isUnlocked = unlockDate <= now;
  const timeRemaining = isUnlocked
    ? null
    : formatDistanceToNow(unlockDate, { addSuffix: false });

  const getStatusIcon = () => {
    switch (capsule.status) {
      case "locked":
        return <Lock className="h-4 w-4 text-gray-400" />;
      case "unlockable":
        return <Unlock className="h-4 w-4 text-cyan-400 animate-pulse" />;
      case "claimed":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Lock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (capsule.status) {
      case "locked":
        return "capsule-locked";
      case "unlockable":
        return "capsule-unlockable";
      case "claimed":
        return "capsule-claimed";
      default:
        return "capsule-locked";
    }
  };

  const getStatusText = () => {
    switch (capsule.status) {
      case "locked":
        return "Locked";
      case "unlockable":
        return "Ready to Open!";
      case "claimed":
        return "Claimed";
      default:
        return "Locked";
    }
  };

  const getBadgeText = () => {
    switch (capsule.status) {
      case "locked":
        return timeRemaining ? `${timeRemaining} left` : "Locked";
      case "unlockable":
        return "Available";
      case "claimed":
        return "Opened";
      default:
        return "Locked";
    }
  };

  return (
    <motion.div
      className={`bg-slate-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all duration-300 ${
        capsule.status === "unlockable"
          ? "border-cyan-400/50 hover:border-cyan-400 animate-glow"
          : ""
      } ${capsule.status === "claimed" ? "opacity-75" : ""}`}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <div className={`h-2 ${getStatusColor()}`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span
              className={`text-sm font-medium ${
                capsule.status === "unlockable"
                  ? "text-cyan-400"
                  : capsule.status === "claimed"
                  ? "text-green-400"
                  : "text-gray-400"
              }`}
            >
              {getStatusText()}
            </span>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs ${
              capsule.status === "unlockable"
                ? "bg-cyan-400/20 text-cyan-400"
                : capsule.status === "claimed"
                ? "bg-green-400/20 text-green-400"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {getBadgeText()}
          </Badge>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">
          {capsule.title}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {capsule.message.length > 100
            ? `${capsule.message.substring(0, 100)}...`
            : capsule.message}
        </p>

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="text-gray-400">
            {capsule.status === "claimed" ? "Opened: " : "Unlocks: "}
            <span className="text-white">
              {capsule.status === "claimed" && capsule.claimedAt
                ? format(new Date(capsule.claimedAt), "MMM d, yyyy")
                : format(unlockDate, "MMM d, yyyy")}
            </span>
          </span>

          <div className="flex items-center space-x-3">
            {capsule.tokenAmount && (
              <div className="flex items-center space-x-1">
                <Coins className="h-4 w-4 text-yellow-400" />
                <span className="text-white">{capsule.tokenAmount} SUI</span>
              </div>
            )}
            {capsule.nftId && (
              <div className="flex items-center space-x-1">
                <ImageIcon className="h-4 w-4 text-purple-400" />
                <span className="text-white">NFT</span>
              </div>
            )}
            {!capsule.tokenAmount && !capsule.nftId && (
              <div className="flex items-center space-x-1">
                <FileText className="h-4 w-4 text-blue-400" />
                <span className="text-white">Message</span>
              </div>
            )}
          </div>
        </div>

        {capsule.status === "unlockable" && onOpen && (
          <Button
            onClick={() => onOpen(capsule)}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white font-medium transition-all duration-300"
          >
            <Unlock className="mr-2 h-4 w-4" />
            Open Capsule
          </Button>
        )}

        {capsule.status === "claimed" && (
          <Button
            variant="outline"
            className="w-full text-cyan-400 border-gray-600 hover:border-cyan-400 hover:text-white transition-all"
            onClick={() => onOpen && onOpen(capsule)}
          >
            View Details →
          </Button>
        )}
      </div>
    </motion.div>
  );
}
