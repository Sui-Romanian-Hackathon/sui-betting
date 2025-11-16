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
      <section className="max-h-[520px] space-y-3 overflow-y-auto rounded-[28px] border border-white/10 bg-black/30 px-4 py-8 text-center text-sm text-purple-100/70 shadow-inner shadow-purple-950/60 sm:px-6">
        <p className="animate-pulse">Shuffling fresh events from the chain...</p>
      </section>
    )
  }

  if (error || !bets) {
    return (
      <section className="max-h-[520px] space-y-3 overflow-y-auto rounded-[28px] border border-white/10 bg-black/30 px-4 py-8 text-center text-sm text-red-200 shadow-inner shadow-purple-950/60 sm:px-6">
        <p>Failed to load events from chain.</p>
      </section>
    )
  }

  return (
    <section className="casino-scroll max-h-[520px] space-y-4 overflow-y-auto rounded-[28px] border border-white/10 bg-black/30 px-4 py-6 shadow-inner shadow-purple-950/60 sm:px-6">
      {bets.map((bet) => (
        <Bet key={bet.id.id} bet={bet} />
      ))}
    </section>
  )
}
