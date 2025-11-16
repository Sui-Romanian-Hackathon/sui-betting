//client/src/components/wallet.jsx

'use client';

import { useCurrentAccount, ConnectButton, useDisconnectWallet } from '@mysten/dapp-kit';

export default function Wallet() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const shortAddress = account?.address
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
    : null;

  return (
    <div className="flex w-full flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white shadow-inner shadow-purple-950/40">
      <div className="text-xs uppercase tracking-[0.4em] text-purple-200/70">Wallet</div>
      {account ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs text-purple-200/70">Connected as</p>
            <p className="text-base font-semibold">{shortAddress}</p>
          </div>
          <button
            onClick={() => disconnect()}
            className="rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 px-4 py-2 text-xs font-semibold uppercase tracking-widest shadow-lg shadow-purple-900/50 transition hover:scale-[1.02]"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <ConnectButton
          style={{
            background: 'linear-gradient(120deg,#ff3cac,#784ba0,#2b86c5)',
            borderRadius: '999px',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.25)',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            padding: '0.9rem 2.6rem',
            fontWeight: 600,
          }}
        />
      )}
    </div>
  );
}
