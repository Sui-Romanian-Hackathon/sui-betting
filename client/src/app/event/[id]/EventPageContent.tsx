//client/src/app/event/[id]/EventPageContent.tsx

import { MIST_PER_SUI } from '@mysten/sui/utils'
import { getMoveObj } from '@/components/bet-list/helpers/get-move-obj'

export default async function EventPageContent({ id }: { id: string }) {
  console.log("SERVER PAGE — Fetching Event ID:", id)

  const data = await getMoveObj(id)

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-900 text-zinc-50">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-6 py-4">
          <p className="text-sm">Event not found on chain.</p>
        </div>
      </div>
    )
  }

  const longTotal = Number(data.long_pool.fields.total) / Number(MIST_PER_SUI)
  const shortTotal = Number(data.short_pool.fields.total) / Number(MIST_PER_SUI)
  const bettorsCount = data.bets.fields.size

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-900 text-zinc-50">
      ...
      (exact UI-ul tău aici)
      ...
    </main>
  )
}
