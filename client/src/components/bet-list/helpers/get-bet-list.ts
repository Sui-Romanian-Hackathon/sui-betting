import { getBetIdArray } from './get-bet-id-array'
import { getMoveObj } from './get-move-obj'

export async function getBetList() {
  const bets = await getBetIdArray()

  const betList = await Promise.all(bets.map((bet) => getMoveObj(bet)))

  betList.filter((bet) => bet !== undefined)

  return betList as BetObj[]
}
