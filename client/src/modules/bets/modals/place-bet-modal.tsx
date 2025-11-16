/* eslint-disable @typescript-eslint/no-explicit-any */
// client/src/components/bet-list/modals/place-bet.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import { MIST_PER_SUI } from '@mysten/sui/utils'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { useCurrency } from '@/modules/shared/currency'
import JackpotSpinModal from '@/modules/to-integrate/jackpot-spin-modal'

type PlaceBetPopupProps = {
  bet: BetObj
  option: 'yes' | 'no'
  maxBalance: number
  onClose: () => void
}

const PACKAGE_ID = '0x8fcc86d396abd6a468be3bcccfa9a02b0693319ae645389d561ec8012412fa71'

export default function PlaceBetPopup({ bet, option, maxBalance, onClose }: PlaceBetPopupProps) {
  const [amountSui, setAmountSui] = useState(10)
  const dialogRef = useRef<HTMLDivElement>(null)
  const { unit, format, formatWithUnit, convertToUnit, convertFromUnit } = useCurrency()
  const [showJackpot, setShowJackpot] = useState(false)
  // NEW STATES:
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // Wallet hooks
  const account = useCurrentAccount()
  const signAndExecute = useSignAndExecuteTransaction()

  const handlePlaceBet = async () => {
    if (!account) {
      setStatus('error')
      setErrorMessage('Wallet not connected.')
      return
    }

    try {
      setStatus('loading')

      const betSide = option === 'yes' ? 1 : 2
      const timestamp = Math.floor(Date.now() / 1000)
      const mist = BigInt(Math.floor(amountSui * 1_000_000_000))

      // Build transaction
      const tx = new Transaction()
      const stakeCoin = tx.splitCoins(tx.gas, [tx.pure.u64(mist)])

      tx.moveCall({
        target: `${PACKAGE_ID}::bet::place_bet`,
        arguments: [tx.object(bet.id.id), tx.pure.u8(betSide), stakeCoin, tx.pure.u64(timestamp)],
      })

      console.log('➡️ Sending transaction to blockchain...')
      const result = await signAndExecute.mutateAsync({
        transaction: tx,
      })

      console.log('✅ TX SUCCESS:', result)

      setStatus('success')
      setShowJackpot(true)
    } catch (err: any) {
      console.error('❌ TX FAILED:', err)
      setStatus('error')
      setErrorMessage(err?.message ?? 'Transaction failed.')
    }
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const displayValue = parseFloat(e.target.value)
    const valueInSui = convertFromUnit(displayValue, unit)
    if (!Number.isFinite(valueInSui)) return
    setAmountSui(Math.min(valueInSui, maxBalance))
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const displayValue = parseFloat(e.target.value) || 0
    const valueInSui = convertFromUnit(displayValue, unit)
    if (valueInSui <= maxBalance) {
      setAmountSui(valueInSui)
    }
  }

  const handleQuickAmount = (v: number) => setAmountSui(v)

  const parsePoolTotal = (value?: number | string) => Number(value ?? 0) / Number(MIST_PER_SUI)

  const longPoolTotal = parsePoolTotal(bet.long_pool?.fields?.total)
  const shortPoolTotal = parsePoolTotal(bet.short_pool?.fields?.total)
  const totalPool = longPoolTotal + shortPoolTotal
  const sidePool = option === 'yes' ? longPoolTotal : shortPoolTotal
  const adjustedSidePool = sidePool + amountSui
  const adjustedTotalPool = totalPool + amountSui
  const ratio = adjustedSidePool > 0 ? amountSui / adjustedSidePool : 0
  const potentialPayout = ratio > 0 ? adjustedTotalPool * ratio : amountSui

  const displayAmount = convertToUnit(amountSui, unit)
  const maxDisplayAmount = convertToUnit(maxBalance, unit)
  const oppositeUnit = unit === 'SUI' ? 'USD' : 'SUI'

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dialogRef.current) return
      if (!dialogRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleJackpotClose = () => {
    setShowJackpot(false)
    onClose()
  }

  if (showJackpot) {
    return (
      <JackpotSpinModal
        betAmount={amountSui}
        potentialPayout={potentialPayout}
        onClose={handleJackpotClose}
      />
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          ref={dialogRef}
          className="pointer-events-auto w-full max-w-2xl rounded-[32px] border border-white/15 bg-gradient-to-br from-[#1a0035] via-[#05000f] to-[#0a0116] p-1 text-white shadow-[0_40px_160px_rgba(8,0,20,0.85)]"
        >
          <div className="rounded-[30px] border border-white/10 bg-black/60 p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.45em] text-purple-200/70">
                  Purple Palace Bet Slip
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{bet.description}</h3>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    option === 'yes' ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  Betting on {option.toUpperCase()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full border border-white/20 px-4 py-1 text-sm text-white/70 transition hover:border-white hover:text-white"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-xs text-purple-100/80">
                <p className="uppercase tracking-[0.3em] text-purple-200/70">Pool Total</p>
                <p className="mt-2 text-xl font-semibold text-white">{format(totalPool)}</p>
              </div>
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-xs text-emerald-100/80">
                <p className="uppercase tracking-[0.3em] text-emerald-200/70">Yes Pool</p>
                <p className="mt-2 text-xl font-semibold text-emerald-200">
                  {format(longPoolTotal)}
                </p>
              </div>
              <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-xs text-red-100/80">
                <p className="uppercase tracking-[0.3em] text-red-200/70">No Pool</p>
                <p className="mt-2 text-xl font-semibold text-red-200">{format(shortPoolTotal)}</p>
              </div>
            </div>

            {status === 'success' && (
              <div className="mt-4 rounded-2xl border border-emerald-400/40 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                ✅ Bet placed successfully! Payout pending settlement.
              </div>
            )}
            {status === 'error' && (
              <div className="mt-4 rounded-2xl border border-red-500/40 bg-red-400/10 px-4 py-3 text-sm text-red-100 shadow-[0_0_25px_rgba(248,113,113,0.4)]">
                ❌ {errorMessage}
              </div>
            )}

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                <label className="block text-[11px] font-semibold uppercase tracking-[0.35em] text-purple-200/70 mb-2">
                  Amount ({unit})
                </label>
                <input
                  type="number"
                  min="0"
                  max={maxDisplayAmount}
                  step="0.1"
                  value={Number.isFinite(displayAmount) ? displayAmount : 0}
                  onChange={handleAmountChange}
                  className="w-full rounded-2xl border border-white/20 bg-black/60 px-3 py-3 text-sm text-white outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-600/40"
                />
                <p className="mt-2 text-xs text-purple-200/70">
                  ≈ {formatWithUnit(amountSui, oppositeUnit)}
                </p>
                <input
                  type="range"
                  min="0"
                  max={maxDisplayAmount}
                  step="0.001"
                  value={Number.isFinite(displayAmount) ? displayAmount : 0}
                  onChange={handleSliderChange}
                  className="mt-4 w-full h-2 rounded-full cursor-pointer bg-purple-900/40 accent-fuchsia-400"
                />
                <div className="flex justify-between mt-1 text-xs text-purple-200/80">
                  <span>{formatWithUnit(0, unit)}</span>
                  <span>{formatWithUnit(maxBalance, unit)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-purple-200/70 mb-3">
                    Quick Stakes
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {[0.1, 0.25, 0.5, 1].map((p) => (
                      <button
                        key={p}
                        onClick={() => handleQuickAmount(maxBalance * p)}
                        className="rounded-xl border border-white/20 bg-white/10 px-2 py-1.5 text-xs font-medium text-white transition hover:border-white/40"
                      >
                        {p === 1 ? 'Max' : `${Math.round(p * 100)}%`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-gradient-to-r from-[#2a0b43]/70 to-[#12041f]/85 p-4 text-xs text-white/80">
                  <p className="uppercase tracking-[0.35em] text-purple-200/60">Potential Win</p>
                  <p className="mt-2 text-3xl font-bold text-white">{format(potentialPayout)}</p>
                  <p className="mt-1 text-purple-200/70">
                    Based on current liquidity and your share of the {option.toUpperCase()} pool.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handlePlaceBet}
              disabled={amountSui > maxBalance || status === 'loading'}
              className={`mt-8 w-full rounded-3xl px-7 py-4 text-center font-bold text-white shadow-[0_25px_70px_rgba(148,64,255,0.5)] transition-all ${
                option === 'yes'
                  ? 'bg-gradient-to-r from-emerald-400 via-emerald-500 to-lime-400'
                  : 'bg-gradient-to-r from-red-400 via-pink-500 to-orange-400'
              }`}
            >
              {status === 'loading' ? (
                'Processing...'
              ) : (
                <>
                  <div className="text-xs uppercase tracking-[0.6em] opacity-90">Place Bet</div>
                  {/* <div className="text-2xl mt-1">{format(potentialPayout)}</div> */}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
