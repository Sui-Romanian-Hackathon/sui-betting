import { getBetIdArray } from './get-bet-id-array'
import { getBetObj } from './get-bet-obj'

export function getBetList() {
  const bets = getBetIdArray()
  const betList = bets.map((bet) => getBetObj(bet.id))

  return betList
}
