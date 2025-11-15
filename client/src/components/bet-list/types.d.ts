type BetData = BetObj

type BetProps = {
  bet: BetData
}

type BetObj = {
  description: string
  id: { id: string }
}
type BetRegistry = {
  events: string[]
}
