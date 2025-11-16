//client/src/components/wallet.jsx

'use client';

import { useCurrentAccount, ConnectButton, useDisconnectWallet } from '@mysten/dapp-kit';

export default function Wallet() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  return (
    <div>
      {account ? (
        <button
          onClick={() => disconnect()}
          className="rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
        >
          Disconnect
        </button>
      ) : (
        <ConnectButton style={{ background: "red", color: "white" }} />
      )}
    </div>
  );
}
