import { getBetIdArray } from './get-bet-id-array'
import { getBetObj } from './get-bet-obj'

export async function getBetList() {
  const bets = getBetIdArray()

  const betList = await Promise.all(bets.map((bet) => getBetObj(bet)))

  betList.filter((bet) => bet !== undefined)

  return betList as BetObj[]
}
