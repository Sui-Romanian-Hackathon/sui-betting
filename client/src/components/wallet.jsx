'use client'

import { ConnectButton, useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { MIST_PER_SUI } from '@mysten/sui/utils'

function formatBalance(mist) {
  if (!mist) return '0'
  const sui = Number(mist) / Number(MIST_PER_SUI)
  // show up to 4 decimals, trim trailing zeros
  return sui.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  })
}

export default function Wallet() {
  const account = useCurrentAccount()

  const {
    data: balance,
    isPending,
    isError,
  } = useSuiClientQuery('getBalance', { owner: account?.address }, { enabled: !!account })

  const suiBalance = balance?.totalBalance ? formatBalance(balance.totalBalance) : null

  const connected = !!account

  return (
    <div className="flex flex-wrap items-center gap-3 mt-6">
      {/* Wallet status card */}
      <div className="flex items-center gap-3 rounded-xl bg-zinc-900/70 border border-zinc-800 px-4 py-2 shadow-sm">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-zinc-400">Wallet</span>

          {connected ? (
            <>
              <span className="text-xs text-zinc-400">
                {isPending && 'Fetching balance…'}
                {isError && 'Balance unavailable'}
                {!isPending && !isError && suiBalance !== null && (
                  <>
                    <span className="font-semibold text-zinc-100">{suiBalance} SUI</span>
                  </>
                )}
              </span>
            </>
          ) : (
            <span className="text-sm text-zinc-400">Not connected</span>
          )}
        </div>
      </div>

      <ConnectButton />
    </div>
  )
}
