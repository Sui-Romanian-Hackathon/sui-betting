//client/src/app/(dapp)/page.tsx

'use client';

import WalletGate from "@/components/wallet-gate";
import Wallet from "@/components/wallet";
import Menu from "@/components/menu/menu";
import BetList from "@/components/bet-list/bet-list";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-900 font-sans">
      <main className="w-full max-w-6xl px-4 py-10 sm:px-8">
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-zinc-200 bg-white/80 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
          <WalletGate>
            <header className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-6 dark:border-zinc-800 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold">SUI Betting</h1>
                <p className="text-sm text-zinc-500">The on-chain casino built on Sui Blockchain.</p>
              </div>
              <div className="flex flex-col items-stretch gap-4 lg:min-w-[320px] lg:items-end">
                <Wallet />
                <Menu />
              </div>
            </header>
            <BetList />
          </WalletGate>
        </div>
      </main>
    </div>
  );
}
