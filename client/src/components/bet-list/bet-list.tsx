//client/src/components/bet-list/bet-list.tsx

'use client'

import { useQuery } from '@tanstack/react-query'
import Bet from './bet'
import { getBetList } from './helpers/get-bet-list'

export default function BetList() {
  const { data: bets, isLoading, error } = useQuery({
    queryKey: ['bet-list'],
    queryFn: getBetList,
  })

  if (isLoading) {
    return (
      <section className="max-h-[480px] space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        <p className="text-sm text-zinc-500">Loading events from chain...</p>
      </section>
    )
  }

  if (error || !bets) {
    return (
      <section className="max-h-[480px] space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
        <p className="text-sm text-red-400">
          Failed to load events from chain.
        </p>
      </section>
    )
  }

  return (
    <section className="max-h-[480px] space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
      {bets.map((bet) => (
        <Bet key={bet.id.id} bet={bet} />
      ))}
    </section>
  )
}
