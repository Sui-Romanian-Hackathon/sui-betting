//client/src/components/bet-list/types.d.ts

type BetData = BetObj

type BetProps = {
  bet: BetData
}

type BetObj = {
  description: string
  id: { id: string }
  is_closed?: boolean
  is_settled?: boolean
  result_side?: number | string
}
type BetRegistry = {
  events: string[]
}
