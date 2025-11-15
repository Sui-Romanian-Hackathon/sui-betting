import Bet from './bet'
import { getBetIdArray } from './helpers/get-bet-id-array'

export default async function BetList() {
  const bets = getBetIdArray()

  return (
    <section className="max-h-[480px] space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
      {bets.map((bet) => (
        <Bet key={bet.id} bet={bet} />
      ))}
    </section>
  )
}
