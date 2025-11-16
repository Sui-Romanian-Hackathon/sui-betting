'use client'

import { createContext, useContext, useMemo, useState } from 'react'

export type CurrencyUnit = 'SUI' | 'USD'

export function getSuiUsdPrice(): number {
  return 1.76
}

type CurrencyContextValue = {
  unit: CurrencyUnit
  setUnit: (unit: CurrencyUnit) => void
  toggle: () => void
  convert: (amountInSui: number) => number
  convertToUnit: (amountInSui: number, unit: CurrencyUnit) => number
  convertFromUnit: (amount: number, unit: CurrencyUnit) => number
  format: (amountInSui: number, fractionDigits?: number) => string
  formatWithUnit: (amountInSui: number, unit: CurrencyUnit, fractionDigits?: number) => string
  price: number
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null)

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnit] = useState<CurrencyUnit>('SUI')
  const price = getSuiUsdPrice()

  const value = useMemo<CurrencyContextValue>(() => {
    const convertToUnit = (amountInSui: number, targetUnit: CurrencyUnit) =>
      targetUnit === 'USD' ? amountInSui * price : amountInSui

    const convert = (amountInSui: number) => {
      if (Number.isNaN(amountInSui)) return 0
      return convertToUnit(amountInSui, unit)
    }

    const convertFromUnit = (amount: number, fromUnit: CurrencyUnit) => {
      if (Number.isNaN(amount)) return 0
      return fromUnit === 'USD' ? amount / price : amount
    }

    const formatWithUnit = (
      amountInSui: number,
      targetUnit: CurrencyUnit,
      fractionDigits = 2,
    ) => `${convertToUnit(amountInSui, targetUnit).toFixed(fractionDigits)} ${targetUnit}`

    const format = (amountInSui: number, fractionDigits = 2) => {
      const converted = convert(amountInSui)
      return `${converted.toFixed(fractionDigits)} ${unit}`
    }

    return {
      unit,
      setUnit,
      toggle: () => setUnit((prev) => (prev === 'SUI' ? 'USD' : 'SUI')),
      convert,
      convertToUnit,
      convertFromUnit,
      format,
      formatWithUnit,
      price,
    }
  }, [unit, price])

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}
