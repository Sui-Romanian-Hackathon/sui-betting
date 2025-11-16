//client/src/components/wallet-gate.tsx

'use client';

import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";

export default function WalletGate({ children }: { children: React.ReactNode }) {
  const account = useCurrentAccount();

  if (!account) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-6 rounded-[32px] border border-white/15 bg-black/30 p-10 text-center shadow-[0_20px_80px_rgba(15,0,35,0.7)]">
        <h2 className="text-4xl font-semibold leading-tight text-white">
          Step onto the velvet floor.
        </h2>
        <p className="max-w-2xl text-base text-purple-100/80">
          Link your wallet to unlock live predictions, curated odds, glittering pools and instant on-chain payouts.
        </p>
        <ConnectButton
          style={{
            background: 'linear-gradient(120deg, #ff45c3, #8c4bff)',
            padding: '0.85rem 2.4rem',
            color: '#fff',
            borderRadius: '999px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            border: '1px solid rgba(255,255,255,0.3)',
            textTransform: 'uppercase',
          }}
        />
      </div>
    );
  }

  return <>{children}</>;
}
