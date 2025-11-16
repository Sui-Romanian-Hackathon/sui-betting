//client/src/components/bet-list/bet-list.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
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

  const betArray = ((bets ?? []) as BetObj[]).slice().reverse()
  const knownIdsRef = useRef<Set<string>>(new Set())
  const initializedRef = useRef(false)
  const [highlightIds, setHighlightIds] = useState<Set<string>>(new Set())

  const areSetsEqual = (a: Set<string>, b: Set<string>) => {
    if (a.size !== b.size) return false
    for (const value of a) {
      if (!b.has(value)) return false
    }
    return true
  }

  useEffect(() => {
    if (!bets) {
      return
    }

    const list = betArray
    const totals = {
      total: list.length,
      open: list.filter((bet) => !bet.is_closed).length,
    }
    onStats?.(totals)

    const currentIds = new Set<string>()
    const nextHighlights = new Set(highlightIds)
    list.forEach((bet) => {
      const id = bet.id.id
      currentIds.add(id)
      if (!knownIdsRef.current.has(id) && initializedRef.current) {
        nextHighlights.add(id)
      }
    })
    if (!initializedRef.current) {
      initializedRef.current = true
    }
    knownIdsRef.current = new Set([...knownIdsRef.current, ...currentIds])
    if (!areSetsEqual(nextHighlights, highlightIds)) {
      setHighlightIds(nextHighlights)
    }
  }, [betArray, highlightIds, onStats])

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

  const handleAcknowledge = (id: string) => {
    if (!highlightIds.has(id)) {
      knownIdsRef.current.add(id)
      return
    }
    const updated = new Set(highlightIds)
    updated.delete(id)
    setHighlightIds(updated)
    knownIdsRef.current.add(id)
  }

  return (
    <section className="casino-scroll max-h-[520px] space-y-4 overflow-y-auto rounded-[28px] border border-white/10 bg-black/30 px-4 py-6 shadow-inner shadow-purple-950/60 sm:px-6">
      {betArray.map((bet) => (
        <Bet
          key={bet.id.id}
          bet={bet}
          isNew={highlightIds.has(bet.id.id)}
          onAcknowledgeNew={handleAcknowledge}
        />
      ))}
    </section>
  )
}
