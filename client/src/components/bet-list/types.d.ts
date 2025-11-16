//client/src/components/bet-list/types.d.ts

type BetData = BetObj

type BetProps = {
  bet: BetData
}

type BetObj = {
  description: string
  id: { id: string }
  is_closed?: boolean
}
type BetRegistry = {
  events: string[]
}
