'use client'

import {
  ConnectButton,
  useCurrentAccount,
  useDisconnectWallet,
  useSuiClientQuery,
} from '@mysten/dapp-kit'
import { MIST_PER_SUI } from '@mysten/sui/utils'

function formatBalance(mist) {
  if (!mist) return '0'
  const sui = Number(mist) / Number(MIST_PER_SUI)
  // show up to 4 decimals, trim trailing zeros
  return sui.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  })
}

export default function Wallet({ showBalance = true } = {}) {
  const account = useCurrentAccount()
  const { mutateAsync: disconnect, isPending: isDisconnecting } = useDisconnectWallet()

  const {
    data: balance,
    isPending,
    isError,
  } = useSuiClientQuery('getBalance', { owner: account?.address }, { enabled: !!account })

  const suiBalance = balance?.totalBalance ? formatBalance(balance.totalBalance) : null

  const connected = !!account

  return (
    <div className="flex flex-col items-end gap-2 text-right">
      {showBalance && (
        <div className="flex items-center gap-3 rounded-2xl border border-zinc-200/60 bg-white/80 px-4 py-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/80">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Wallet Balance
            </span>

            {connected ? (
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {isPending && 'Fetching…'}
                {isError && 'Unavailable'}
                {!isPending && !isError && suiBalance !== null && `${suiBalance} SUI`}
              </span>
            ) : (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">Not connected</span>
            )}
          </div>
        </div>
      )}

      {connected ? (
        <button
          onClick={() => disconnect()}
          disabled={isDisconnecting}
          className="w-full rounded-full border border-zinc-300 px-4 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800"
        >
          {isDisconnecting ? 'Disconnecting…' : 'Disconnect'}
        </button>
      ) : (
        <ConnectButton />
      )}
    </div>
  )
}
