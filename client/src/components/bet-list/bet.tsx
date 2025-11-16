//client/src/components/bet-list/bet.tsx

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit'
import { MIST_PER_SUI } from '@mysten/sui/utils'
import PlaceBetPopup from './modals/place-bet'

type BetComponentProps = BetProps & {
  isActive?: boolean
  isHidden?: boolean
  onActivate?: (id: string) => void
  onDeactivate?: () => void
}

export default function Bet({ bet, isActive, isHidden, onActivate, onDeactivate }: BetComponentProps) {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null)
  const betObj: BetObj = bet

  // Wallet balance
  const account = useCurrentAccount()
  const { data: balance } = useSuiClientQuery(
    'getBalance',
    { owner: account?.address || '' },
    { enabled: !!account }
  )

  const maxBalance = balance?.totalBalance
    ? Number(balance.totalBalance) / Number(MIST_PER_SUI)
    : 100

  const handleOptionClick = (option: 'yes' | 'no') => {
    if (selectedOption === option) {
      setSelectedOption(null)
      onDeactivate?.()
    } else {
      setSelectedOption(option)
      onActivate?.(bet.id.id)
    }
  }

  const handleClose = () => {
    setSelectedOption(null)
    onDeactivate?.()
  }

  if (isHidden) return null

  return (
    <div className="relative w-full">
      <div className="flex w-full items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white px-7 py-6 
                      shadow-sm dark:border-zinc-800 dark:bg-zinc-900 hover:bg-zinc-100/30 dark:hover:bg-zinc-800/40 transition">

        {/* LEFT SIDE = Clickable section */}
        <Link href={`/event/${bet.id.id}`} className="flex-1 block">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {betObj.description ?? 'Loading...'}
            </h2>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              {bet.id.id}
            </p>
          </div>
        </Link>

        {/* RIGHT SIDE = Buttons */}
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => handleOptionClick('yes')}
            className={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedOption === 'yes'
                ? 'border-emerald-500 bg-emerald-500 text-white shadow-md'
                : 'border-emerald-500/50 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20'
            }`}
          >
            Yes
          </button>

          <button
            onClick={() => handleOptionClick('no')}
            className={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition-all ${
              selectedOption === 'no'
                ? 'border-red-500 bg-red-500 text-white shadow-md'
                : 'border-red-500/50 bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20'
            }`}
          >
            No
          </button>
        </div>

      </div>

      {/* Popup */}
      {selectedOption && (
        <PlaceBetPopup
          bet={betObj}
          option={selectedOption}
          maxBalance={maxBalance}
          onClose={handleClose}
        />
      )}
    </div>
  )
}