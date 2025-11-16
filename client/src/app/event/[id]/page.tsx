//client/src/app/event/[id]/page.tsx

import { getEventWithBets } from '@/modules/bets/api/get-event-with-bets'
import EventDetails from '@/modules/bets/components/event-details'

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

  return <EventDetails event={data.event} bettors={data.bettors} />
}
