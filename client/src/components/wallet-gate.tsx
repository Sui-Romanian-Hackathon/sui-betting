//client/src/components/wallet-gate.tsx

'use client';

import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";

export default function WalletGate({ children }: { children: React.ReactNode }) {
  const account = useCurrentAccount();

  if (!account) {
    return (
      <div className="p-10 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Connect your SUI Wallet</h2>
        <p className="mb-4 text-zinc-400">Link your wallet to browse bets and place wagers.</p>
        <ConnectButton />
      </div>
    );
  }

  return <>{children}</>;
}
