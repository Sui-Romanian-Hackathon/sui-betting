//client/src/app/event/[id]/page.tsx

import { getEventWithBets } from '@/modules/bets/api/get-event-with-bets'
import { MIST_PER_SUI } from '@mysten/sui/utils'

function formatSui(mist: string | number) {
  return (Number(mist) / Number(MIST_PER_SUI)).toFixed(4)
}

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const data = await getEventWithBets(id)

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center text-zinc-50">
        Event not found.
      </main>
    )
  }

  const event = data.event
  const bettors = data.bettors

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-900 text-zinc-50">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
        <h1 className="text-xl font-semibold">{event.description}</h1>

        <p className="mt-2 text-xs text-zinc-500">
          Start TS: {event.start_ts} • End TS: {event.end_ts}
        </p>

        <section className="grid gap-4 sm:grid-cols-3 mt-6">
          <div className="rounded-2xl border border-emerald-600/40 bg-emerald-500/5 p-4">
            <p className="text-xs text-emerald-300/80 uppercase tracking-wide">Long Pool</p>
            <p className="text-lg font-semibold text-emerald-200">
              {formatSui(event.long_pool.fields.total)} SUI
            </p>
          </div>

          <div className="rounded-2xl border border-red-600/40 bg-red-500/5 p-4">
            <p className="text-xs text-red-300/80 uppercase tracking-wide">Short Pool</p>
            <p className="text-lg font-semibold text-red-200">
              {formatSui(event.short_pool.fields.total)} SUI
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
            <p className="text-xs text-zinc-400 uppercase tracking-wide">Bettors</p>
            <p className="text-lg font-semibold text-zinc-100">{bettors.length}</p>
          </div>
        </section>

        {/* ---------------- BETTOR LIST ---------------- */}
        <h2 className="text-lg mt-10 font-semibold">Bets Placed</h2>

        {bettors.length === 0 && <p className="mt-2 text-zinc-500">No bets placed yet.</p>}

        <div className="space-y-3 mt-3">
          {bettors.map((b, i) => (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-600 mb-1">{b.address}</p>
              <p>Amount: {formatSui(b.amount)} SUI</p>
              <p>Side: {b.side === 1 ? 'LONG' : 'SHORT'}</p>
              <p>Claimed: {b.claimed ? 'YES' : 'NO'}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
