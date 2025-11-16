'use client';

//client/src/app/providers.tsx

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider, createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { useState } from "react";
import { CurrencyProvider } from "@/modules/shared/currency";

const { networkConfig } = createNetworkConfig({
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
});

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider>
          <CurrencyProvider>{children}</CurrencyProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
