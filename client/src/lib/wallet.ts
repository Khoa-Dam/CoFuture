import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";

// Initialize Sui client
export const suiClient = new SuiClient({
  url: getFullnodeUrl("devnet"), // Use devnet for development
});

// Fetch NFTs from the connected wallet
export async function getNFTs(address: string) {
  try {
    const objects = await suiClient.getOwnedObjects({
      owner: address,
      filter: {
        MatchAny: [
          {
            StructType: "0x2::devnet_nft::DevNetNFT",
          },
        ],
      },
      options: {
        showContent: true,
        showDisplay: true,
      },
    });

    return objects.data.map((obj: any) => ({
      id: obj.data?.objectId || "",
      name: obj.data?.display?.data?.name || "Unknown NFT",
      collection: obj.data?.display?.data?.collection || "Unknown Collection",
      image:
        obj.data?.display?.data?.image_url ||
        obj.data?.display?.data?.image ||
        "",
      description: obj.data?.display?.data?.description || "",
    }));
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    return [];
  }
}
