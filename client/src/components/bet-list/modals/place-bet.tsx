//client/src/components/bet-list/modals/place-bet.tsx

'use client'

import { useState, useEffect } from 'react'

type PlaceBetPopupProps = {
  bet: BetObj
  option: 'yes' | 'no'
  maxBalance: number
  onClose: () => void
}

export default function PlaceBetPopup({ bet, option, maxBalance, onClose }: PlaceBetPopupProps) {
  const [amount, setAmount] = useState(10)

  // Disable scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setAmount(value)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    if (value <= maxBalance) {
      setAmount(value)
    }
  }

  const handleQuickAmount = (value: number) => {
    setAmount(value)
  }

  const handlePlaceBet = () => {
    // TODO: Implement blockchain transaction logic here
    console.log('Placing bet:', {
      betId: bet.id.id,
      option: option,
      amount: amount,
    })
    onClose()
  }

  const potentialPayout = amount * 1.95
  const potentialProfit = potentialPayout - amount

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm overflow-hidden"
        onClick={onClose}
      />
      
      {/* Centered popup container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-700 dark:bg-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[250px]">
            {bet.description}
          </h3>
          <span className={`text-sm font-semibold ${
            option === 'yes' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
          }`}>
            Betting on: {option.toUpperCase()}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          ✕
        </button>
      </div>

      {/* Amount Input */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-300 mb-2">
          Amount (SUI)
        </label>
        <input
          type="number"
          min="0"
          max={maxBalance}
          step="0.1"
          value={amount}
          onChange={handleAmountChange}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-emerald-400 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </div>

      {/* Slider */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={maxBalance}
          step="0.001"
          value={amount}
          onChange={handleSliderChange}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-700"
          style={{
            background: `linear-gradient(to right, ${
              option === 'yes' ? '#10b981' : '#ef4444'
            } 0%, ${
              option === 'yes' ? '#10b981' : '#ef4444'
            } ${(amount / maxBalance) * 100}%, #e5e7eb ${(amount / maxBalance) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          <span>0 SUI</span>
          <span>{maxBalance.toFixed(2)} SUI</span>
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {[0.1, 0.25, 0.5, 1].map((percentage) => (
          <button
            key={percentage}
            onClick={() => handleQuickAmount(maxBalance * percentage)}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            {percentage === 1 ? 'Max' : `${percentage * 100}%`}
          </button>
        ))}
      </div>

      {/* Big Bet Button */}
      <button
        onClick={handlePlaceBet}
        disabled={amount > maxBalance}
        className={`w-full rounded-xl px-7 py-4 text-center font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${
          option === 'yes'
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-emerald-500 disabled:to-emerald-600'
            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-red-500 disabled:to-red-600'
        }`}
      >
        <div className="text-xs uppercase tracking-wider opacity-90">Bet to Win</div>
        <div className="text-2xl mt-1">{potentialPayout.toFixed(2)} SUI</div>
      </button>

      {/* Cancel Button */}
    </div>
      </div>
    </>
  )
}
