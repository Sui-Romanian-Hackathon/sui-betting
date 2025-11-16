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
    <div className="relative min-h-screen text-white">
      {/* ambient lights */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-20 h-64 w-64 rounded-full bg-fuchsia-500/40 blur-[150px]" />
        <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-purple-600/40 blur-[160px]" />
        <div className="absolute bottom-0 left-1/2 h-60 w-[500px] -translate-x-1/2 rounded-[999px] bg-indigo-500/20 blur-[130px]" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-4xl rounded-[36px] border border-white/10 bg-[rgba(12,0,24,0.85)] p-[1px] shadow-[0_25px_120px_rgba(9,1,18,0.8)] backdrop-blur-2xl">
          <div className="rounded-[34px] border border-white/10 bg-[rgba(10,0,20,0.65)] p-8">

            {/* HEADER */}
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white">
                  {event.description}
                </h1>
                <p className="mt-2 text-xs text-purple-200/60">
                  Start: {event.start_ts} • End: {event.end_ts}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <CurrencySwitch />
              </div>
            </div>

            {/* STATS */}
            <div className="grid gap-6 sm:grid-cols-3 mt-10">

              {/* Long Pool */}
              <div className="rounded-[22px] border border-emerald-500/40 bg-emerald-500/10 p-6 shadow-inner shadow-emerald-900/20">
                <p className="text-xs uppercase tracking-wide text-emerald-200/70">
                  Long Pool
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-200">
                  {format(longTotal)}
                </p>
              </div>

              {/* Short Pool */}
              <div className="rounded-[22px] border border-red-500/40 bg-red-500/10 p-6 shadow-inner shadow-red-900/20">
                <p className="text-xs uppercase tracking-wide text-red-200/70">
                  Short Pool
                </p>
                <p className="mt-2 text-2xl font-bold text-red-200">
                  {format(shortTotal)}
                </p>
              </div>

              {/* Bettors */}
              <div className="rounded-[22px] border border-white/10 bg-white/5 p-6 shadow-inner shadow-purple-900/10">
                <p className="text-xs uppercase tracking-wide text-purple-200/70">
                  Total Bettors
                </p>
                <p className="mt-2 text-2xl font-bold text-white">
                  {bettors.length}
                </p>
              </div>

            </div>

            {/* LIST OF BETTORS */}
            <h2 className="mt-12 text-xl font-semibold text-white">
              Bets Placed
            </h2>

            {bettors.length === 0 && (
              <p className="mt-2 text-purple-200/60">No bets yet.</p>
            )}

            <div className="mt-6 space-y-4">
              {bettors.map((b, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5 shadow-lg shadow-black/20"
                >
                  <p className="text-xs text-purple-300/70 mb-2">
                    {b.address}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                    <div>
                      <p className="text-purple-200/60">Amount</p>
                      <p className="text-white font-medium">
                        {format(toSui(b.amount))}
                      </p>
                    </div>

                    <div>
                      <p className="text-purple-200/60">Side</p>
                      <p className="text-white font-medium">
                        {b.side === 1 ? 'LONG' : 'SHORT'}
                      </p>
                    </div>

                    <div>
                      <p className="text-purple-200/60">Claimed</p>
                      <p className="text-white font-medium">
                        {b.claimed ? 'YES' : 'NO'}
                      </p>
                    </div>

                    <div>
                      <p className="text-purple-200/60">Win Chance</p>
                      <p className="text-white/60 text-sm italic">(coming soon)</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
