import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  RectangleEllipsis,
  Calendar,
  Coins,
  Image as ImageIcon,
  Shield,
  Rocket,
} from "lucide-react";
import { useSuiWallet } from "@/hooks/use-sui-wallet";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { NFTSelector } from "@/components/nft-selector";
import { useWalletAdapter } from "@/hooks/useWalletAdapter";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  unlockDate: z.string().min(1, "Please select an unlock date"),
  isPrivate: z.boolean(),
  tokenAmount: z.string().optional(),
  nftId: z.string().optional(),
  nftName: z.string().optional(),
  nftCollection: z.string().optional(),
  creatorAddress: z.string().optional(), // Keep for form structure, maybe remove later if not needed
});

type FormData = z.infer<typeof formSchema>;

export default function SendCapsule() {
  const { address, isConnected } = useSuiWallet();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { sendCapsule } = useWalletAdapter();

  console.log(
    "VITE_SUI_VAULT_OBJECT_ID in client:",
    import.meta.env.VITE_SUI_VAULT_OBJECT_ID
  );

  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
      unlockDate: "",
      isPrivate: false,
      tokenAmount: "",
      nftId: "",
      nftName: "",
      nftCollection: "",
      creatorAddress: address || "",
    },
  });

  const handleNFTSelect = (nft: any) => {
    setSelectedNFT(nft);
    form.setValue("nftId", nft.id);
    form.setValue("nftName", nft.name);
    form.setValue("nftCollection", nft.collection);
  };

  const handleImageUpload = (file: File) => {
    setUploadedImage(file);
    // In a real app, you would upload the file and get back an NFT ID
    const mockNFTId = `uploaded_${Date.now()}`;
    form.setValue("nftId", mockNFTId);
    form.setValue("nftName", file.name);
    form.setValue("nftCollection", "Custom Upload");
  };

  const onSubmit = async (data: FormData) => {
    if (!isConnected || !address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to create a time capsule.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("dataasfasfasf", data);
      // Prepare data for sendCapsule
      const unlockDate = new Date(data.unlockDate).getTime();
      console.log("unlockDate:", unlockDate);
      const now = Date.now();
      const unlockDurationMs = unlockDate - now;
      if (unlockDurationMs <= 0) {
        toast({
          title: "Invalid Date",
          description: "Unlock date must be in the future.",
          variant: "destructive",
        });
        return;
      }

      // Dummy values for required blockchain parameters - in a real app, these MUST be fetched or configured
      // IMPORTANT: Replace these placeholder values with actual IDs from your Sui blockchain system to avoid errors like 'Package object does not exist'
      const vaultId = import.meta.env.VITE_SUI_VAULT_OBJECT_ID || "0x1"; // Placeholder, MUST replace with actual vault ID
      console.log("vaultId:", vaultId);
      const coinId = import.meta.env.VITE_SUI_COIN_OBJECT_ID || "0x1"; // Placeholder, MUST replace with actual coin ID
      console.log("coinId:", coinId);
      const clockId = import.meta.env.VITE_SUI_CLOCK_ID || "0x6"; // Common Sui clock ID, adjust if needed
      console.log("clockId:", clockId);

      // Convert message string to Uint8Array for encryptedContent
      const encoder = new TextEncoder();
      const encryptedContent = encoder.encode(data.message);

      const capsuleData = {
        vaultId,
        coinId,
        encryptedContent,
        unlockDurationMs,
        audience: data.isPrivate
          ? [address]
          : [
              "0x79242e9eb2b20f0c0b09d80141b55d0d64052f538297a7e8c1b24f1b06eb5aaa",
              address,
            ], // If private, only creator can see; otherwise, public
        rewardPerUser: data.tokenAmount
          ? Number(Math.floor(parseFloat(data.tokenAmount) * 1000000000))
          : 0, // Entire reward for the creator if private, or per user if public
        clockId,
        registryId:
          import.meta.env.VITE_SUI_CAPSULE_REGISTRY_OBJECT_ID || "0x1",
      };

      console.log("Sending capsule with data:", capsuleData);

      // Call sendCapsule function
      const capsule = await sendCapsule(capsuleData);
      console.log("check capsule", capsule);

      toast({
        title: "Time Capsule Created!",
        description: "Your message has been locked away until the unlock date.",
      });

      setLocation("/capsules");
    } catch (error) {
      console.error("Error creating capsule:", error);
      toast({
        title: "Creation Failed",
        description: "Failed to create time capsule. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-8 md:pt-16 bg-slate-950">
      <div className="max-w-2xl md:max-w-4xl mx-auto px-2 sm:px-6 lg:px-8 py-6 md:py-16">
        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">
            Create Time Capsule
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Lock your message and assets for future revelation
          </p>
        </motion.div>

        <motion.div
          className="gradient-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="gradient-border-content p-4 md:p-8 rounded-2xl bg-slate-900 shadow-xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 md:space-y-8"
              >
                {/* Title Field */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base md:text-lg font-semibold text-cyan-400 flex items-center">
                        <RectangleEllipsis className="mr-2 h-5 w-5" />
                        Capsule Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Give your time capsule a memorable title..."
                          className="w-full bg-slate-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message Field */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base md:text-lg font-semibold text-cyan-400 flex items-center">
                        <RectangleEllipsis className="mr-2 h-5 w-5" />
                        Your Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={6}
                          placeholder="Write your message to the future..."
                          className="w-full bg-slate-800 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Unlock Date */}
                <FormField
                  control={form.control}
                  name="unlockDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base md:text-lg font-semibold text-cyan-400 flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Unlock Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="datetime-local"
                          className="w-full bg-slate-800 border-gray-600 text-white focus:border-cyan-400 focus:ring-cyan-400/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Optional Assets */}
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-cyan-400 flex items-center">
                    <Coins className="mr-2 h-5 w-5" />
                    Optional Assets
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* SUI Tokens */}
                    <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-gray-600">
                      <h4 className="font-semibold mb-2 md:mb-3 flex items-center text-white">
                        <Coins className="text-yellow-400 mr-2 h-5 w-5" />
                        SUI Tokens
                      </h4>
                      <FormField
                        control={form.control}
                        name="tokenAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                step="0.001"
                                placeholder="0.0"
                                className="w-full bg-slate-900 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* NFT Collection */}
                    <div className="bg-slate-800 rounded-lg p-4 md:p-6 border border-gray-600">
                      <h4 className="font-semibold mb-2 md:mb-3 flex items-center text-white">
                        <ImageIcon className="text-purple-400 mr-2 h-5 w-5" />
                        NFT Assets
                      </h4>
                      {/* NFT Selector */}
                      <NFTSelector
                        onSelectNFT={handleNFTSelect}
                        onUploadImage={handleImageUpload}
                      />

                      {(selectedNFT || uploadedImage) && (
                        <div className="bg-slate-900 rounded-lg p-3 md:p-4 border border-purple-400/50 mt-2 md:mt-4">
                          <h5 className="text-xs md:text-sm font-medium text-purple-400 mb-2">
                            Selected NFT:
                          </h5>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-purple-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium text-xs md:text-base">
                                {selectedNFT?.name || uploadedImage?.name}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {selectedNFT?.collection || "Custom Upload"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 md:space-y-3 mt-2 md:mt-4">
                        <FormField
                          control={form.control}
                          name="nftName"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="NFT Name"
                                  className="w-full bg-slate-900 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="nftCollection"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="Collection Name"
                                  className="w-full bg-slate-900 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <FormField
                  control={form.control}
                  name="isPrivate"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:space-y-3">
                      <FormLabel className="text-base md:text-lg font-semibold text-cyan-400 flex items-center">
                        <Shield className="mr-2 h-5 w-5" />
                        Privacy Settings
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value: string) =>
                            field.onChange(value === "true")
                          }
                          defaultValue={field.value ? "true" : "false"}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="true" id="private" />
                            </FormControl>
                            <Label
                              htmlFor="private"
                              className="text-white text-sm md:text-base"
                            >
                              Private - Only you can see
                            </Label>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="false" id="public" />
                            </FormControl>
                            <Label
                              htmlFor="public"
                              className="text-white text-sm md:text-base"
                            >
                              Public - Visible to everyone
                            </Label>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-center pt-4 md:pt-6">
                  <Button
                    type="submit"
                    disabled={!isConnected}
                    size="lg"
                    className="w-full md:w-auto bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-purple-600 text-white px-8 md:px-12 py-3 md:py-4 font-semibold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Rocket className="mr-2 h-5 w-5" />
                    {isConnected
                      ? "Launch Time Capsule"
                      : "Please Connect Wallet"}
                  </Button>
                </div>

                {!isConnected && (
                  <p className="text-center text-yellow-400 text-sm mt-3">
                    Please connect your wallet to create a time capsule
                  </p>
                )}
              </form>
            </Form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
