'use client'

import { useCurrency } from '@/modules/shared/currency'

type CurrencySwitchProps = {
  className?: string
}

export default function CurrencySwitch({ className }: CurrencySwitchProps) {
  const { unit, toggle } = useCurrency()

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center rounded-full border border-white/20 bg-white/5 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-purple-900/40 transition hover:scale-[1.03] ${className || ''}`}
    >
      <span className={`px-2 py-0.5 ${unit === 'SUI' ? 'text-emerald-300' : 'text-purple-200/70'}`}>
        SUI
      </span>
      <span className="mx-1 text-purple-200/40">/</span>
      <span className={`px-2 py-0.5 ${unit === 'USD' ? 'text-emerald-300' : 'text-purple-200/70'}`}>
        USD
      </span>
    </button>
  )
}
