'use client'

import CurrencySwitch from '@/modules/layout/components/currency-switch'
import { useCurrency } from '@/modules/shared/currency'
import { MIST_PER_SUI } from '@mysten/sui/utils'

type Bettor = {
  address: string
  amount: number | string
  side: number
  claimed: boolean
}

type EventDetailsProps = {
  event: any
  bettors: Bettor[]
}

const toSui = (value: number | string) => Number(value) / Number(MIST_PER_SUI)

export default function EventDetails({ event, bettors }: EventDetailsProps) {
  const { format } = useCurrency()
  const longTotal = toSui(event.long_pool.fields.total)
  const shortTotal = toSui(event.short_pool.fields.total)

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-900 text-zinc-50">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-semibold">{event.description}</h1>
          <CurrencySwitch />
        </div>

        <p className="mt-2 text-xs text-zinc-500">
          Start TS: {event.start_ts} • End TS: {event.end_ts}
        </p>

        <section className="grid gap-4 sm:grid-cols-3 mt-6">
          <div className="rounded-2xl border border-emerald-600/40 bg-emerald-500/5 p-4">
            <p className="text-xs text-emerald-300/80 uppercase tracking-wide">Long Pool</p>
            <p className="text-lg font-semibold text-emerald-200">{format(longTotal)}</p>
          </div>

          <div className="rounded-2xl border border-red-600/40 bg-red-500/5 p-4">
            <p className="text-xs text-red-300/80 uppercase tracking-wide">Short Pool</p>
            <p className="text-lg font-semibold text-red-200">{format(shortTotal)}</p>
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400 uppercase tracking-wide">Bettors</p>
            <p className="text-lg font-semibold text-zinc-100">{bettors.length}</p>
          </div>
        </section>

        <h2 className="text-lg mt-10 font-semibold">Bets Placed</h2>

        {bettors.length === 0 && (
          <p className="mt-2 text-zinc-500">No bets placed yet.</p>
        )}

        <div className="space-y-3 mt-3">
          {bettors.map((b, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-600 mb-1">{b.address}</p>
              <p>Amount: {format(toSui(b.amount))}</p>
              <p>Side: {b.side === 1 ? 'LONG' : 'SHORT'}</p>
              <p>Claimed: {b.claimed ? 'YES' : 'NO'}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
