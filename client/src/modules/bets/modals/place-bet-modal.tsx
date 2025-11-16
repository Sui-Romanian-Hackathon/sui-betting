/* eslint-disable @typescript-eslint/no-explicit-any */
// client/src/components/bet-list/modals/place-bet.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import { Transaction } from '@mysten/sui/transactions'
import { MIST_PER_SUI } from '@mysten/sui/utils'
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit'
import { useCurrency } from '@/modules/shared/currency'

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

      // Close popup after 1 second
      setTimeout(() => {
        onClose()
      }, 1000)
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

  const parsePoolTotal = (value?: number | string) =>
    Number(value ?? 0) / Number(MIST_PER_SUI)

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
          className="pointer-events-auto w-full max-w-md rounded-[28px] border border-white/10 bg-gradient-to-b from-[#1c0036] via-[#0b0116] to-[#06000d] p-6 text-white shadow-[0_25px_120px_rgba(8,0,15,0.8)]"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-xs font-medium text-purple-200/80 truncate max-w-[260px] uppercase tracking-[0.4em]">
                {bet.description}
              </h3>
              <span
                className={`text-sm font-semibold ${
                  option === 'yes' ? 'text-emerald-300' : 'text-red-300'
                }`}
              >
                Betting on: {option.toUpperCase()}
              </span>
            </div>
            <button onClick={onClose} className="text-purple-200/70 hover:text-white">
              ✕
            </button>
          </div>

          {/* SUCCESS MESSAGE */}
          {status === 'success' && (
            <div className="mb-4 rounded-lg border border-emerald-500 bg-emerald-500/20 text-emerald-200 px-3 py-2 text-sm text-center animate-pulse">
              ✅ Bet placed successfully!
            </div>
          )}

          {/* ERROR MESSAGE */}
          {status === 'error' && (
            <div className="mb-4 rounded-lg border border-red-500 bg-red-500/20 text-red-200 px-3 py-2 text-sm text-center">
              ❌ {errorMessage}
            </div>
          )}

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-xs font-medium text-purple-200/80 mb-2 tracking-[0.3em] uppercase">
              Amount ({unit})
            </label>
            <input
              type="number"
              min="0"
              max={maxDisplayAmount}
              step="0.1"
              value={Number.isFinite(displayAmount) ? displayAmount : 0}
              onChange={handleAmountChange}
              className="w-full rounded-2xl border border-white/20 bg-black/40 px-3 py-3 text-sm text-white outline-none transition focus:border-emerald-300 focus:ring-2 focus:ring-emerald-400/40"
            />
            <p className="mt-2 text-xs text-purple-200/70">
              ≈ {formatWithUnit(amountSui, oppositeUnit)}
            </p>
          </div>

          {/* Slider */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={maxDisplayAmount}
              step="0.001"
              value={Number.isFinite(displayAmount) ? displayAmount : 0}
              onChange={handleSliderChange}
              className="w-full h-2 rounded-full cursor-pointer bg-purple-900/40 accent-fuchsia-400"
            />
            <div className="flex justify-between mt-1 text-xs text-purple-200/80">
              <span>{formatWithUnit(0, unit)}</span>
              <span>{formatWithUnit(maxBalance, unit)}</span>
            </div>
          </div>

          {/* Quick buttons */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[0.1, 0.25, 0.5, 1].map((p) => (
              <button
                key={p}
                onClick={() => handleQuickAmount(maxBalance * p)}
                className="rounded-2xl border border-white/15 bg-white/10 px-2 py-1.5 text-xs font-medium text-white transition hover:border-white/40"
              >
                {p === 1 ? 'Max' : `${p * 100}%`}
              </button>
            ))}
          </div>

          {/* Submit button */}
          <button
            onClick={handlePlaceBet}
            disabled={amountSui > maxBalance || status === 'loading'}
            className={`w-full rounded-3xl px-7 py-4 text-center font-bold text-white shadow-[0_20px_60px_rgba(114,57,181,0.7)] transition-all ${
              option === 'yes'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}
          >
            {status === 'loading' ? (
              'Processing...'
            ) : (
              <>
                <div className="text-xs uppercase tracking-wider opacity-90">
                  Get a chance to win
                </div>
                <div className="text-2xl mt-1">{format(potentialPayout)}</div>
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}
