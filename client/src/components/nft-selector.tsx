import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  Upload,
  Image as ImageIcon,
  Search,
  Loader2,
} from "lucide-react";
import { useSuiWallet } from "@/hooks/use-sui-wallet";

interface NFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  description?: string;
}

interface NFTSelectorProps {
  onSelectNFT: (nft: NFT) => void;
  onUploadImage: (file: File) => void;
}

export function NFTSelector({ onSelectNFT, onUploadImage }: NFTSelectorProps) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [walletNFTs, setWalletNFTs] = useState<NFT[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const { isConnected, address } = useSuiWallet();

  // Simulate fetching NFTs when wallet is connected
  useEffect(() => {
    const fetchNFTs = async () => {
      if (isConnected && address) {
        setIsLoadingNFTs(true);
        // Simulate a delay and return dummy data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setWalletNFTs([
          {
            id: "1",
            name: "Simulated NFT 1",
            collection: "Gallery A",
            image: "",
          },
          {
            id: "2",
            name: "Simulated NFT 2",
            collection: "Gallery B",
            image: "",
          },
          {
            id: "3",
            name: "Simulated NFT 3",
            collection: "Gallery A",
            image: "",
          },
        ]);
        setIsLoadingNFTs(false);
        // try {
        //   const nfts = await walletService.getNFTs(address);
        //   setWalletNFTs(nfts);
        // } catch (error) {
        //   console.error('Failed to fetch NFTs:', error);
        //   setWalletNFTs([]);
        // } finally {
        //   setIsLoadingNFTs(false);
        // }
      }
    };

    if (isWalletModalOpen) {
      fetchNFTs();
    }
  }, [isConnected, address, isWalletModalOpen]);

  const filteredNFTs = walletNFTs.filter(
    (nft) =>
      nft.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  const handleNFTSelect = (nft: NFT) => {
    onSelectNFT(nft);
    setIsWalletModalOpen(false);
  };

  return (
    // Thay đổi đoạn grid NFT và layout chính như sau:

    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <Dialog open={isWalletModalOpen} onOpenChange={setIsWalletModalOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!isConnected}
              className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white disabled:opacity-50"
            >
              <Wallet className="mr-2 h-4" />
              From Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-800 border-gray-700 max-w-md sm:max-w-2xl lg:max-w-4xl max-h-[80vh] rounded-2xl p-2 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl font-bold text-cyan-400">
                Select NFT from Wallet
              </DialogTitle>
              <DialogDescription className="text-gray-400 text-xs md:text-sm">
                Choose an NFT from your connected Sui wallet to include in your
                time capsule.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 sm:space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search your NFTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-900 border-gray-600 text-white placeholder-gray-400"
                />
              </div>

              {/* NFT Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 max-h-72 sm:max-h-96 overflow-y-auto">
                {isLoadingNFTs ? (
                  <div className="col-span-full flex items-center justify-center py-8 sm:py-12">
                    <Loader2 className="h-7 w-7 animate-spin text-purple-400" />
                    <span className="ml-2 text-gray-400 text-sm">
                      Loading your NFTs...
                    </span>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredNFTs.map((nft, index) => (
                      <motion.div
                        key={nft.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.18, delay: index * 0.03 }}
                        className="bg-slate-900 rounded-xl overflow-hidden border border-gray-600 hover:border-purple-400 transition-all cursor-pointer"
                        onClick={() => handleNFTSelect(nft)}
                      >
                        <div className="aspect-square">
                          {nft.image ? (
                            <img
                              src={nft.image}
                              alt={nft.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full flex items-center justify-center bg-purple-500/20 ${
                              nft.image ? "hidden" : ""
                            }`}
                          >
                            <ImageIcon className="h-7 w-7 text-purple-400" />
                          </div>
                        </div>
                        <div className="p-2">
                          <h4 className="font-medium text-white text-xs sm:text-sm truncate">
                            {nft.name}
                          </h4>
                          <p className="text-xs text-gray-400 truncate">
                            {nft.collection}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {!isLoadingNFTs && filteredNFTs.length === 0 && (
                <div className="text-center py-6 sm:py-8">
                  <ImageIcon className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {walletNFTs.length === 0
                      ? "No NFTs found in your wallet"
                      : "No NFTs found matching your search"}
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex-1 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
          onClick={() => document.getElementById("nft-upload")?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        <input
          id="nft-upload"
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {!isConnected && (
        <p className="text-xs text-yellow-400 text-center mt-1">
          Connect your wallet to view your NFTs
        </p>
      )}
    </div>
  );
}
