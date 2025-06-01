import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@mysten/dapp-kit/dist/index.css";
import { SuiClientProvider } from "@mysten/dapp-kit";
import { queryClient } from "./lib/queryClient";
import { networkConfig } from "./lib/networkConfig";
import { WalletProvider } from "@mysten/dapp-kit";
import { QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
      <WalletProvider autoConnect>
        <App />
      </WalletProvider>
    </SuiClientProvider>
  </QueryClientProvider>
);
