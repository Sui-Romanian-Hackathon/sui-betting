//client/src/components/bet-list/bet-list.tsx

'use client'

import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Bet from './bet-card'
import { getBetList } from '../api/get-bet-list'

type BetListProps = {
  onStats?: (stats: { total: number; open: number }) => void
}

export default function BetList({ onStats }: BetListProps) {
  const {
    data: bets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['bet-list'],
    queryFn: getBetList,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
  })

  const betArray = (bets ?? []) as BetObj[]
  const previousIdsRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!bets) {
      return
    }

    const list = bets as BetObj[]
    const totals = {
      total: list.length,
      open: list.filter((bet) => !bet.is_closed).length,
    }
    onStats?.(totals)

    const currentIds = new Set<string>()
    list.forEach((bet) => {
      const id = bet.id.id
      currentIds.add(id)
      if (!previousIdsRef.current.has(id)) {
        ;(bet as BetObj & { __isNew?: boolean }).__isNew = true
        setTimeout(() => {
          ;(bet as BetObj & { __isNew?: boolean }).__isNew = false
        }, 6000)
      }
    })
    previousIdsRef.current = currentIds
  }, [bets, onStats])

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
      {betArray.map((bet) => (
        <Bet key={bet.id.id} bet={bet} />
      ))}
    </section>
  )
}
