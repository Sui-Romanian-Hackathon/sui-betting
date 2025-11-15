import Bet from './bet'
import { getBetList } from './helpers/get-bet-list'

export default async function BetList() {
  const bets = await getBetList()

  return (
    <section className="max-h-[480px] space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
      {bets.map((bet) => (
        <Bet key={bet.id.id} bet={bet} />
      ))}
    </section>
  )
}
