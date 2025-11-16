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
  const shortId = bet.id?.id ? `${bet.id.id.slice(0, 10)}...` : 'Loading'
  const isSettled = Boolean(betObj.is_settled)
  const resultSideRaw = betObj.result_side
  const resultSide = typeof resultSideRaw === 'string' ? Number(resultSideRaw) : resultSideRaw
  const winningSide = resultSide === 1 ? 'YES' : resultSide === 2 ? 'NO' : null
  const winnerBadgeClasses =
    winningSide === 'YES'
      ? 'border-emerald-300/70 bg-emerald-400/20 text-emerald-200'
      : winningSide === 'NO'
        ? 'border-red-400/60 bg-red-400/15 text-red-200'
        : 'border-white/20 bg-white/5 text-purple-100/80'
  const isClosed = Boolean(betObj.is_closed) || isSettled

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
    if (isClosed) return

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
      <div className="group flex w-full items-center justify-between gap-4 rounded-[28px] border border-white/10 bg-gradient-to-r from-[rgba(43,9,61,0.85)] via-[rgba(27,5,46,0.85)] to-[rgba(16,2,30,0.85)] px-7 py-6 text-white shadow-[0_20px_60px_rgba(8,0,15,0.75)] transition duration-300 hover:-translate-y-1 hover:border-purple-300/40">

        {/* LEFT SIDE = Clickable section */}
        <Link href={`/event/${bet.id.id}`} className="block flex-1">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-white drop-shadow">
              {betObj.description ?? 'Loading...'}
            </h2>
            <p className="mt-2 text-[11px] uppercase tracking-[0.4em] text-purple-200/70">{shortId}</p>
          </div>
        </Link>

        {/* RIGHT SIDE = Buttons */}
        {isSettled ? (
          <span className={`rounded-full border px-4 py-1.5 text-xs font-semibold tracking-[0.3em] ${winnerBadgeClasses}`}>
            Winner: {winningSide ?? 'Resolved'}
          </span>
        ) : isClosed ? (
          <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-purple-100/70">
            Betting closed
          </span>
        ) : (
          <div className="flex shrink-0 gap-3">
            <button
              onClick={() => handleOptionClick('yes')}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
                selectedOption === 'yes'
                  ? 'border-emerald-300/70 bg-gradient-to-r from-emerald-400 to-lime-400 text-black shadow-[0_10px_35px_rgba(16,185,129,0.45)]'
                  : 'border-emerald-400/40 bg-white/5 text-emerald-200 hover:border-emerald-200 hover:text-white'
              }`}
            >
              Yes
            </button>

            <button
              onClick={() => handleOptionClick('no')}
              className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
                selectedOption === 'no'
                  ? 'border-red-300/70 bg-gradient-to-r from-red-400 to-orange-400 text-black shadow-[0_10px_35px_rgba(248,113,113,0.45)]'
                  : 'border-red-400/40 bg-white/5 text-red-200 hover:border-red-200 hover:text-white'
              }`}
            >
              No
            </button>
          </div>
        )}

      </div>

      {/* Popup */}
      {selectedOption && !isClosed && (
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
